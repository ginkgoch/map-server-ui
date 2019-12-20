all:
	yarn build
	docker build -t ginkgoch/map-server-ui .