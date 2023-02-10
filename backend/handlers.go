package main

import (
	"errors"
	"regexp"
	"strconv"
	"strings"

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

// prepare the prompt to get the architecture design from the openAI API
func preparePromptArch(desc string, pricing string) string {
	result := "Pricing information:\n"
	result += pricing
	result += "\n"
	result += "Use case description:\n"
	result += desc
	result += "\n"
	result += "Architecture design:\n"

	return result
}

// prepare the prompt to get the resource table from the openAI API
func preparePromptResourceTable(desc string) string {
	result := desc
	result += "\n"
	result += "Resources and costs:\n"
	result += "```markdown\n"
	result += "| Component | Spec | Units | Cost/month | Description |\n"
	return result

}

type Resource struct {
	Component string
	Spec      string
	Units     string
	Cost      string
	Desc      string
}

// extract the table of resources from the response
func extractResourceTableFromResponse(response string) ([]Resource, error) {
	markdownTablePattern := regexp.MustCompile("(?s)Resources and costs:\n```markdown\n(.*)\n")

	matches := markdownTablePattern.FindStringSubmatch(response)
	if len(matches) < 2 {
		return nil, errors.New("failed to extract markdown table from response")
	}

	// parse the markdown table
	table := matches[1]
	tableRows := strings.Split(table, "\n")
	resources := []Resource{}
	for _, row := range tableRows {
		if row == "" {
			continue
		}
		columns := strings.Split(row, "|")
		resources = append(resources, Resource{
			Component: columns[1],
			Spec:      columns[2],
			Units:     columns[3],
			Cost:      columns[4],
			Desc:      columns[5],
		})
	}

	return resources, nil

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
