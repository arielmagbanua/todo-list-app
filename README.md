# Frontend

It is recommended to use the [http-server](https://www.npmjs.com/package/http-server) npm module to start a basic web server for the front end.

```bash
# install the http-server globally
npm install -g http-server

# from the root project start the server
# this command will start the server and will rewrite the request to index.html when you directly go to a path
http-server frontend --port 8080 -P "http://localhost:8080?"

# if you are already in the frontend directory
http-server --port 8080 -P "http://localhost:8080?"
```
