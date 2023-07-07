OS_NAME := $(shell uname)
ifeq ($(OS_NAME), Darwin)
OPEN := open
else
OPEN := xdg-open
endif

qa: analyze test

analyze:
	@go vet ./...
	@go run honnef.co/go/tools/cmd/staticcheck@latest --checks=all ./...

test:
	@go test -failfast -cover ./...

race:
	@go test -count 1 -race ./...

coverage: test
	@mkdir -p ./coverage
	@go test -coverprofile=./coverage/cover.out ./...
	@go tool cover -html=./coverage/cover.out -o ./coverage/cover.html
	@$(OPEN) ./coverage/cover.html

clean:
	@rm -rf build/

build: clean
	$(eval VERSION=$(shell git tag --points-at HEAD))
	$(eval VERSION=$(or $(VERSION), (version unavailable)))

	@GOOS=linux GOARCH=amd64 go build -o ./build/leetbot entrypoint/main.go

build-docker:
	$(eval VERSION=$(shell git tag --points-at HEAD))
	$(eval IMAGE_VERSION=$(or $(VERSION), latest))
	$(eval VERSION=$(or $(VERSION), (version unavailable)))

	docker build --build-arg version="$(VERSION)" -t thenativeweb/eventsourcingdb:latest -t thenativeweb/eventsourcingdb:$(IMAGE_VERSION) .


.PHONY: analyze \
	coverage \
	build \
	clean \
	qa \
	race \
	test
