const { app } = require("@azure/functions");
const { createAzureHandler } = require("../azureAdapter");
const { incrementLike } = require("../handlers");
const { createStore } = require("../store");

const store = createStore();

app.http("incrementLike", {
  authLevel: "anonymous",
  methods: ["POST", "OPTIONS"],
  route: "posts/{slug}/like",
  handler: createAzureHandler(incrementLike, store, { readBody: false }),
});
