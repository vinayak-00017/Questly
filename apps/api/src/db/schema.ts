import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
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

// Main quest remains separate as it's fundamentally different
export const mainQuest = pgTable("main_quest", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  importance: text("importance")
    .$type<"low" | "medium" | "high" | "epic">()
    .notNull(),
  dueDate: timestamp("due_date"),
  xpReward: integer("xp_reward"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Template for both daily and side quests
export const questTemplate = pgTable("quest_template", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").$type<"daily" | "side">().notNull(),
  parentQuestId: text("parent_quest_id").references(() => mainQuest.id),
  recurrenceRule: text("recurrence_rule"),
  isActive: boolean("is_active").default(true),
  basePoints: integer("base_points").notNull().default(1),
  xpReward: integer("xp_reward").default(50),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tasks that belong to quest templates
export const taskTemplate = pgTable("task_template", {
  id: text("id").primaryKey(),
  questTemplateId: text("quest_template_id")
    .notNull()
    .references(() => questTemplate.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  basePoints: integer("base_points").notNull().default(1),
  plannedStartTime: text("planned_start_time"), // "HH:mm" format
  plannedEndTime: text("planned_end_time"), // "HH:mm" format
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Instances of quests (both daily and side)
export const questInstance = pgTable("quest_instance", {
  id: text("id").primaryKey(),
  templateId: text("template_id").references(() => questTemplate.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  date: date("date").notNull(), // The specific day this instance is for
  completed: boolean("completed").default(false),
  basePoints: integer("base_points").notNull(),
  xpReward: integer("xp_reward").notNull(), // Copied from template
  updatedAt: timestamp("completed_at"),
  streakCount: integer("streak_count").default(0), // Optional: track streaks
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Task instances
export const taskInstance = pgTable("task_instance", {
  id: text("id").primaryKey(),
  questInstanceId: text("quest_instance_id")
    .notNull()
    .references(() => questInstance.id, { onDelete: "cascade" }),
  templateId: text("template_id")
    .notNull()
    .references(() => taskTemplate.id),
  title: text("title").notNull(),
  completed: boolean("completed").default(false),
  basePoint: integer("base_points").notNull(),
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  updatedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const mainQuestRelations = relations(mainQuest, ({ many }) => ({
  questTemplates: many(questTemplate),
}));

export const questTemplateRelations = relations(
  questTemplate,
  ({ many, one }) => ({
    taskTemplates: many(taskTemplate),
    instances: many(questInstance),
    mainQuest: one(mainQuest, {
      fields: [questTemplate.parentQuestId],
      references: [mainQuest.id],
    }),
  })
);

export const taskTemplateRelations = relations(taskTemplate, ({ one }) => ({
  questTemplate: one(questTemplate, {
    fields: [taskTemplate.questTemplateId],
    references: [questTemplate.id],
  }),
}));

export const questInstanceRelations = relations(
  questInstance,
  ({ one, many }) => ({
    template: one(questTemplate, {
      fields: [questInstance.templateId],
      references: [questTemplate.id],
    }),
    taskInstances: many(taskInstance),
  })
);

export const taskInstanceRelations = relations(taskInstance, ({ one }) => ({
  template: one(taskTemplate, {
    fields: [taskInstance.templateId],
    references: [taskTemplate.id],
  }),
  questInstance: one(questInstance, {
    fields: [taskInstance.questInstanceId],
    references: [questInstance.id],
  }),
}));

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
