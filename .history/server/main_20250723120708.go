package main

import (
    "log"
    "server/router"
)

func main() {
    r := router.SetupRouter()
    log.Println("Server running on http://localhost:8080")
    r.Run(":8080")
}
