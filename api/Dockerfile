FROM oven/bun:alpine

WORKDIR /app

COPY . .

RUN bun install
RUN mkdir /app/data

CMD ["bun","run","api.js"] 
