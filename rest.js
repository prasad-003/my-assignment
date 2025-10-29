const http = require("http");
const url = require("url");

const PORT = 3000;

const menu = [
  { id: 1, dishName: "Paysa", price: 100 },
  { id: 2, dishName: "Pizza", price: 300 },
  { id: 3, dishName: "Burger", price: 400 },
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const path = parsedUrl.pathname;

  if (method === "GET" && path === "/menu") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(menu));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

