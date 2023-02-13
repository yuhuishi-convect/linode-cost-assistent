# build and run the frontend written in react in a multi-stage build

FROM node:16.13.0-alpine3.14 AS build-env
ADD . /app

WORKDIR /app
RUN yarn install
RUN yarn build

# copy the build folder to the final stage
# serve the built files with caddy web server

FROM caddy:2.4.5-alpine
COPY --from=build-env /app/build /usr/share/caddy

# expose port 80
EXPOSE 80

# run caddy web server
CMD ["caddy", "file-server", "--listen", ":80", "--root", "/usr/share/caddy"]