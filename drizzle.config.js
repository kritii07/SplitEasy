/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.jsx",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://Expense-tracker_owner:OzI6Twn7lLyJ@ep-super-hill-a5upgjie.us-east-2.aws.neon.tech/Expense-tracker?sslmode=require',
  }
};