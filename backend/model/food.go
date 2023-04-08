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
}

// User represents a user account
type User struct {
	Email    string `json:"email" gorm:"uniqueIndex"`
	Password string `json:"password"`
	Admin    bool   `json:"admin"`
}

// CurrentUser represents a logged in user
type CurrentUser struct {
	Email string `json:"email" gorm:"uniqueIndex"`
	Admin bool   `json:"admin"`
}
