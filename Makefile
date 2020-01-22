all:
	yarn build
	docker build -t ginkgoch/map-server-ui:1.0.4 .