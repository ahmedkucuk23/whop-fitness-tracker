import { Whop } from "@whop/sdk";

export const whop = new Whop({
  apiKey: `Bearer ${process.env.WHOP_API_KEY}`,
});
