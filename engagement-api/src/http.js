const { configuredOrigins } = require("./config");

const isOriginAllowed = function (origin) {
  const origins = configuredOrigins();
  return origins.includes("*") || !origin || origins.includes(origin);
};

const corsHeaders = function (origin) {
  const origins = configuredOrigins();
  const allowOrigin = origins.includes("*")
    ? "*"
    : origin && origins.includes(origin)
      ? origin
      : origins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
};

module.exports = { corsHeaders, isOriginAllowed };
