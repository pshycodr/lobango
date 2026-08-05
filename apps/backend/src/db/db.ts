import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema/index";
import type { D1Database } from "@cloudflare/workers-types";

export const getDB = (db: D1Database) => drizzle(db, { schema });
