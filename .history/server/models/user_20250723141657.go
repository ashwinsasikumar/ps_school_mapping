package models




type User struct {
    ID      int            `json:"id"`
    UserID  string         `json:"user_id"`
    Name    string         `json:"name"`
    Role    string         `json:"role"`
    MailID  string         `json:"mail_id"`
    PhNo    sql.NullString `json:"phone"`
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
