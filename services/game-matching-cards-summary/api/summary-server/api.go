package summary_server

import (
	matchResult "game-matching-cards-result/internal/match-result"
	"os"

	"github.com/gofiber/fiber/v2"
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

	f.Get("/min-click-times", MiddlewareAuth, s.getMinClickTimesSummary)
	f.Get("/ranks", s.getUserRanks)

	if err := f.Listen(":" + os.Getenv("PORT")); err != nil {
		panic(err)
	}
}
