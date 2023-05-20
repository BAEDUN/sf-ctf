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

## Generate Api

`./gen-api.sh` will make api files to `client/src/api`

# Environment Variables

`.env` file at repository root folder supported

## Variables

- MONGO_ROOT_USERNAME
  - `string`
  - Username of mongodb root
- MONGO_ROOT_PASSWORD
  - `string`
  - Password of mongodb root
- JWT_SECRET
  - `string`
  - Secret key for jwt
- MINIO_ROOT_USER
  - `string`
  - Username of minio root
- MINIO_ROOT_PASSWORD
  - `string`
  - Password of minio root
- SERVER_ROOT_USER
  - `string`
  - Username of server root
- SERVER_ROOT_PASSWORD
  - `string`
  - Password of server root
- START_AT
  - `string`
  - Time that CTF start
- END_AT
  - `string`
  - Time that CTF end
- PORT
  - `number`
  - Port to run nginx
  - Only affects in prod mod

## Example `.env` File

```
MONGO_ROOT_USERNAME=username
MONGO_ROOT_PASSWORD=password
JWT_SECRET=anySecretKey
MINIO_ROOT_USER=user
MINIO_ROOT_PASSWORD=password
SERVER_ROOT_USER=user
SERVER_ROOT_PASSWORD=password
START_AT=Wed Nov 01 2022 15:29:59 GMT+0900
END_AT=Wed Nov 02 2022 15:29:59 GMT+0900

PORT=2345
```
