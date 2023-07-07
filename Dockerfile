FROM golang:1.20-alpine3.18 AS build

ARG version

RUN apk update && \
    apk add git

WORKDIR /go/src

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -o ../bin/leetbot entrypoint/main.go

# ---------------------------------------------------------

FROM alpine:3.18

COPY --from=build /go/bin/leetbot /usr/local/bin/leetbot

RUN addgroup --system leetbot && \
    adduser --system --no-create-home leetbot --ingroup leetbot && \
    mkdir -p /var/lib/leetbot && \
    chown -R leetbot:leetbot /var/lib/leetbot

# /var/lib/leetbot is meant to be the storage location
WORKDIR /var/lib/leetbot
USER leetbot

ENTRYPOINT [ "leetbot" ]
