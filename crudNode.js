const http = require('http');

const server = http.createServer((req, res) => {
    console.log("Incoming request:", req.method, req.url); // 👈 Debug log

    if (req.method === "GET" && req.url.startsWith("/hello")) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "GET request received" }));
    } 
    else if (req.method === "POST" && req.url.startsWith("/hello")) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "POST request received" }));
    } 
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

server.listen(4000, () => console.log("✅ Server running on port 4000"));

