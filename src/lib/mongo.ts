import { MongoClient } from "mongodb";

import { MONGODB_URI } from "$env/static/private";

//const MONGODB_URI = process.env["MONGODB_URI"];

const client = new MongoClient(MONGODB_URI);

export const client_promise = client.connect();

