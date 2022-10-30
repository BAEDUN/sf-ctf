USER_ID=$(id -u):$(id -g)\
&& mkdir -p server/node_modules\
&& mkdir -p client/node_modules\
&& mkdir -p client/src/api\
&& mkdir -p data\
&& docker-compose -f docker-compose.dev.yml up
