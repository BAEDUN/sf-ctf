mkdir -p server/node_modules
mkdir -p client/node_modules
mkdir -p client/src/api
mkdir -p data
docker compose -f docker-compose.dev.yml -p sf-ctf-dev up
