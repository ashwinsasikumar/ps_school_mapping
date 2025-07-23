package models

import (
    "database/sql"
)

type User struct {
    ID      int            `json:"id"`
    UserID  string         `json:"user_id"`
    Name    string         `json:"name"`
    Role    string         `json:"role"`
    MailID  string         `json:"mail_id"`
    PhNo    sql.NullString `json:"phone"`
}

// Fetch user by email, return *User or error
func GetUserByEmail(db *sql.DB, email string) (*User, error) {
    query := `SELECT id, User_id, name, Role, Mail_id, Ph_no FROM user WHERE Mail_id=? LIMIT 1`
    usr := &User{}
    err := db.QueryRow(query, email).Scan(
        &usr.ID, &usr.UserID, &usr.Name, &usr.Role, &usr.MailID, &usr.PhNo,
    )
    if err != nil {
        return nil, err
    }
    return usr, nil
}
