package main

import (
	"errors"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"

	gogpt "github.com/sashabaranov/go-gpt3"
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
		// rstrip and lstrip the | character
		row = strings.Trim(row, "|")
		// split the row by |
		row = strings.TrimSpace(row)
		rowParts := strings.Split(row, "|")
		if len(rowParts) != 5 {
			return nil, errors.New("failed to parse markdown table")
		}
		resource := Resource{
			Component: strings.TrimSpace(rowParts[0]),
			Spec:      strings.TrimSpace(rowParts[1]),
			Units:     strings.TrimSpace(rowParts[2]),
			Cost:      strings.TrimSpace(rowParts[3]),
			Desc:      strings.TrimSpace(rowParts[4]),
		}

		// if the component is total, ignore it
		// if the component is empty, ignore it
		if resource.Component == "Component" || resource.Component == "Total" || resource.Component == "" {
			continue
		}
		// if the component starts with ---, ignore it
		if strings.HasPrefix(resource.Component, "---") {
			continue
		}

		resources = append(resources, resource)

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

type UseCaseDescription struct {
	Desc string `json:"desc"`
}

func getHandleFuncGivenPricing(pricing string) func(c echo.Context) error {
	token := os.Getenv("OPENAI_API_KEY")
	client := gogpt.NewClient(token)

	return func(c echo.Context) error {
		desc := new(UseCaseDescription)

		if err := c.Bind(desc); err != nil {
			return err
		}
		log.Println(desc)

		// get the architecture design from the openAI API
		prompt := preparePromptArch(desc.Desc, pricing)

		// call the openAI API
		context := c.Request().Context()

		request := gogpt.CompletionRequest{
			Model:       gogpt.GPT3TextDavinci003,
			Prompt:      prompt,
			MaxTokens:   500,
			Temperature: 0.2,
			TopP:        1,
		}

		response, err := client.CreateCompletion(context, request)
		if err != nil {

			return c.JSON(
				500,
				map[string]string{
					"error": err.Error(),
				},
			)
		}

		// get the resource table from the openAI API
		// concat the returned architecture design with the prompt
		archDesign := response.Choices[0].Text
		log.Println(archDesign)
		prompt = prompt + archDesign + "\n"
		prompt = preparePromptResourceTable(prompt)

		request = gogpt.CompletionRequest{
			Model:       gogpt.GPT3TextDavinci003,
			Prompt:      prompt,
			MaxTokens:   500,
			Temperature: 0.2,
			TopP:        1,
		}

		response, err = client.CreateCompletion(context, request)
		if err != nil {

			return c.JSON(
				500,
				map[string]string{
					"error": err.Error(),
				},
			)

		}

		// concat the returned resource table with the architecture design
		resourceTable := response.Choices[0].Text
		log.Println(resourceTable)
		fullContent := prompt + resourceTable

		// parse the resource table
		resources, err := extractResourceTableFromResponse(fullContent)
		if err != nil {
			// retry once
			response, err = client.CreateCompletion(context, request)
			if err != nil {
				// return the error
				return c.JSON(
					500,
					map[string]string{
						"error": err.Error(),
					},
				)
			}
		}

		return c.JSON(
			200,
			map[string]interface{}{
				"arch":      archDesign,
				"resources": resources,
			},
		)

	}
}
