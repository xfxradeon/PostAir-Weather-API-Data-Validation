const http = require("http");
const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost:3001"}`);
  const pathname = parsedUrl.pathname;

  // 1. Health check for CI/CD
  if (req.method === "GET" && (pathname === "/health" || req.url === "/health")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // 2. Flight Data Endpoint (Data Validation under test)
  if (pathname.startsWith("/flights")) {
    // Missing record trigger to test the skipTest pattern
    if (pathname === "/flights/FL-9999" || pathname === "/flights/missing") {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        error: { code: 404, message: "Flight record not found." }
      }));
    }

    // Standard valid contract
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      id: "FL-1042",
      airline: "PostAir Express",
      departure: "2026-09-10T14:30:00Z",
      arrival: "2026-09-10T18:45:00Z",
      status: "scheduled",
      aircraft: "Boeing 737-800"
    }));
  }

  // 3. Fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: { code: 404, message: "Endpoint not defined" } }));
});

server.listen(PORT, () => {
  console.log(`Data validation mock server running on port ${PORT}`);
});