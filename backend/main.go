package main

import (
	"swing-note/database"
)

func main() {
	database.Connect()

	// engine := gin.Default()
	// engine.GET("/", func(c *gin.Context) {
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"message": "hello world",
	// 	})
	// })
	// engine.Run(":8080")

}
