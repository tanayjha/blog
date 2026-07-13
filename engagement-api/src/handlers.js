const { maxComments } = require("./config");
const {
  normalizeComment,
  validateSlug,
} = require("./validation");

const error = function (status, message) {
  return { status, body: { error: message } };
};

const normalizeEngagement = function (engagement) {
  return {
    slug: engagement.slug,
    likes: engagement.likes || 0,
    views: engagement.views || 0,
    comments: (engagement.comments || []).slice(-maxComments()),
  };
};

const withValidSlug = function (params) {
  const slug = validateSlug(params && params.slug);
  if (!slug.ok) return { error: error(400, slug.message) };
  return { slug: slug.value };
};

const getEngagement = async function ({ params, store }) {
  const valid = withValidSlug(params);
  if (valid.error) return valid.error;

  const engagement = await store.getEngagement(valid.slug);
  return { status: 200, body: normalizeEngagement(engagement) };
};

const incrementLike = async function ({ params, store }) {
  const valid = withValidSlug(params);
  if (valid.error) return valid.error;

  const engagement = await store.incrementLike(valid.slug);
  return { status: 200, body: normalizeEngagement(engagement) };
};

const incrementView = async function ({ params, store }) {
  const valid = withValidSlug(params);
  if (valid.error) return valid.error;

  const engagement = await store.incrementView(valid.slug);
  return { status: 200, body: normalizeEngagement(engagement) };
};

const addComment = async function ({ params, body, store }) {
  const valid = withValidSlug(params);
  if (valid.error) return valid.error;

  const comment = normalizeComment(body || {});
  if (!comment.ok) return error(400, comment.message);

  const engagement = await store.addComment(valid.slug, comment.value);
  return { status: 201, body: normalizeEngagement(engagement) };
};

module.exports = {
  addComment,
  getEngagement,
  incrementLike,
  incrementView,
};
