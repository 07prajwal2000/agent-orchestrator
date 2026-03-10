import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const sqlitePath = process.env.SQLITE_PATH || "sqlite.db";

const client = createClient({
	url: `file:${sqlitePath}`,
});

export const db = drizzle(client, { schema });
