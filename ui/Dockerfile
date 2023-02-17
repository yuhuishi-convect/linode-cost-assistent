# build and run the frontend written in react in a multi-stage build

FROM node:16.13.0-alpine3.14 AS build-env

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ADD . /app

WORKDIR /app
RUN yarn install

# write the env variables to the .env file
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env
RUN  yarn build

# copy the build folder to the final stage
# serve the built files with caddy web server

FROM caddy:2.4.5-alpine
LABEL or.opencontainers.image.source="https://github.com/yuhuishi-convect/linode-cost-assistent"
COPY --from=build-env /app/build /usr/share/caddy

# expose port 80
EXPOSE 80

# run caddy web server
CMD ["caddy", "file-server", "--listen", ":80", "--root", "/usr/share/caddy"]
