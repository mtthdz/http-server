import * as net from 'net';
import * as fs from 'fs';
import * as process from 'process';

const server: net.Server = net.createServer((socket: net.socket) => {
  socket.on('data', (buffer: net.Buffer | string) => {
      let request: string[] = buffer.toString().split(' ');
      let path: string = request[1];
      let query: string[] = path.split('/');
      query.shift();

      if (path === '/') {
        socket.write('HTTP/1.1 200 OK\r\n\r\n');
      } else {
        switch (query[0]) {
          case 'echo':
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${query[1].length}\r\n\r\n${query[1]}`);
            break;

          case 'user-agent':
            let userAgent: string[] = request.at(-1).trim();
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
            break;
          
          case 'files':
            let directory: string = process.argv[3];
              let fileName: string = query[1]
              fs.readFile(directory + fileName, 'utf8', (err: Error, data: string) => {
                if (err) {
                  socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
                }
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${data.length}\r\n\r\n${data}`);
              })
            break;
  
          default:
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            break;
        }
      }
  })
});

server.listen(4221, 'localhost', () => {
  console.log('Server is running on port 4221');
});
