package main

import (
	"fmt"
	matchResult "game-matching-cards-result/internal/match-result"
	resultConsumer "game-matching-cards-result/mq/result-consumer"
	"os"

	"github.com/streadway/amqp"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {

	var (
		dbHost     = os.Getenv("DB_HOST")
		dbUser     = os.Getenv("DB_USER")
		dbPass     = os.Getenv("DB_PASSWORD")
		dbName     = os.Getenv("DB_NAME")
		dbPort     = os.Getenv("DB_PORT")
		dbSSLMode  = os.Getenv("DB_SSL_MODE")
		dbTimeZone = os.Getenv("DB_TIMEZONE")

		rabbitmqHost = os.Getenv("RABBITMQ_HOST")
		rabbitmqUser = os.Getenv("RABBITMQ_USER")
		rabbitmqPass = os.Getenv("RABBITMQ_PASSWORD")
		rabbitmqPort = os.Getenv("RABBITMQ_PORT")
	)

	// database
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		dbHost, dbUser, dbPass, dbName, dbPort, dbSSLMode, dbTimeZone,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	// rabbitmq
	conn, err := amqp.Dial(fmt.Sprintf("amqp://%s:%s@%s:%s/", rabbitmqUser, rabbitmqPass, rabbitmqHost, rabbitmqPort))
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}
	defer ch.Close()

	// match result module
	mr := matchResult.New(db)

	// result consumer
	rc := resultConsumer.New(ch, mr)
	if err := rc.Listen(); err != nil {
		panic(err)
	}
}
