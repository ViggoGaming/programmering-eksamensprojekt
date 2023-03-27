package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config func to get env value from key
func Config(key string) string {

	var PRODUCTION bool = true

	if PRODUCTION {
		// load env from railway
		err := godotenv.Load()
		if err != nil {
			fmt.Print("Error loading env")
		}
		return os.Getenv(key)
	} else {
		// load .env file
		err := godotenv.Load(".env")
		if err != nil {
			fmt.Print("Error loading .env file")
		}
		return os.Getenv(key)
	}

}
