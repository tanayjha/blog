const http = require("node:http");
const { URL } = require("node:url");
const { createStore } = require("./src/store");
const {
  addComment,
  getEngagement,
  incrementLike,
  incrementView,
} = require("./src/handlers");
const { corsHeaders, isOriginAllowed } = require("./src/http");

const port = Number(process.env.PORT || 7071);
const store = createStore();

const readBody = function (request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 4096) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
};

const send = function (response, origin, result) {
  response.writeHead(result.status, {
    ...corsHeaders(origin),
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(result.body || {}));
};

const routeRequest = async function (request, response) {
  const origin = request.headers.origin || "";
  const headers = corsHeaders(origin);

  if (request.method === "OPTIONS") {
    response.writeHead(isOriginAllowed(origin) ? 204 : 403, headers);
    response.end();
    return;
  }

  if (!isOriginAllowed(origin)) {
    send(response, origin, { status: 403, body: { error: "Origin is not allowed" } });
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const match = url.pathname.match(/^\/api\/posts\/([^/]+)\/(engagement|like|view|comments)$/);
  if (!match) {
    send(response, origin, { status: 404, body: { error: "Not found" } });
    return;
  }

  const slug = decodeURIComponent(match[1]);
  const action = match[2];
  const params = { slug };
  const body = request.method === "POST" ? await readBody(request) : {};

  if (request.method === "GET" && action === "engagement") {
    send(response, origin, await getEngagement({ params, store }));
    return;
  }

  if (request.method === "POST" && action === "like") {
    send(response, origin, await incrementLike({ params, store }));
    return;
  }

  if (request.method === "POST" && action === "view") {
    send(response, origin, await incrementView({ params, store }));
    return;
  }

  if (request.method === "POST" && action === "comments") {
    send(response, origin, await addComment({ params, body, store }));
    return;
  }

  send(response, origin, { status: 405, body: { error: "Method not allowed" } });
};

const server = http.createServer((request, response) => {
  routeRequest(request, response).catch((error) => {
    const origin = request.headers.origin || "";
    response.writeHead(500, {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify({ error: error.message }));
  });
});

server.listen(port, () => {
  console.log(`Engagement API listening on http://localhost:${port}/api`);
});
