package main

import (
	"fmt"
	"log"
	"os"
	"context"

	"net/http"
	"io/ioutil"
	"encoding/json"
	

	"github.com/gorilla/mux"
	//"github.com/joho/godotenv"
	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

var rdb = redis.NewClient(&redis.Options {
	Addr: os.Getenv("REDIS_ADDRESS") + ":6379",
	DB: 0,
})

type Register struct {
	Name 			string 	`json:Name`
	Location 		string 	`json:Location`
	Age 			int		`json:Age`
	Vaccine_type 	string	`json:Vaccine_type`
	N_dose 			int		`json:N_dose`
}

func middlewareCors(next http.Handler) http.Handler {
	return http.HandlerFunc (
		func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
			
			next.ServeHTTP(w, req)
		})
}

func enableCORS(router *mux.Router) {
	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
	}).Methods(http.MethodOptions)
	
	router.Use(middlewareCors)
}

func keyEdad(age int) string {

	if age >= 0 && age <= 11 {
		return "ninos"
	} else if age >= 12 && age <= 18 {
		return "adolescentes"
	} else if age >= 19 && age <= 26 {
		return "jovenes"
	} else if age >= 27 && age <= 59 {
		return "adultos"
	} else if age >= 60 {
		return "vejez"
	} else {
		return "vejez"
	}
}

func publisherHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error con Read Body")
		log.Fatal(err)
	}

	var nuevo Register
	err = json.Unmarshal(body, &nuevo)
	if err != nil {
		fmt.Println("Error con Unmarshal")
		log.Fatal(err)
	}

	if nuevo.Age != 0 && nuevo.Name != "" {
		// Contador de edades
		_, err := rdb.Incr(ctx, keyEdad(nuevo.Age)).Result()
		if err != nil {
			fmt.Println("Error con Incr")
			log.Fatal(err)
		}
		//fmt.Println(keyEdad(nuevo.Age))

		// Agregar Nombre a la lista
		_, err = rdb.LPush(ctx, "lNombres", nuevo.Name).Result()
		if err != nil {
			fmt.Println("Error con LPush")
			log.Fatal(err)
		}
		rdb.LTrim(ctx, "lNombres", 0, 4)

		// Publicar Mensaje
		rdb.Publish(ctx, "Registros", string(body))
		fmt.Println("Registro Publicado")
	} else {
		fmt.Println("Algunos datos incompletos")
	}
}

func cleanData() {
	rdb.Set(ctx, "ninos", 0, 0)
	rdb.Set(ctx, "adolescentes", 0, 0)
	rdb.Set(ctx, "jovenes", 0, 0)
	rdb.Set(ctx, "adultos", 0, 0)
	rdb.Set(ctx, "vejez", 0, 0)

	rdb.Del(ctx, "lNombres")
}

func main() {
	/*
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	*/

	cleanData()

	router := mux.NewRouter().StrictSlash(true)
	enableCORS(router)
	
	router.HandleFunc("/registerPub", publisherHandler).Methods("POST")

	PORT, ok := os.LookupEnv("PORT")
	if !ok {
		PORT = "3500"
	}

	fmt.Println("Servidor pub en puerto", PORT)
	if err := http.ListenAndServe(":"+PORT, router); err != nil {
		log.Fatal(err)
		return
	}
}