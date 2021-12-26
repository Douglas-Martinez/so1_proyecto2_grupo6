package main

import (
	"fmt"
	"context"
	"log"
	"os"
	"encoding/json"

	"github.com/joho/godotenv"
	"github.com/go-redis/redis/v8"	
)

type Register struct {
	Name 			string 	`json:Name`
	Location 		string 	`json:Location`
	Age 			int		`json:Age`
	Vaccine_type 	string	`json:Vaccine_type`
	N_dose 			int		`json:N_dose`
}

var ctx = context.Background()

func main() {
	// Carga de archivo .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	
	// Conexion Redis
	rdb := redis.NewClient(&redis.Options {
		Addr: os.Getenv("REDIS_ADDRESS") + ":6379",
		DB: 0,
	})
	
	sub := rdb.Subscribe(ctx, "Registros")
	fmt.Println("Suscrito al canal de Redis")

		for {
		// Subscriber de Redis
		msg, err := sub.ReceiveMessage(ctx)
		if err != nil {
			fmt.Println("Error reciviendo datos")
			log.Fatal(err)
		} else {
			var nuevo Register
			err = json.Unmarshal([]byte(msg.Payload), &nuevo)
			if err != nil {
				fmt.Println("Error Convirtiendo datos")
				log.Fatal(err)
			}
			fmt.Print("Mensaje recibido del canal '" + msg.Channel + "': ")
			fmt.Println(nuevo.Name + " - " + nuevo.Location)
		}
	}
}