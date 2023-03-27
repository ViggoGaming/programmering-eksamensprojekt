package database

import (
	"fmt"
	"os"
	"strconv"

	"gorm.io/driver/postgres"

	"github.com/ViggoGaming/kantine/backend/config"
	"github.com/ViggoGaming/kantine/backend/model"

	"gorm.io/gorm"
)

// Database instance
type Dbinstance struct {
	Db *gorm.DB
}

var DB Dbinstance

// Connect function
func Connect() {
	p := config.Config("DB_PORT")
	// because our config function returns a string, we are parsing our str to int here
	port, err := strconv.ParseUint(p, 10, 32)
	if err != nil {
		fmt.Println("Error parsing str to int")
	}
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d", config.Config("DB_HOST"), config.Config("DB_USER"), config.Config("DB_PASSWORD"), config.Config("DB_NAME"), port)
	fmt.Println(config.Config("DB_USER"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("Failed to connect to database. \n", err)
		os.Exit(2)
	}

	fmt.Println("Connected")
	fmt.Println("running migrations")
	//db.DropTableIfExists(&model.Food{}, &model.WeeklyMenu{})
	db.AutoMigrate(&model.Food{}, &model.WeeklyMenu{})
	//db.Model(&model.WeeklyMenu{}).AddForeignKey()

	//	db.Model(&model.WeeklyMenu{}).AddForeignKey("food_id", "foods(id)", "RESTRICT", "RESTRICT")

	DB = Dbinstance{
		Db: db,
	}
}
