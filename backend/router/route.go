package router

import (
	"github.com/ViggoGaming/kantine/backend/handler"
	"github.com/gofiber/fiber/v2"
)

// SetupRoutes func
func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	food := api.Group("/food")
	menu := api.Group("/menu")

	// routes
	food.Get("/", handler.GetAllFoods)
	food.Get("/:id", handler.GetSingleFood)
	food.Post("/", handler.CreateFood)
	food.Post("/upload", handler.UploadImage)
	//v1.Put("/:id", handler.UpdateUser)
	food.Delete("/:id", handler.DeleteFood)
	food.Delete("/", handler.DeleteTable)

	menu.Get("/", handler.GetAllMenus)
	menu.Post("/", handler.CreateMenu)
}
