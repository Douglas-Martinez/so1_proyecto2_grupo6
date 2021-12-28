package main

import (
	"fmt"
	"context"
	"log"
	"os"
	"encoding/json"

	//"github.com/joho/godotenv"
	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type Register struct {
	Name 			string 	`json:name`
	Location 		string 	`json:location`
	Age 			int		`json:age`
	Vaccine_type 	string	`json:vaccine_type`
	N_dose 			int		`json:n_dose`
}

var ctx = context.Background()

func main() {
	// Carga de archivo .env
	/*
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	*/
	
	// Conexion Redis
	rdb := redis.NewClient(&redis.Options {
		Addr: os.Getenv("REDIS_ADDRESS") + ":6379",
		DB: 0,
	})
	
	sub := rdb.Subscribe(ctx, "Registros")
	fmt.Println("Suscrito al canal de Redis")

	//Conexion Mongo
	//cOptions := options.Client().ApplyURI(fmt.Sprintf("mongodb://"+os.Getenv("MONGO_ADDRESS")+":27017"))
	cOptions := options.Client().ApplyURI(fmt.Sprintf("mongodb+srv://runi:runi2K22!r@cluster0.ui0ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"))
	mongoClient, err := mongo.Connect(ctx, cOptions)
	if err != nil {
		fmt.Println("Error creando cliente de Mongo")
		log.Fatal(err)
	}
	err = mongoClient.Ping(ctx, nil)
	if err != nil {
		fmt.Println("Error conectando al servidor")
		log.Fatal(err)
	}
	fmt.Println("Conectado a MongoDB")
	myMongoDB := mongoClient.Database("sopes1-data")
	collection := myMongoDB.Collection("registros")
	//collection.Drop(context.TODO())
	//collection = myMongoDB.Collection("registros")

	
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

			//Insertar MongoDB
			_, err := collection.InsertOne(context.TODO(), nuevo)
			if err != nil {
				fmt.Println("Error Insertando datos en MongoDB")
				log.Fatal(err)
			}
			fmt.Println("\tRegistro insertado en MongoDB")
		}
	}
}