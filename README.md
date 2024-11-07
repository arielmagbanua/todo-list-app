# Frontend

It is recommended to use the [live-server](https://www.npmjs.com/package/live-server) npm module to start a basic web server for the front end.

```bash
# install the http-server globally
npm install -g http-server

# navigate to frontend directory
cd frontend

# start the web server
live-server --port=8080 --entry-file=./index.html --proxy="http://127.0.0.1:8080/"
```

# Server / Backend

You configure the backend by specifying environment variables in the `.env` file. If you don't have the `.env` file create it inside the `server` directory and provide the following variables.

```env
DB_CONNECTION=your_mongodb_connection_url

PORT=4000

JWT_SECRET=the_secret_key_for_jwt
```
