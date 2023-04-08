package handler

import (
	"context"
	"fmt"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"github.com/ViggoGaming/kantine/backend/configs"
	"github.com/ViggoGaming/kantine/backend/database"
	"github.com/ViggoGaming/kantine/backend/model"
)

// Get All Foods from database
func GetAllFoods(c *fiber.Ctx) error {
	db := database.DB.Db
	var foods []model.Food

	// find all foods in the database and order by ID
	db.Order("id").Find(&foods)

	// If no food found, return an error
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

func GetWeeklyMenu(c *fiber.Ctx) error {
	db := database.DB.Db
	menus := []model.WeeklyMenu{}
	weekNumber := c.Params("id")

	db.Preload("Food").Where("week_number = ?", weekNumber).Find(&menus)

	// If no food found, return an error
	if len(menus) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "No weekly menu was found",
		})
	}
	/*
		// Define the order of weekdays
		weekdayOrder := []string{"Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"}

		// Sort menus slice by weekday
		sort.Slice(menus, func(i, j int) bool {
			iWeekdayIndex := indexOf(weekdayOrder, menus[i].DayOfWeek)
			jWeekdayIndex := indexOf(weekdayOrder, menus[j].DayOfWeek)
			return iWeekdayIndex < jWeekdayIndex
		})
	*/

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Weekly menu was found",
		"data":    menus,
	})
}

// Helper function to get the index of a string in a slice
func indexOf(slice []string, str string) int {
	for i, s := range slice {
		if s == str {
			return i
		}
	}
	return -1
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

	// Parse JSON data from request body
	if err := c.BodyParser(food); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Invalid json data",
		})
	}

	// Upload image file to S3
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not upload image",
		})
	}
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		return err
	}
	client := s3.NewFromConfig(cfg)
	f, err := file.Open()
	if err != nil {
		return err
	}
	extension := filepath.Ext(file.Filename)
	newFileName := uuid.New().String() + extension
	uploader := manager.NewUploader(client)
	result, err := uploader.Upload(context.Background(), &s3.PutObjectInput{
		Bucket: aws.String("kantine-it-system"),
		Key:    aws.String(newFileName),
		Body:   f,
		ACL:    "public-read",
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not upload image",
		})
	}

	// Set image URL in the `Food` object
	food.Image = result.Location
	food.Visible = true

	// Create `Food` object in the database
	err = db.Create(&food).Error
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
	result := db.First(food, menu.FoodID)
	if result.Error != nil {
		return result.Error
	}

	menu.Food = *food

	if err := db.Create(menu).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "There can only be one food a day",
		})
	}

	return c.JSON(fiber.Map{
		"success": "Menu was created",
		"data":    menu,
	})
}

func UpdateFood(c *fiber.Ctx) error {
	db := database.DB.Db
	food := new(model.Food)
	id := c.Params("id")

	if err := db.Where("id = ?", id).First(&food).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Food not found",
		})
	}

	if err := c.BodyParser(&food); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid json data",
		})
	}

	if err := db.Save(&food).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not update food",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Food has been updated",
		"data":    food,
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

	// Delete database record
	db.Delete(&food, id)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "Food of " + id + " has been deleted",
	})

}

// add signup handler
func SignUp(c *fiber.Ctx) error {
	// parse request body into a struct
	var user model.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid json data",
		})
	}

	// check if the email already exists
	db := database.DB.Db
	var existingUser model.User
	if err := db.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Email already exists",
		})
	}

	// hash user password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not hash password",
		})
	}

	isAdmin := user.Email == configs.Config("ADMIN_EMAIL")

	newUser := &model.User{
		Email:    user.Email,
		Password: string(hashedPassword),
		Admin:    isAdmin,
	}

	if err := db.Create(newUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create user, database error",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": "User created successfully",
	})
}

// create a SignIn handler function
// SignIn verifies user credentials and generates a jwt token
func SignIn(c *fiber.Ctx) error {
	// parse request body into a struct
	var user model.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// retrieve user record
	db := database.DB.Db

	var existingUser model.User

	if err := db.Where(&model.User{Email: user.Email}).First(&existingUser).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// compare passwords
	if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(user.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// generate jwt token
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = existingUser.Email
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	tokenSigned, err := token.SignedString([]byte(configs.Config("JWT_SECRET")))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not generate token",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    tokenSigned,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func SignOut(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Successfully signed out",
	})
}

// create a CurrentUser handler function
func CurrentUser(c *fiber.Ctx) error {
	// get jwt token from cookie
	cookie := c.Cookies("jwt")
	if cookie == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// parse jwt token
	token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid token signing method")
		}
		return []byte(configs.Config("JWT_SECRET")), nil
	})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// extract email claim from token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	email, ok := claims["email"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// retrieve user record
	db := database.DB.Db

	var user model.User
	if err := db.Where(&model.User{Email: email}).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Email does not exist",
		})
	}

	// Create the response object
	currentUser := model.CurrentUser{
		Email: user.Email,
		Admin: user.Admin,
	}

	return c.JSON(currentUser)

}

func RequireAdminEmail() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Check if the user is authenticated
		tokenString := c.Cookies("jwt")
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		}

		// Parse the JWT token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Return the secret key
			return []byte(configs.Config("JWT_SECRET")), nil
		})
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		}

		// Check if the user has the required email
		email := token.Claims.(jwt.MapClaims)["email"].(string)
		if email != configs.Config("ADMIN_EMAIL") {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Forbidden",
			})
		}

		// User is authenticated and has the required email, pass control to the next handler
		return c.Next()
	}
}
