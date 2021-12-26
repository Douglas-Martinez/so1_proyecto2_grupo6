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

	if age >= 1 && age <= 10 {
		return "edad1_10"
	} else if age >= 11 && age <= 20 {
		return "edad11_20"
	} else if age >= 21 && age <= 30 {
		return "edad21_30"
	} else if age >= 31 && age <= 40 {
		return "edad31_40"
	} else if age >= 41 && age <= 50 {
		return "edad41_50"
	} else if age >= 51 && age <= 60 {
		return "edad51_60"
	} else if age >= 61 && age <= 70 {
		return "edad61_70"
	} else if age >= 71 && age <= 80 {
		return "edad71_80"
	} else if age >= 81 && age <= 90 {
		return "edad81_90"
	} else if age >= 91 && age <= 100 {
		return "edad91_100"
	} else {
		return "edad91_100"
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
	rdb.Set(ctx, "edad1_10", 0, 0)
	rdb.Set(ctx, "edad11_20", 0, 0)
	rdb.Set(ctx, "edad21_30", 0, 0)
	rdb.Set(ctx, "edad31_40", 0, 0)
	rdb.Set(ctx, "edad41_50", 0, 0)
	rdb.Set(ctx, "edad51_60", 0, 0)
	rdb.Set(ctx, "edad61_70", 0, 0)
	rdb.Set(ctx, "edad71_80", 0, 0)
	rdb.Set(ctx, "edad81_90", 0, 0)
	rdb.Set(ctx, "edad91_100", 0, 0)

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
		PORT = "3050"
	}

	fmt.Println("Servidor pub en puerto", PORT)
	if err := http.ListenAndServe(":"+PORT, router); err != nil {
		log.Fatal(err)
		return
	}
}