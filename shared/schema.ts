import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  contact: text("contact").notNull(),
  subject: text("subject").notNull(),
  timeSlots: json("time_slots").notNull(), // Array of {day, time} objects
  totalDuration: integer("total_duration").notNull(), // in minutes
  totalCost: integer("total_cost").notNull(), // in cents
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const formSettings = pgTable("form_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull().default("Boek je Bijles"),
  description: text("description").notNull().default("Vul je gegevens in om een afspraak te maken"),
  contactEmail: text("contact_email").notNull().default("hdbijles@gmail.com"),
  hourlyRate: integer("hourly_rate").notNull().default(15), // in euros
  subjects: json("subjects").notNull().default('["physics", "math", "other"]'),
});

export const availability = pgTable("availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  enabled: boolean("enabled").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  firstName: true,
  lastName: true,
  contact: true,
  subject: true,
  timeSlots: true,
  totalDuration: true,
  totalCost: true,
});

export const insertFormSettingsSchema = createInsertSchema(formSettings).pick({
  title: true,
  description: true,
  contactEmail: true,
  hourlyRate: true,
  subjects: true,
});

export const insertAvailabilitySchema = createInsertSchema(availability).pick({
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  enabled: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertFormSettings = z.infer<typeof insertFormSettingsSchema>;
export type FormSettings = typeof formSettings.$inferSelect;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type Availability = typeof availability.$inferSelect;
