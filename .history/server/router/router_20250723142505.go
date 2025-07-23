package router

import (
    "github.com/gin-gonic/gin"
    "server/handlers"
    "server/middleware"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()
    r.Use(middleware.CORSMiddleware())

    // Existing user routes
    userRoutes := r.Group("/users")
    {
        userRoutes.GET("/", handlers.GetUsers)
        userRoutes.POST("/", handlers.CreateUser)
    }

    // New login route
    r.POST("/api/google-login", handlers.GoogleLoginHandler)

    return r
}
