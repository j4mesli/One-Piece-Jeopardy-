import { config } from "dotenv";
import { connectDb } from "./db";

export default async function setup() {
    config();
    connectDb();
}