(function () {
  const root = document.querySelector("[data-engagement-widget]");
  if (!root) return;

  const apiBase = root.dataset.apiBase;
  const slug = root.dataset.slug;
  const enableLikes = root.dataset.enableLikes === "true";
  const enableComments = root.dataset.enableComments === "true";
  const enableViews = root.dataset.enableViews === "true";
  const likeButton = root.querySelector("[data-engagement-like]");
  const likesNode = root.querySelector("[data-engagement-likes]");
  const viewsWrap = root.querySelector("[data-engagement-views-wrap]");
  const viewsNode = root.querySelector("[data-engagement-views]");
  const commentsWrap = root.querySelector("[data-engagement-comments-wrap]");
  const commentsNode = root.querySelector("[data-engagement-comments]");
  const form = root.querySelector("[data-engagement-form]");
  const messageNode = root.querySelector("[data-engagement-message]");
  const likedKey = `blog-engagement-liked:${slug}`;

  if (!apiBase || !slug) return;

  const endpoint = function (action) {
    return `${apiBase}/posts/${encodeURIComponent(slug)}/${action}`;
  };

  const request = async function (url, options = {}) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);
    const headers = { ...(options.headers || {}) };

    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const fetchOptions = {
      ...options,
      signal: controller.signal,
    };
    delete fetchOptions.headers;

    if (Object.keys(headers).length) {
      fetchOptions.headers = headers;
    }

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) throw new Error(`Engagement API returned ${response.status}`);
      return response.status === 204 ? null : response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const formatCount = function (value) {
    return new Intl.NumberFormat().format(value || 0);
  };

  const setMessage = function (message) {
    if (messageNode) messageNode.textContent = message || "";
  };

  const renderComments = function (comments) {
    if (!commentsNode) return;
    commentsNode.textContent = "";

    if (!comments.length) {
      const empty = document.createElement("p");
      empty.className = "engagement__empty";
      empty.textContent = "Be the first to comment.";
      commentsNode.appendChild(empty);
      return;
    }

    comments.forEach((comment) => {
      const article = document.createElement("article");
      article.className = "engagement__comment";

      const meta = document.createElement("div");
      meta.className = "engagement__comment-meta";
      const date = comment.createdAt ? new Date(comment.createdAt) : null;
      meta.textContent = date && !Number.isNaN(date.valueOf())
        ? `${comment.username} · ${date.toLocaleString()}`
        : comment.username;

      const text = document.createElement("p");
      text.textContent = comment.text;

      article.append(meta, text);
      commentsNode.appendChild(article);
    });
  };

  const render = function (data) {
    if (likesNode) likesNode.textContent = formatCount(data.likes);
    if (viewsNode) viewsNode.textContent = formatCount(data.views);
    renderComments(data.comments || []);

    if (!enableLikes && likeButton) likeButton.hidden = true;
    if (!enableViews && viewsWrap) viewsWrap.hidden = true;
    if (!enableComments && commentsWrap) commentsWrap.hidden = true;

    if (likeButton && window.localStorage.getItem(likedKey) === "true") {
      likeButton.setAttribute("aria-pressed", "true");
    }

    root.hidden = false;
  };

  const initialize = async function () {
    try {
      const data = await request(endpoint("engagement"));
      render(data);

      if (enableViews) {
        request(endpoint("view"), { method: "POST" })
          .then((updated) => {
            if (updated && viewsNode) viewsNode.textContent = formatCount(updated.views);
          })
          .catch(() => {});
      }
    } catch (_) {
      root.remove();
    }
  };

  if (likeButton) {
    likeButton.addEventListener("click", async () => {
      if (!enableLikes || likeButton.getAttribute("aria-pressed") === "true") return;

      likeButton.disabled = true;
      try {
        const updated = await request(endpoint("like"), { method: "POST" });
        window.localStorage.setItem(likedKey, "true");
        likeButton.setAttribute("aria-pressed", "true");
        if (likesNode) likesNode.textContent = formatCount(updated.likes);
      } catch (_) {
        setMessage("Could not save like right now.");
      } finally {
        likeButton.disabled = false;
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!enableComments) return;

      const formData = new FormData(form);
      const username = String(formData.get("username") || "").trim();
      const text = String(formData.get("text") || "").trim();
      if (!username || !text) return;

      const button = form.querySelector("button");
      if (button) button.disabled = true;
      setMessage("");

      try {
        const updated = await request(endpoint("comments"), {
          method: "POST",
          body: JSON.stringify({ username, text }),
        });
        form.reset();
        render(updated);
        setMessage("Comment posted.");
      } catch (_) {
        setMessage("Could not post comment right now.");
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  initialize();
})();
