package model

// Food struct
type Food struct {
	ID          uint    `json:"id" gorm:"primarykey"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Price       float32 `json:"price" sql:"type:decimal(6,2);"`
	Visible     bool    `json:"visible"`
}

// Menu struct
type WeeklyMenu struct {
	ID         uint   `json:"id" gorm:"primarykey"`
	DayOfWeek  string `json:"dayofweek"`
	WeekNumber int    `json:"weeknumber"`
	Food       Food   `json:"food" gorm:"foreignkey:FoodID"`
	FoodID     uint   `json:"foodid"`

	//	FoodID     uint   `json:"foodid"`
	//Food       Food   `json:"food" gorm:"foreignKey:ID"`
	//Food       Food   `json:"foodid" gorm:"foreignKey:FoodRefer"`
	//FoodID     Food   `json:"foodid" gorm:"foreignKey:Food.ID"`
	//FoodID Food `json:"foodid" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:FoodID;"`
}

// User represents a user account
type User struct {
	Email    string `json:"email" gorm:"uniqueIndex"`
	Password string `json:"password"`
}
