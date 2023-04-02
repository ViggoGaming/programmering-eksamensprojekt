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
	food.Post("/", handler.RequireAdminEmail(), handler.CreateFood)
	food.Post("/upload", handler.RequireAdminEmail(), handler.UploadImage)
	food.Put("/:id", handler.RequireAdminEmail(), handler.UpdateFood)
	food.Delete("/:id", handler.RequireAdminEmail(), handler.DeleteFood)
	food.Delete("/", handler.RequireAdminEmail(), handler.DeleteTable)

	menu.Get("/", handler.GetAllMenus)
	menu.Post("/", handler.RequireAdminEmail(), handler.CreateMenu)

	// add a user route for sign in, sign up, sign out
	user := api.Group("/user")
	user.Get("/", handler.CurrentUser)
	user.Post("/signup", handler.SignUp)
	user.Post("/signin", handler.SignIn)
	user.Post("/signout", handler.SignOut)

}
