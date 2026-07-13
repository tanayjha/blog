const { app } = require("@azure/functions");
const { createAzureHandler } = require("../azureAdapter");
const { incrementView } = require("../handlers");
const { createStore } = require("../store");

const store = createStore();

app.http("incrementView", {
  authLevel: "anonymous",
  methods: ["POST", "OPTIONS"],
  route: "posts/{slug}/view",
  handler: createAzureHandler(incrementView, store, { readBody: false }),
});
