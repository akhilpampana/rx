import { createServer } from 'http'
import { parse } from 'url'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

var express = require('express');
var app = express();

var cors = require('cors');
var bodyParser = require('body-parser');

//enables cors
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

require('./router/index')(app);
const port = process.argv[3] || 8080
createServer((req, res) => {
  const reqUrl = parse(req.url)
  const file = reqUrl.pathname == '/' ? '/index.html' : reqUrl.pathname
  const filepath = `./public${file}`
  try {
    if (existsSync(filepath)) {
      res.writeHead(200, {'Content-Type': filepath.endsWith('js') ? 'application/javascript' : 'text/html'})
      createReadStream(filepath).pipe(res)
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
  } catch(e) {
    res.writeHead(500, {'Content-Type': 'text/html'});
    return res.end("500 Server Error");
  }
}).listen(port)

console.log(`listening on ${port} ...`)
