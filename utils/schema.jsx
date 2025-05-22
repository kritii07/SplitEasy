import { integer, numeric, pgTable, serial, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

// Existing Budgets Table
export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

// Existing Expenses Table
export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
});

// -------------------------
// 🆕 NEW: Group Bills Tables
// -------------------------

// Groups Table: Stores expense groups
export const Groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  createdBy: varchar("createdBy").notNull(), // User email
  createdAt: timestamp("createdAt").defaultNow(),
});

// Participants Table: Stores people in a group
export const Participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  groupId: integer("groupId").references(() => Groups.id).notNull(),
  name: varchar("name").notNull(),
  email: varchar("email"), // Optional, useful if linked to a user
});

// Transactions Table: Stores payments made by participants
export const Transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  groupId: integer("groupId").references(() => Groups.id).notNull(),
  payerId: integer("payerId").references(() => Participants.id).notNull(),
  amount: numeric("amount").notNull().default(0),
  description: varchar("description"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Splits Table: Stores how the expenses are divided among participants
export const Splits = pgTable("splits", {
  id: serial("id").primaryKey(),
  transactionId: integer("transactionId").references(() => Transactions.id).notNull(),
  payerId: integer("payerId").references(() => Participants.id).notNull(),
  receiverId: integer("receiverId").references(() => Participants.id).notNull(),
  amount: numeric("amount").notNull().default(0),
  isSettled: boolean("isSettled").default(false),
});


export const Settlements = pgTable("settlements", {
  id: serial("id").primaryKey(),
  groupId: integer("groupId").references(() => Groups.id),
  payerId: integer("payerId").references(() => Participants.id),
  receiverId: integer("receiverId").references(() => Participants.id),
  amount: numeric("amount").notNull(),
  settledAt: timestamp("settledAt").defaultNow(),
});