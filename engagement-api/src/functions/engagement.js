const { app } = require("@azure/functions");
const { createAzureHandler } = require("../azureAdapter");
const { getEngagement } = require("../handlers");
const { createStore } = require("../store");

const store = createStore();

app.http("getEngagement", {
  authLevel: "anonymous",
  methods: ["GET", "OPTIONS"],
  route: "posts/{slug}/engagement",
  handler: createAzureHandler(getEngagement, store, { readBody: false }),
});
