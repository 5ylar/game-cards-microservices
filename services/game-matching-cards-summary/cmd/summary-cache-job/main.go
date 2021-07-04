package main

import (
	"fmt"
	summaryCache "game-matching-cards/internal/summary-cache"
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
		dbSSLMode  = os.Getenv("SSL_MODE")
		dbTimeZone = os.Getenv("TIMEZONE")
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
	sc := summaryCache.New(db)
}
