import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  date,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  isAnonymous: boolean("is_anonymous"),
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
});

//Questly schema
export const quest = pgTable("quest", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isMainQuest: boolean("is_main_quest").default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  xpReward: integer("xp_reward").default(100),
});

export const task = pgTable("task", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  recurringTaskId: integer("recurring_task_id").references(
    () => recurringTask.id
  ),
  title: text("title").notNull(),
  description: text("description"),
  date: date("date"), // the day the task is active
  completed: boolean("completed").notNull().default(false),
  isTimeTracked: boolean("is_time_tracked").notNull().default(false),
  plannedDuration: integer("planned_duration"),
  actualDuration: integer("actual_duration"),
  basePoints: integer("base_points").notNull().default(1),
  xpReward: integer("xp_reward"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const recurringTask = pgTable("recurring_task", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  recurrenceRule: text("recurrence_rule").notNull(), // e.g., 'daily', 'mon-fri'
  isTimeTracked: boolean("is_time_tracked").notNull().default(false),
  plannedDuration: integer("planned_duration"), // in minutes
  basePoints: integer("base_points").notNull().default(1),
  xpReward: integer("xp_reward"), // required if NOT time-tracked
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

//Auth schema
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
