import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { keys } from '../keys';

import * as schema from "./schema";

const sql = neon(keys().DATABASE_URL);

export const db = drizzle(sql, { schema }); 