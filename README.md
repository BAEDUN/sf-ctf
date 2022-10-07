# sf-ctf

Capture the flag site of https://securityfirst.co.kr/

# Developing

Type `docker-compose -f docker-compose.dev.yml up` or `./run-dev.sh`.
Then nginx will listen `80`.
`localhost:80/api` will be redirect to server. Other will be redirect to client.

In dev mode, client and server will build in watch mode. Whenever you change the code, they will rebuild.
Hot-reload will also be works for client.

**[notice]**
If you want install new package, you have to re-run docker-compose after install.

# Environment Variables

DB_ROOT, DB_PASSWORD things will be added later

- MONGO_ROOT_USERNAME
  - `string`
  - Username of mongodb root
- MONGO_ROOT_PASSWORD
  - `string`
  - Password of mongodb root
