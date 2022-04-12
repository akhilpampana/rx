import { createServer } from 'http'
import { parse } from 'url'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

const port = process.argv[3] || 8080
createServer((req, res) => {
  const reqUrl = parse(req.url)    
  const filepath = `./public${reqUrl.pathname}`; console.log(8, reqUrl.pathname, filepath)
  try {
    if (existsSync(filepath)) { console.log(11)
      res.writeHead(200, {'Content-Type': filepath.endsWith('js') ? 'application/javascript' : 'text/html'})
      createReadStream(filepath).pipe(res)
    } else { console.log(14)
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
  } catch(e) {
    res.writeHead(500, {'Content-Type': 'text/html'});
    return res.end("500 Server Error");
  }

  //res.end()
}).listen(port)

console.log(`listening on ${port} ...`)
