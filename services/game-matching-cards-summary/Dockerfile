FROM golang:1.16-alpine3.14 AS builder
WORKDIR /app

RUN apk --no-cache add tzdata

COPY go.* .

RUN go get ./...

ARG CMD_DIR

COPY . .

RUN go build -o main cmd/${CMD_DIR}/main.go


FROM alpine:3.14

ENV TZ=Asia/Bangkok

COPY --from=builder /app/main .
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

CMD ["/main"]
