package handler

import (
	"context"
	"fmt"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"github.com/ViggoGaming/kantine/backend/database"
	"github.com/ViggoGaming/kantine/backend/model"
)

// Get All Foods from db
func GetAllFoods(c *fiber.Ctx) error {

	db := database.DB.Db
	var foods []model.Food

	// find all users in the database
	db.Find(&foods)

	// If no user found, return an error
	if len(foods) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Food was not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Food was found",
		"data":    foods,
	})
}

// Get All Foods from db
/*
func GetAllMenus(c *fiber.Ctx) error {

	db := database.DB.Db
	var menus []model.WeeklyMenu

	// find all users in the database
	db.Find(&menus)

	// If no user found, return an error
	if len(menus) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Menu was not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Menu was found",
		"data":    menus,
	})
}
*/

func GetAllMenus(c *fiber.Ctx) error {
	db := database.DB.Db
	menus := []model.WeeklyMenu{}

	if err := db.Preload("Food").Find(&menus).Error; err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"success": "Menus were found",
		"data":    menus,
	})
}

func GetSingleFood(c *fiber.Ctx) error {
	db := database.DB.Db
	var food model.Food

	id := c.Params("id")

	db.First(&food, id)

	// If food is not found return error
	if food.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Food was not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Food was found",
		"data":    food,
	})

}

func CreateFood(c *fiber.Ctx) error {
	db := database.DB.Db
	food := new(model.Food)

	if err := c.BodyParser(food); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Invalid json data",
		})
	}

	err := db.Create(&food).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create food",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": "Food has been created",
		"data":    food,
	})

}

/*
func CreateMenu(c *fiber.Ctx) error {
	db := database.DB.Db
	menu := new(model.WeeklyMenu)

	if err := c.BodyParser(menu); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Invalid json data",
		})
	}

	err := db.Create(&menu).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create food",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": "menu has been created",
		"data":    menu,
	})

}
*/

func CreateMenu(c *fiber.Ctx) error {
	menu := new(model.WeeklyMenu)
	db := database.DB.Db
	if err := c.BodyParser(menu); err != nil {
		return err
	}

	food := new(model.Food)
	result := db.First(food, menu.Food.ID)
	if result.Error != nil {
		return result.Error
	}

	menu.Food = *food

	if err := db.Create(menu).Error; err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"success": "Menu was created",
		"data":    menu,
	})
}

func DeleteFood(c *fiber.Ctx) error {
	db := database.DB.Db

	var food model.Food

	// get id params
	id := c.Params("id")

	// If not found the food struct will be 0
	//err := db.First(&food, id).Error

	if err := db.First(&food, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Food was not found",
		})
	}

	// Delete S3 object
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return err
	}

	client := s3.NewFromConfig(cfg)

	filename := filepath.Base(food.Image)

	// Create the input parameters for the DeleteObject operation
	result := &s3.DeleteObjectInput{
		Bucket: aws.String("kantine-it-system"),
		Key:    aws.String(filename),
	}

	// Execute the DeleteObject operation
	_, err = client.DeleteObject(context.TODO(), result)

	if err != nil {
		return err
	}

	fmt.Println(result)

	// Delete database record
	db.Delete(&food, id)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Food of " + id + " has been deleted",
	})

}

func UploadImage(c *fiber.Ctx) error {

	file, err := c.FormFile("image")

	if err != nil {
		return err
	}

	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return err
	}

	client := s3.NewFromConfig(cfg)

	// Open file
	f, err := file.Open()

	if err != nil {
		return err
	}

	extension := filepath.Ext(file.Filename)
	newFileName := uuid.New().String() + extension

	uploader := manager.NewUploader(client)
	result, err := uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("kantine-it-system"),
		Key:    aws.String(newFileName),
		Body:   f,
		ACL:    "public-read",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": result.Location,
	})
}

func DeleteTable(c *fiber.Ctx) error {
	db := database.DB.Db
	var food model.Food
	db.Where("1 = 1").Delete(&food)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Deleted everything in the PostgreSQL database",
	})

}
