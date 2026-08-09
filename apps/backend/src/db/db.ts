import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema/index";

export const getDB = (db: D1Database) => drizzle(db, { schema });
