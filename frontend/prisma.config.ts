import path from "node:path"
import { fileURLToPath } from "node:url"

import { config as loadEnv } from "dotenv"
import { PrismaPg } from "@prisma/adapter-pg"
import { defineConfig, env } from "prisma/config"

const thisFile = fileURLToPath(import.meta.url)
const thisDir = path.dirname(thisFile)

loadEnv({ path: path.join(thisDir, ".env.local"), quiet: true })
loadEnv({ path: path.join(thisDir, ".env"), quiet: true })

export default defineConfig({
	schema: "prisma/schema.prisma",
	datasource: {
		url: env("DATABASE_URL"),
	},
	adapter: async () => new PrismaPg({ connectionString: env("DATABASE_URL") }),
})
