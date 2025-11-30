import { defineConfig } from 'drizzle-kit';
import { env } from '@workspace/env';
if (!env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
}
export default defineConfig({
    schema: './src/schema.ts', // Your schema file path
    out: './drizzle', // Your migrations folder
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL,
    },
});
