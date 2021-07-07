package main

import (
	"fmt"
	summaryServer "game-matching-cards-result/api/summary-server"
	matchResult "game-matching-cards-result/internal/match-result"
	"os"

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

	// summary cache module
	mr := matchResult.New(db)

	// api server
	server := summaryServer.New(mr)
	server.Start()
}
