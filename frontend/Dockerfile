FROM caddy:2.11-alpine

# RUN apk add unzip
# RUN curl -fsSL https://bun.com/install | bash

WORKDIR /app

EXPOSE 80

COPY index.html .
COPY stylesheet.css .
COPY app.js .
COPY Caddyfile /etc/caddy/
