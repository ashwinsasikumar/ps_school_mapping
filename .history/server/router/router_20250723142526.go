package router

import (
    "github.com/gin-gonic/gin"
    "server/handlers"
    "server/middleware"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()

    // Apply middleware
    r.Use(middleware.CORSMiddleware())

    // Routes
    userRoutes := r.Group("/users")
    {
        userRoutes.GET("/", handlers.GetUsers)
        userRoutes.POST("/", handlers.CreateUser)
    }

    return r
}
