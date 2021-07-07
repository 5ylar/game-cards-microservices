package summary_server

import (
	"github.com/gofiber/fiber/v2"
)

func (s *SummaryServer) getMinClickTimesSummary(c *fiber.Ctx) error {
	userID := c.Get("User-ID")

	summary, err := s.mr.GetMinClickTimesSummary(userID)
	if err != nil {
		return err
	}

	return c.JSON(summary)
}

func (s *SummaryServer) getUserRanks(c *fiber.Ctx) error {
	ranks, err := s.mr.GetUserRanks()
	if err != nil {
		return err
	}

	return c.JSON(ranks)
}
