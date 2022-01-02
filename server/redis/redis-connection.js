const redis = require('redis');

class RedisClient {
  constructor() {
    this.Client = null;
  }

  async connect() {
    this.Client = redis.createClient({url: 'redis://default:redisg6so1py2@34.136.166.39:6379'});
    await this.Client.connect();
    return this.Client;
  }
}

module.exports.RedisClient = RedisClient;