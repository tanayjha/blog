const configuredOrigins = function () {
  const value = process.env.ALLOWED_ORIGINS
    || process.env.ALLOWED_ORIGIN
    || "http://localhost:1313,http://127.0.0.1:1313";

  return value.split(",").map((origin) => origin.trim()).filter(Boolean);
};

const maxComments = function () {
  return Number(process.env.MAX_COMMENTS || 100);
};

module.exports = { configuredOrigins, maxComments };
