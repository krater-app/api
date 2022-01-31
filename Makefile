default: start

start:
	docker compose up -d && make migrations && make server

migrations:
	cd src/database && rushx migration

server:
	cd src/server && rushx dev

build:
	rush build