# Information about the folder structure


* config
    * **Loads environment variables from .env** 
    * config.go
* database
    * **Sets up the connection to the PostgreSQL database**
    * database.go
* handler
    * **All of the handler functions which gets called when you hit a endpoint**
    * handler.go
* model
    * **Defines the structs which is used as a skeleton for the database**
    * food.go
* router
    * **Sets up all of the endpoints/routes**
    * route.go

* ...
    * main.go
    * .env
    * README.md
