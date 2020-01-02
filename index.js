const http = require('http');

const server = http.createServer(function(req, res) {
  if (req.url === '/login') {
    let body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });
    req.on('end', () => {
      const { username, passwd } = JSON.parse(Buffer.concat(body).toString());
      if (username === 'admin' && passwd === 'admin') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            token: Math.random().toFixed(10),
            username: 'admin',
          })
        );
      } else {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('帳號或密碼錯誤');
      }

      res.end();
    });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, function() {
  console.log('server running...');
});
