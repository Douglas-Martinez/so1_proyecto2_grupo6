package main

import (
	"fmt"
	"log"
	"os"
	"context"

	"github.com/joho/godotenv"
	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var ctx = context.Background()

func main() {
	// Se debe crear un archivo .env con los strings de conexion como variables de entorno
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Mongo
	cOptions := options.Client().ApplyURI(os.Getenv("MONGO_ADDRESS"))
	mongoClient, err := mongo.Connect(context.TODO(), cOptions)
	if err != nil {
		fmt.Println("Error creando cliente de Mongo")
		log.Println(err)
	}
	err = mongoClient.Ping(ctx, nil)
	if err != nil {
		fmt.Println("Error conectando al servidor")
		log.Fatal(err)
	}
	fmt.Println("Conectado a MongoDB")
	myMongoDB := mongoClient.Database("sopes1-data")
	collection := myMongoDB.Collection("registros")
	collection.Drop(context.TODO())
	collection = myMongoDB.Collection("registros")
	fmt.Println("Coleccion de Mongo limpia")

	// Redis
	opt, err := redis.ParseURL(os.Getenv("REDIS_ADDRESS"))
	if err != nil {
		fmt.Println("Error con URL de redis")
		log.Fatal(err)
	}
	rdb := redis.NewClient(opt)
	fmt.Println("Conectado a Redis")

	rdb.Set(ctx, "ninos", 0, 0)
	rdb.Set(ctx, "adolescentes", 0, 0)
	rdb.Set(ctx, "jovenes", 0, 0)
	rdb.Set(ctx, "adultos", 0, 0)
	rdb.Set(ctx, "vejez", 0, 0)
	rdb.Del(ctx, "lNombres")

	fmt.Println("Registros de Redis Limpios")
}