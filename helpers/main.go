package main

import (
	"fmt"
	"log"
	"net/http"
	"context"

	"github.com/gorilla/mux"
	"github.com/go-redis/redis"
)

var ctx = context.Background()

type Register struct {
	name 		 string `json:name`
	location	 string	`jsson:location`
	age			 int64	`json:age`
	vaccine_type string	`json:vaccine_type`
	n_dose		 int64	`json:n_dose`
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

func rootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Raizzz")
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	rdb := redis.NewClient(&redis.Options {
		Addr: 		"",
		Password: 	"",
		DB: 		0,
	})

	fmt.Println(rdb)
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	enableCORS(router)
	
	router.HandleFunc("/", rootHandler).Methods("GET")
	router.HandleFunc("/register", registerHandler).Methods("POST")

	fmt.Println("Servidor pub en puerto 3050")
	if err := http.ListenAndServe(":3050", router); err != nil {
		log.Fatal(err)
		return
	}
}