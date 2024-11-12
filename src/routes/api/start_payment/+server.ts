import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import { Wallet, get_address_from_public_key } from "banani";

import { client_promise } from "$lib/mongo";
import { is_domain_already_issued, payment_already_pending, create_payment } from "$lib/db";
import { is_domain_name_allowed, is_valid_public_key } from "$lib/utils";

export const POST: RequestHandler = async ({ request }) => {
  const { domain, send_to_pub_key } = await request.json();
  if (!domain || !send_to_pub_key) {
    return error(400, "Missing one or more of the required fields `domain` and `send_to_pub_key`");
  } else if (!is_domain_name_allowed(domain) || domain.length < 4) {
    return error(400, "Domain name has disallowed characters or is shorter than 4 characters");
  } else if (!is_valid_public_key(send_to_pub_key)) {
    return error(400, "`send_to_pub_key` is invalid");
  }
  const db = await client_promise;
  if (await is_domain_already_issued(db, domain)) {
    return error(500, "Domain already issued");
  } else if (await payment_already_pending(db, domain)) {
    return error(500, "Payment for domain already pending, wait 5 minutes or so");
  }
  const payment_wallet = Wallet.gen_random_wallet();
  await create_payment(db, domain, get_address_from_public_key(send_to_pub_key), payment_wallet.seed);
  return json({
    payment_address: payment_wallet.address,
  });
};

