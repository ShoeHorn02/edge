import { defineConfig } from 'drizzle-kit';
import { keys } from './keys';

if (!keys().DATABASE_URL) {
  throw new Error("Missing POSTGRES_URL");
}

export default defineConfig({
  schema: './src/schema.ts', // Your schema file path
  out: './drizzle', // Your migrations folder
  dialect: 'postgresql',
  dbCredentials: {
    url: keys().DATABASE_URL,
  },
});
