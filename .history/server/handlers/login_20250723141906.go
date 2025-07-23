package handlers

import (
    "context"
    "net/http"
    "server/db"
    "server/models"

    "github.com/gin-gonic/gin"
    "google.golang.org/api/idtoken"
    "log"
)

const googleClientID = "752285667406-lblbh1eqcu9om2dlkbm9bsc10ob4659o.apps.googleusercontent.com"

type GoogleLoginRequest struct {
    Token string `json:"token"`
}

type GoogleLoginResponse struct {
    User    *models.User `json:"user,omitempty"`
    Message string       `json:"message,omitempty"`
}

func GoogleLoginHandler(c *gin.Context) {
    var req GoogleLoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, GoogleLoginResponse{Message: "token required"})
        return
    }

    ctx := context.Background()
    payload, err := idtoken.Validate(ctx, req.Token, googleClientID)
    if err != nil {
        log.Println("Google token validation error:", err)
        c.JSON(http.StatusUnauthorized, GoogleLoginResponse{Message: "Invalid Google token"})
        return
    }

    emailRaw, ok := payload.Claims["email"]
    if !ok {
        c.JSON(http.StatusUnauthorized, GoogleLoginResponse{Message: "Email not found in token"})
        return
    }
    email, ok := emailRaw.(string)
    if !ok || email == "" {
        c.JSON(http.StatusUnauthorized, GoogleLoginResponse{Message: "Invalid email in token"})
        return
    }

    user, err := models.GetUserByEmail(db.GetDB(), email)
    if err != nil {
        c.JSON(http.StatusUnauthorized, GoogleLoginResponse{Message: "User not registered"})
        return
    }
    c.JSON(http.StatusOK, GoogleLoginResponse{User: user})
}
