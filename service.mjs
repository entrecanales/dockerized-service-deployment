import { createServer } from 'node:http';
import { parse } from 'node:url';
import dotenv from 'dotenv';

const port = 8080;
const ip = '0.0.0.0'

dotenv.config(); //Load .env

const server = createServer((req, res) => { //Configure the server with the routes and logic
  const parsedUrl = parse(req.url, true); //Parse the url into actual object
  const path = parsedUrl.pathname;
  const method = req.method;

  if (method == 'GET') {
    if (path == '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("There's nothing here, sorry :(!\n");
    }
    else if (path == '/route') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("Hello, world!\n");
    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end("Not Found\n");
    }
  }
  else if (method == 'POST') {
    if (path == '/secret') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const { username, password } = JSON.parse(body);

          if (username == process.env.USER_NAME && password == process.env.PASSWORD) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(process.env.SECRET_MESSAGE + '\n');
          }
          else {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end("Wrong Credentials\n");
          }
        }
        catch (ex) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end("Invalid JSON Format\n");
        }
      });
    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end("Not Found\n");
    }
  }
  else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end("Method NOT ALLOWED, buddy!\n");
  }
  
});

server.listen(port, ip, () => { //Run the service
  console.log(`Server running at port ${port} with IP ${ip}`);
});
