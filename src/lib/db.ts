import type { MongoClient } from "mongodb";

import type { Path } from "$lib/types";
import { get_price } from "$lib/utils";

export async function is_domain_already_issued(db: MongoClient, domain: string): Promise<boolean> {
  const issued = db.db("bns_backend").collection("issued");
  if (await issued.findOne({ domain })) {
    return true;
  } else {
    return false;
  }
}

export async function add_domain_to_issued(db: MongoClient, domain: string, issued_hash: string, price: number) {
  const issued = db.db("bns_backend").collection("issued");
  await issued.insertOne({
    domain,
    issued_hash,
    price, //cause price may change in future, record price at time of sale
  });
}

//in the last 5 minutes
export async function payment_already_pending(db: MongoClient, domain: string): Promise<boolean> {
  const payments = db.db("bns_backend").collection("payments");
  if (await payments.findOne({
    domain,
    timestamp: {
      $gt: Date.now() - 5 * 60 * 1000,
    },
  })) {
    return true;
  } else {
    return false;
  }
}

//todo: return an actual type
export async function find_payment(db: MongoClient, domain: string, send_to: string): Promise<any> {
  const payments = db.db("bns_backend").collection("payments");
  return await payments.findOne({
    domain,
    send_to,
    timestamp: {
      $gt: Date.now() - 5 * 60 * 1000,
    },
  });
}

//todo: technically possible for there to be race condition with payment_already_pending
export async function create_payment(db: MongoClient, domain: string, send_to: string, receive_seed: string): bool {
  const price = get_price(domain.length);
  const payments = db.db("bns_backend").collection("payments");
  const result = await payments.insertOne({
    domain,
    receive_seed, //seed to receive payment from
    send_to, //Domain Address (banano address) to send domain to after payment received
    price,
    timestamp: Date.now(),
  });
  return result.acknowledged;
}

//

