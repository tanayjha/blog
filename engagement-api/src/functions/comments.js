const { app } = require("@azure/functions");
const { createAzureHandler } = require("../azureAdapter");
const { addComment } = require("../handlers");
const { createStore } = require("../store");

const store = createStore();

app.http("addComment", {
  authLevel: "anonymous",
  methods: ["POST", "OPTIONS"],
  route: "posts/{slug}/comments",
  handler: createAzureHandler(addComment, store),
});
