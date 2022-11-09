mkdir -p server/node_modules
mkdir -p client/node_modules
mkdir -p client/src/api
mkdir -p data
USER_ID=$(id -u):$(id -g) docker compose -f docker-compose.gen-api.yml -p sf-ctf-gen-api up --abort-on-container-exit --exit-code-from generator
