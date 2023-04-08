package main

import (
	"os"

	"github.com/ViggoGaming/kantine/backend/database"
	"github.com/ViggoGaming/kantine/backend/router"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()
	app := fiber.New()

	// Setup cors so the backend can share cookies with the frontend
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "https://programmering-eksamensprojekt.vercel.app, https://programmering-eksamensprojekt-production.up.railway.app, http://localhost:3000",
		AllowCredentials: true,
	}))
	router.SetupRoutes(app)

	// health check route
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "ok",
		})
	})

	// handle unavailable route
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Unavailable route",
		})
	})

	// start server
	var port string
	if port = os.Getenv("PORT"); port == "" {
		port = "8080"
	}
	app.Listen(":" + port)
}
