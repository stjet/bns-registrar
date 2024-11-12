import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from "./$types";

import { client_promise } from "$lib/mongo";
import { is_domain_already_issued } from "$lib/db";

export const GET: RequestHandler = async ({ url }) => {
  const domain = url.searchParams.get("domain");
  if (!domain) {
    return error(400, "Missing URL query param `domain`");
  }
  let db = await client_promise;
	return json({
    issued: await is_domain_already_issued(db, domain),
  });
}

