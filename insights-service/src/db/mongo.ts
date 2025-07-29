import { MongoClient, Db } from "mongodb";
import { MONGO_URI, MONGO_DB } from "../config";

let dbInstance: Db;

export async function connectDB(): Promise<Db> {
  if (dbInstance) return dbInstance;
  const client = new MongoClient(MONGO_URI!);
  await client.connect();
  dbInstance = client.db(MONGO_DB);
  return dbInstance;
}