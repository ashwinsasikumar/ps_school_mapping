package models



type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// Dummy DB simulation
var users []User

func GetAllUsers() []User {
    return users
}

func CreateUser(user User) error {
    user.ID = len(users) + 1
    users = append(users, user)
    return nil
}
