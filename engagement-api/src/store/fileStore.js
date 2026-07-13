const fs = require("node:fs/promises");
const path = require("node:path");

class FileStore {
  constructor(filePath = process.env.ENGAGEMENT_LOCAL_STORE) {
    this.filePath = filePath || path.join(__dirname, "..", "..", ".data", "engagement.json");
  }

  async readData() {
    try {
      const content = await fs.readFile(this.filePath, "utf8");
      if (!content.trim()) return { posts: {} };
      return JSON.parse(content);
    } catch (error) {
      if (error.code === "ENOENT") return { posts: {} };
      throw error;
    }
  }

  async writeData(data) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  post(data, slug) {
    data.posts[slug] = data.posts[slug] || {
      slug,
      likes: 0,
      views: 0,
      comments: [],
    };
    return data.posts[slug];
  }

  async getEngagement(slug) {
    const data = await this.readData();
    return this.post(data, slug);
  }

  async incrementLike(slug) {
    const data = await this.readData();
    const post = this.post(data, slug);
    post.likes += 1;
    await this.writeData(data);
    return post;
  }

  async incrementView(slug) {
    const data = await this.readData();
    const post = this.post(data, slug);
    post.views += 1;
    await this.writeData(data);
    return post;
  }

  async addComment(slug, comment) {
    const data = await this.readData();
    const post = this.post(data, slug);
    post.comments.push(comment);
    await this.writeData(data);
    return post;
  }
}

module.exports = { FileStore };
