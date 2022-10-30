USER_ID=$(id -u):$(id -g)\
&& mkdir -p server/node_modules\
&& mkdir -p client/node_modules\
&& mkdir -p client/src/api\
&& mkdir -p data\
&& docker-compose -f docker-compose.gen-api.yml up --abort-on-container-exit --exit-code-from generator
