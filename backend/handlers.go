package main

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

// handler functions

// enum for ImageDensity
type ImageDensity string

const (
	LOW    ImageDensity = "low"
	MEDIUM ImageDensity = "medium"
	HIGH   ImageDensity = "high"
)

// UseCase defines the payload that describes a use case
type UseCase struct {
	Tech            string        `json:"tech"`
	PV              *int          `json:"pv,omitempty"`
	UV              *int          `json:"uv,omitempty"`
	ConcurrentUsers *int          `json:"concurrent_users,omitempty"`
	QPS             *int          `json:"qps,omitempty"`
	NeedDB          bool          `json:"need_db"`
	ImageDensity    *ImageDensity `json:"image_density,omitempty"`
}

// prepare a description of the use case based on the UserCase struct
// the generated description will be used as part of the prompt
func prepareUseCaseDesc(uc *UseCase) string {
	desc := ""

	desc += "The application is built with " + uc.Tech + "."
	if uc.PV != nil {
		desc += "The application has " + strconv.Itoa(*uc.PV) + " page views per day."
	}
	if uc.UV != nil {
		desc += "The application has " + strconv.Itoa(*uc.UV) + " unique visitors per day."
	}
	if uc.ConcurrentUsers != nil {
		desc += "The application has " + strconv.Itoa(*uc.ConcurrentUsers) + " concurrent users."
	}
	if uc.QPS != nil {
		desc += "The application has " + strconv.Itoa(*uc.QPS) + " queries per second."
	}

	if uc.NeedDB {
		desc += "The application needs a database."
	} else {
		desc += "The application does not need a database."
	}

	if uc.ImageDensity == nil {
		medium := MEDIUM
		uc.ImageDensity = &medium
	}

	desc += "The average image density on each page is " + string(*uc.ImageDensity) + "."

	return desc
}

// handler function that accepts a UserCase struct as input, and returns a string
func HandleUseCase(c echo.Context) error {
	uc := new(UseCase)
	if err := c.Bind(uc); err != nil {
		return err
	}

	desc := prepareUseCaseDesc(uc)

	return c.JSON(
		200,
		map[string]string{
			"desc": desc,
		},
	)
}
