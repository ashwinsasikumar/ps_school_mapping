package main

import (
	"log"
	"os"
	"server/db"
	"server/handlers"
	"server/router"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to database
	if err := db.ConnectDB(); err != nil {
		log.Fatalf("❌ Failed to connect to DB: %v", err)
	}

	// Initialize Gin router
	r := gin.Default()

	// Enhanced CORS config
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"}
	config.AllowCredentials = true
	config.ExposeHeaders = []string{"Content-Length", "Content-Type"}
	r.Use(cors.New(config))

	// Setup routes
	router.SetupRouter(r)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Admin endpoint for manual trigger (protected in production)
	r.POST("/admin/trigger-degradation", func(c *gin.Context) {
		// In production, add authentication middleware here
		if os.Getenv("ENV") == "production" {
			c.JSON(403, gin.H{"error": "Forbidden"})
			return
		}
		
		go handlers.CheckAndDegradeInactiveUsers()
		c.JSON(200, gin.H{"message": "Degradation process triggered manually"})
	})

	// Start the daily degradation scheduler
	go startDegradationScheduler()

	log.Println("🚀 Server running on http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("❌ Failed to start server: %v", err)
	}
}

func startDegradationScheduler() {
	// Initial delay to allow server to fully start
	time.Sleep(5 * time.Second)
	
	// Get scheduled time from env or use default (9 PM)
	degradeTime := os.Getenv("DEGRADE_TIME")
	if degradeTime == "" {
		degradeTime = "21:00"
	}

	log.Printf("⏰ Starting daily degradation scheduler (runs at %s each day)...", degradeTime)
	
	// Calculate time until next scheduled time
	now := time.Now()
	scheduledTime, err := time.Parse("15:04", degradeTime)
	if err != nil {
		log.Fatalf("❌ Invalid DEGRADE_TIME format: %v", err)
	}

	nextRun := time.Date(
		now.Year(), now.Month(), now.Day(),
		scheduledTime.Hour(), scheduledTime.Minute(), 0, 0,
		now.Location(),
	)
	
	if now.After(nextRun) {
		nextRun = nextRun.Add(24 * time.Hour)
	}
	
	initialDelay := nextRun.Sub(now)
	log.Printf("⏳ Next degradation check at %s", nextRun.Format("2006-01-02 15:04:05"))

	// Initial timer for first run
	time.AfterFunc(initialDelay, func() {
		handlers.CheckAndDegradeInactiveUsers()
		
		// Start daily ticker
		ticker := time.NewTicker(24 * time.Hour)
		for range ticker.C {
			handlers.CheckAndDegradeInactiveUsers()
		}
	})
}