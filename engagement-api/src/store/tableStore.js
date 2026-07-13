const { randomUUID } = require("node:crypto");
const { TableClient, odata } = require("@azure/data-tables");

class TableStore {
  constructor(connectionString) {
    this.stats = TableClient.fromConnectionString(connectionString, "PostStats");
    this.comments = TableClient.fromConnectionString(connectionString, "Comments");
    this.ready = Promise.all([
      this.ensureTable(this.stats),
      this.ensureTable(this.comments),
    ]);
  }

  async ensureTable(client) {
    try {
      await client.createTable();
    } catch (error) {
      if (error.statusCode !== 409) throw error;
    }
  }

  defaultStats(slug) {
    return {
      partitionKey: "post",
      rowKey: slug,
      slug,
      likes: 0,
      views: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  async getStats(slug) {
    await this.ready;

    try {
      return await this.stats.getEntity("post", slug);
    } catch (error) {
      if (error.statusCode === 404) return this.defaultStats(slug);
      throw error;
    }
  }

  async saveStats(entity) {
    entity.updatedAt = new Date().toISOString();
    await this.stats.upsertEntity(entity, "Replace");
    return entity;
  }

  async listComments(slug) {
    await this.ready;

    const comments = [];
    const entities = this.comments.listEntities({
      queryOptions: {
        filter: odata`PartitionKey eq ${slug}`,
      },
    });

    for await (const entity of entities) {
      comments.push({
        username: entity.username,
        text: entity.text,
        createdAt: entity.createdAt,
      });
    }

    return comments.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  async getEngagement(slug) {
    const stats = await this.getStats(slug);
    const comments = await this.listComments(slug);
    return {
      slug,
      likes: stats.likes || 0,
      views: stats.views || 0,
      comments,
    };
  }

  async incrementLike(slug) {
    const stats = await this.getStats(slug);
    stats.likes = (stats.likes || 0) + 1;
    await this.saveStats(stats);
    return this.getEngagement(slug);
  }

  async incrementView(slug) {
    const stats = await this.getStats(slug);
    stats.views = (stats.views || 0) + 1;
    await this.saveStats(stats);
    return this.getEngagement(slug);
  }

  async addComment(slug, comment) {
    await this.ready;

    await this.comments.createEntity({
      partitionKey: slug,
      rowKey: `${Date.now()}-${randomUUID()}`,
      username: comment.username,
      text: comment.text,
      createdAt: comment.createdAt,
    });

    const stats = await this.getStats(slug);
    stats.comments = (stats.comments || 0) + 1;
    await this.saveStats(stats);
    return this.getEngagement(slug);
  }
}

module.exports = { TableStore };
