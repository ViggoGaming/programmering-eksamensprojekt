package configs

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config func to get env value from key
func Config(key string) string {
	// load env from railway
	err := godotenv.Load()

	if err != nil {
		fmt.Print("Error loading env")
	}

	godotenv.Load("../.env")
	if err != nil {
		fmt.Print("Error loading .env file")
	}
	return os.Getenv(key)
}
