const { corsHeaders, isOriginAllowed } = require("./http");

const bodyFromRequest = async function (request) {
  try {
    return await request.json();
  } catch (_) {
    return {};
  }
};

const createAzureHandler = function (handler, store, options = {}) {
  return async function (request) {
    const origin = request.headers.get("origin") || "";

    if (request.method === "OPTIONS") {
      return {
        status: isOriginAllowed(origin) ? 204 : 403,
        headers: corsHeaders(origin),
      };
    }

    if (!isOriginAllowed(origin)) {
      return {
        status: 403,
        headers: corsHeaders(origin),
        jsonBody: { error: "Origin is not allowed" },
      };
    }

    const result = await handler({
      params: request.params,
      body: options.readBody === false ? {} : await bodyFromRequest(request),
      store,
    });

    return {
      status: result.status,
      headers: corsHeaders(origin),
      jsonBody: result.body,
    };
  };
};

module.exports = { createAzureHandler };
