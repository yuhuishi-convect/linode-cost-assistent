package main

// main is the entry point for the backend server.

import (
	"bufio"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func readPriceInfo(priceFilePath string) (string, error) {
	// read the price info from the file
	content := ""
	file, err := os.Open(priceFilePath)
	if err != nil {
		return content, err
	}

	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		content += "\n"
		content += scanner.Text()
	}

	if err := scanner.Err(); err != nil {
		return content, err
	}

	return content, nil
}

func readAllPriceInfo() (string, error) {
	// read all the price info from the folder
	priceFolderPath := "./resources/"
	filesToRead := []string{
		"cpu-dedicated.txt",
		"cpu-shared.txt",
		"db-dedicated.txt",
		"db-shared.txt",
		"block-storage.txt",
		"object-storage.txt",
	}
	headerLine := []string{
		"CPU Dedicated",
		"CPU Shared",
		"DB Dedicated",
		"DB Shared",
		"Block Storage",
		"Object Storage",
	}
	// read all the files and concatenate the content
	content := ""
	for i, file := range filesToRead {
		fileContent, err := readPriceInfo(priceFolderPath + file)
		if err != nil {
			return content, err
		}
		// put a header line before each file
		content += "\n" + headerLine[i] + ":"
		content += fileContent
		content += "\n"
	}

	return content, nil
}

func main() {
	// read the price info
	content, err := readAllPriceInfo()
	if err != nil {
		panic(err)
	}

	// load the env file
	err = godotenv.Load()
	if err != nil {
		panic(err)
	}

	fmt.Println(content)

	// start a new echo server
	e := echo.New()
	// cors middleware
	e.Use(middleware.CORS())

	e.GET("/health", func(c echo.Context) error {
		return c.String(200, "OK")
	})
	e.POST("/usecase", HandleUseCase)
	archFunc := getHandleFuncGivenPricing(content)
	e.POST("/arch", archFunc)
	e.Logger.Fatal(e.Start(":8080"))

}
