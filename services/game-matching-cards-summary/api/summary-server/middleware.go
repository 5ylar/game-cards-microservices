package summary_server

import "github.com/gofiber/fiber/v2"

func MiddlewareAuth(c *fiber.Ctx) error {
	userID := c.Get("User-ID")

	if len(userID) == 0 {
		return fiber.ErrUnauthorized
	}

	return c.Next()
}
