import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import { Wallet, RPC, get_address_from_public_key, raw_to_whole } from "banani";
import { TLDAccountManager } from "banani-bns";

import { client_promise } from "$lib/mongo";
import { add_domain_to_issued, is_domain_already_issued, find_payment } from "$lib/db";
import { is_valid_public_key } from "$lib/utils";
import { TLD_SEED, STORAGE_ADDRESS } from "$env/static/private";

const rpc = new RPC("https://kaliumapi.appditto.com/api");
const sleep = ms => new Promise(r => setTimeout(r, ms));

export const POST: RequestHandler = async ({ request }) => {
  const { domain, send_to_pub_key } = await request.json();
  if (!domain || !send_to_pub_key) {
    return error(400, "Missing one or more of the required fields `domain` and `send_to_pub_key`");
  } else if (!is_valid_public_key(send_to_pub_key)) {
    return error(400, "`send_to_pub_key` is invalid");
  }
  const db = await client_promise;
  if (await is_domain_already_issued(db, domain)) {
    return error(500, "Domain already issued");
  }
  const found = await find_payment(db, domain, get_address_from_public_key(send_to_pub_key));
  if (!found) {
    return error(500, "Payment request expired or never made");
  }
  const receive_wallet = new Wallet(rpc, found.receive_seed);
  await receive_wallet.receive_all();
  await sleep(1500);
  const balance = Number(raw_to_whole(BigInt((await rpc.get_account_balance(receive_wallet.address)).balance)));
  if (balance < found.price) {
    return error(500, `Need to be sent ${found.price}, only got ${balance}`);
  }
  receive_wallet.send_all(STORAGE_ADDRESS);
  const tld_manager = new TLDAccountManager(rpc, new Wallet(rpc, TLD_SEED));
  const send_hash = await tld_manager.issue_domain_name(domain, found.send_to);
  await add_domain_to_issued(db, domain, send_hash, found.price);
  return json({
    send_hash,
  });
};

