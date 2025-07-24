import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const admin = sqliteTable('admin', {
    id: int("id").primaryKey({autoIncrement: true}),
    username: text("username").notNull(),
    password: text("password").notNull()
})