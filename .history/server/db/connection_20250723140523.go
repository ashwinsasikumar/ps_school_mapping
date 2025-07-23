package db

import (
    "database/sql"
    "log"

    _ "github.com/go-sql-driver/mysql"
)

var database *sql.DB

func InitDB(dataSourceName string) {
    var err error
    database, err = sql.Open("mysql", dataSourceName)
    if err != nil {
        log.Fatal("Error opening DB:", err)
    }
    if err = database.Ping(); err != nil {
        log.Fatal("Error pinging DB:", err)
    }
    log.Println("Database connected!")
}

func GetDB() *sql.DB {
    return database
}
