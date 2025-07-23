package utils

import (
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
    "log"
)

var DB *sql.DB

func InitDB() {
    var err error
    DB, err = sql.Open("mysql", "username:password@tcp(127.0.0.1:3306)/dbname")
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    if err = DB.Ping(); err != nil {
        log.Fatal("Database unreachable:", err)
    }

    log.Println("Database connected.")
}
