const cleanText = function (value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, maxLength);
};

const validateSlug = function (value) {
  const slug = cleanText(value, 120).toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(slug)) {
    return { ok: false, message: "Invalid post slug" };
  }

  return { ok: true, value: slug };
};

const normalizeComment = function (body) {
  const username = cleanText(body.username, 40);
  const text = cleanText(body.text, 2000);

  if (!username) return { ok: false, message: "Name is required" };
  if (!text) return { ok: false, message: "Comment is required" };

  return {
    ok: true,
    value: {
      username,
      text,
      createdAt: new Date().toISOString(),
    },
  };
};

module.exports = { normalizeComment, validateSlug };
