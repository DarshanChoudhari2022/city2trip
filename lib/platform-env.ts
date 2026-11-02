import { env as cloudflareEnv } from "cloudflare:workers";

export const env = cloudflareEnv as typeof cloudflareEnv &
  Record<string, string | undefined>;