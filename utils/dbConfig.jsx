import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon('postgresql://Expense-tracker_owner:OzI6Twn7lLyJ@ep-super-hill-a5upgjie.us-east-2.aws.neon.tech/Expense-tracker?sslmode=require');
export const db = drizzle(sql, {schema});