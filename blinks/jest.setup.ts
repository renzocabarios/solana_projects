import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 4 } });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
