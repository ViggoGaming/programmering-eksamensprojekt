package main

import (
	"github.com/ViggoGaming/kantine/backend/database"
	"github.com/ViggoGaming/kantine/backend/router"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()
	app := fiber.New()
	app.Use(cors.New())
	router.SetupRoutes(app)
	// handle unavailable route
	app.Use(func(c *fiber.Ctx) error {
		//return c.SendStatus(404) // => 404 "Not Found"
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"error": "Unavailable route",
		})
	})
	app.Listen(":3000")

}
