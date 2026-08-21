import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const parentControls = mysqlTable("parentControls", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  pinHash: varchar("pinHash", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [uniqueIndex("parentControls_user_unique").on(table.userId)]);

export const childProfiles = mysqlTable("childProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  avatar: varchar("avatar", { length: 48 }).notNull(),
  ageGroup: mysqlEnum("ageGroup", ["3–5", "6–8", "9–10"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("childProfiles_user_idx").on(table.userId)]);

export const subjectProgress = mysqlTable("subjectProgress", {
  id: int("id").autoincrement().primaryKey(),
  childProfileId: int("childProfileId").notNull().references(() => childProfiles.id, { onDelete: "cascade" }),
  subject: mysqlEnum("subject", ["Math", "Reading", "Science", "Art", "Music", "alphabet-phonics", "numbers-counting", "math-adventures", "reading-stories", "science-explorer", "arts-creativity", "music-rhythm", "puzzles-brain-games", "english-vocabulary", "filipino-language", "social-emotional-learning", "life-skills", "geography-world", "nature-environment", "fun-games"]).notNull(),
  unlockedLevel: int("unlockedLevel").default(1).notNull(),
  completedLevels: int("completedLevels").default(0).notNull(),
  totalStars: int("totalStars").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("subjectProgress_child_subject_unique").on(table.childProfileId, table.subject),
  index("subjectProgress_child_idx").on(table.childProfileId),
]);

export const activityCompletions = mysqlTable("activityCompletions", {
  id: int("id").autoincrement().primaryKey(),
  childProfileId: int("childProfileId").notNull().references(() => childProfiles.id, { onDelete: "cascade" }),
  subject: mysqlEnum("subject", ["Math", "Reading", "Science", "Art", "Music", "alphabet-phonics", "numbers-counting", "math-adventures", "reading-stories", "science-explorer", "arts-creativity", "music-rhythm", "puzzles-brain-games", "english-vocabulary", "filipino-language", "social-emotional-learning", "life-skills", "geography-world", "nature-environment", "fun-games"]).notNull(),
  levelNumber: int("levelNumber").notNull(),
  interactionType: mysqlEnum("interactionType", ["multiple-choice", "drag-and-drop", "drawing"]).notNull(),
  stars: int("stars").notNull(),
  durationSeconds: int("durationSeconds").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => [
  index("activityCompletions_child_idx").on(table.childProfileId),
  index("activityCompletions_child_subject_idx").on(table.childProfileId, table.subject),
]);

export const childBadges = mysqlTable("childBadges", {
  id: int("id").autoincrement().primaryKey(),
  childProfileId: int("childProfileId").notNull().references(() => childProfiles.id, { onDelete: "cascade" }),
  badgeId: varchar("badgeId", { length: 64 }).notNull(),
  subject: mysqlEnum("subject", ["Math", "Reading", "Science", "Art", "Music", "alphabet-phonics", "numbers-counting", "math-adventures", "reading-stories", "science-explorer", "arts-creativity", "music-rhythm", "puzzles-brain-games", "english-vocabulary", "filipino-language", "social-emotional-learning", "life-skills", "geography-world", "nature-environment", "fun-games"]).notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("childBadges_profile_badge_unique").on(table.childProfileId, table.badgeId),
  index("childBadges_child_idx").on(table.childProfileId),
]);

export const learningSessions = mysqlTable("learningSessions", {
  id: int("id").autoincrement().primaryKey(),
  childProfileId: int("childProfileId").notNull().references(() => childProfiles.id, { onDelete: "cascade" }),
  subject: mysqlEnum("subject", ["Math", "Reading", "Science", "Art", "Music", "alphabet-phonics", "numbers-counting", "math-adventures", "reading-stories", "science-explorer", "arts-creativity", "music-rhythm", "puzzles-brain-games", "english-vocabulary", "filipino-language", "social-emotional-learning", "life-skills", "geography-world", "nature-environment", "fun-games"]).notNull(),
  durationSeconds: int("durationSeconds").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => [index("learningSessions_child_idx").on(table.childProfileId)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ChildProfile = typeof childProfiles.$inferSelect;
export type SubjectProgress = typeof subjectProgress.$inferSelect;
