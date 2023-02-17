# CostGPT

CostGPT is a natural language based cloud resource cost estimator.
It is built based on [Open AI's GPT API](https://openai.com/api/).

Users describe their cloud resource usage in natural language and CostGPT returns the estimated resources needed to run the application, and the estimated cost of each resource.

See a [demo video here](https://share.descript.com/view/jF153lCMvvP).

Try it out [here](https://costgpt.cloud/).

## Usage

Generate an API key from [Open AI's GPT API](https://openai.com/api/).
Copy the API key into a file at `backend/.env`.

```bash
echo << EOF > backend/.env
OPENAI_API_KEY=<your api key>
OPENAI_MODEL=text-davinci-003
EOF

```
Start the service locally.

```bash
docker-compose -f docker-compose.dev.yaml up

# then visit http://localhost
```

# License

The project is licensed under the Apache License 2.0.
