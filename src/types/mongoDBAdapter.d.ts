import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export class MongoDBAdapter {
  async getUserById(id: string) {
    await client.connect();
    const db = client.db("Sigma-Dialer");
    const user = await db.collection("users").findOne({ _id: id });
    return user;
  }

  async createUser(data: any) {
    await client.connect();
    const db = client.db("Sigma-Dialer");
    const result = await db.collection("users").insertOne(data);
    return result.ops[0];
  }

  // Implement other methods as needed
}
