# multi-stage build and run the backend written in go

# build stage
FROM golang:1.18-alpine AS build-env
ADD . /app
WORKDIR /app
RUN go mod download
RUN go build -o /go/bin/backend

# final stage
FROM alpine

LABEL or.opencontainers.image.source="https://github.com/yuhuishi-convect/linode-cost-assistent"

COPY --from=build-env /go/bin/backend /app/backend
# copy the resources and .env files
COPY --from=build-env /app/resources /app/resources
WORKDIR /app
ENTRYPOINT ["/app/backend"]

