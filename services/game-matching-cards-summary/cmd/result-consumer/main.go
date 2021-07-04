package result_consumer

import (
	"fmt"
	matchResult "game-matching-cards/internal/match-result"
	resultConsumer "game-matching-cards/mq/result-consumer"
	"os"

	"github.com/go-redis/redis/v8"
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
		dbSSLMode  = os.Getenv("SSL_MODE")
		dbTimeZone = os.Getenv("TIMEZONE")

		rabbitmqHost = os.Getenv("RABBITMQ_HOST")
		rabbitmqUser = os.Getenv("RABBITMQ_User")
		rabbitmqPass = os.Getenv("RABBITMQ_PASSWORD")
		rabbitmqPort = os.Getenv("RABBITMQ_PORt")

		redisHost = os.Getenv("REDIS_HOST")
		redisPass = os.Getenv("REDIS_PASSWORD")
		redisPort = os.Getenv("REDIS_PORT")
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
	conn, err := amqp.Dial(fmt.Sprintf("amqp://%s:%s@%s:%s/", rabbitmqHost, rabbitmqUser, rabbitmqPass, rabbitmqPort))
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"hello", // name
		false,   // durable
		false,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)
	if err != nil {
		panic(err)
	}

	// rabbitmq self-healing

	// redis
	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", redisHost, redisPort),
		Password: redisPass, // no password set
		DB:       0,         // use default DB
	})

	// match result module
	mr := matchResult.New(db, redisClient)

	// result consumer
	rc := resultConsumer.New(ch, mr)
	if err := rc.Listen(q); err != nil {
		panic(err)
	}
}
