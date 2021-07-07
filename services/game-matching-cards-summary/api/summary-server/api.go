package summary_server

import (
	matchResult "game-matching-cards-result/internal/match-result"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type SummaryServer struct {
	mr *matchResult.MatchResult
}

func New(mr *matchResult.MatchResult) *SummaryServer {
	return &SummaryServer{
		mr,
	}
}

func (s *SummaryServer) Start() {
	f := fiber.New()

	f.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "*",
		AllowHeaders: "*",
	}))

	f.Get("/min-click-times", MiddlewareAuth, s.getMinClickTimesSummary)
	f.Get("/ranks", s.getUserRanks)

	if err := f.Listen(":" + os.Getenv("PORT")); err != nil {
		panic(err)
	}
}
