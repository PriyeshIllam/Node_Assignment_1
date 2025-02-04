const http = require('http');
const url = require('url');
const fs = require('fs');

// Function to serve an external file
const serveFile = (res, filePath, contentType) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
};

// Create the server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>Welcome to PRIYESH'S  Node Server</h1>
                 <p>Available Routes:</p>
                 <ul>
                    <li><a href='/about'>/about</a> - Static HTML Response</li>
                    <li><a href='/contact'>/contact</a> - Static HTML Response</li>
                    <li><a href='/external1'>/external1</a> - Reads from external file</li>
                    <li><a href='/external2'>/external2</a> - Reads from external file</li>
                    <li><a href='/query?name=John&age=30'>/query?name=John&age=30</a> - Query-based response</li>
                    <li><a href='/query?name=Jane&age=25'>/query?name=Jane&age=25</a> - Query-based response</li>
                    <li><a href='/query?name=Mike&age=40'>/query?name=Mike&age=40</a> - Query-based response</li>
                    <li><a href='/query?name=Priyesh&age=40'>/query?name=Priyesh&age=40</a> - Query-based response</li>
                 </ul>`);
    } else if (path === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Us</h1><p>This is the about page.</p> <p> to go back <a href="/">CLICK HERE</a></p>');
    } else if (path === '/contact') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Contact Us</h1><p>Email: contact@example.com</p>');
    } else if (path === '/external1') {
        serveFile(res, './files/external1.html', 'text/html');
    } else if (path === '/external2') {
        serveFile(res, './files/external2.txt', 'text/plain');
    } else if (path === '/query') {
        const name = query.name || 'Guest';
        const age = query.age || 'unknown';
    
        fs.readFile('./files/queryResponse.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading query responses file');
                return;
            }
    
            const responses = JSON.parse(data);
            const user = responses.users.find(user => user.name === name && user.age === age);
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: user ? user.message : `Hello ${name}, age ${age}! No special message found.` }));
        });
    }
     else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Page Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
