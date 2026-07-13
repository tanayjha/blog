const test = require("node:test");
const assert = require("node:assert/strict");
const {
  addComment,
  getEngagement,
  incrementLike,
  incrementView,
} = require("../src/handlers");
const { FileStore } = require("../src/store/fileStore");

const storeForTest = function (name) {
  return new FileStore(`/tmp/tanayjha-blog-engagement-${name}-${Date.now()}.json`);
};

test("tracks likes, views, and comments for a post", async () => {
  const store = storeForTest("happy-path");
  const params = { slug: "sample-post" };

  assert.equal((await getEngagement({ params, store })).body.likes, 0);
  assert.equal((await incrementLike({ params, store })).body.likes, 1);
  assert.equal((await incrementView({ params, store })).body.views, 1);

  const commented = await addComment({
    params,
    body: { username: "Tanay", text: "Nice post" },
    store,
  });

  assert.equal(commented.status, 201);
  assert.equal(commented.body.comments.length, 1);
  assert.equal(commented.body.comments[0].username, "Tanay");
  assert.equal(commented.body.comments[0].text, "Nice post");
});

test("rejects invalid slugs and empty comments", async () => {
  const store = storeForTest("validation");

  assert.equal((await getEngagement({
    params: { slug: "../bad" },
    store,
  })).status, 400);

  assert.equal((await addComment({
    params: { slug: "sample-post" },
    body: { username: "", text: "hello" },
    store,
  })).status, 400);
});
