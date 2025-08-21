import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Time slot schema
export const timeSlot = {
  id: z.string(),
  date: z.string(), // YYYY-MM-DD format
  startTime: z.string(), // HH:MM format
  endTime: z.string(), // HH:MM format
  isAvailable: z.boolean(),
  createdAt: z.date(),
} as const;

// Appointment schema
export const appointment = {
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  subject: z.enum(["physics", "mathematics", "other"]),
  otherSubject: z.string().optional(),
  timeSlotIds: z.array(z.string()),
  totalDuration: z.number(), // in minutes
  totalCost: z.number(), // in euros
  status: z.enum(["pending", "confirmed", "cancelled"]),
  notes: z.string().optional(),
  createdAt: z.date(),
} as const;

// Admin settings schema
export const adminSettings = {
  id: z.string(),
  hourlyRate: z.number(),
  notificationEmail: z.string().email(),
  availableDays: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])),
  defaultTimeSlotDuration: z.number(), // in minutes
} as const;

// Insert schemas
export const insertTimeSlotSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean().default(true),
});

export const insertAppointmentSchema = z.object({
  firstName: z.string().min(1, "Voornaam is verplicht"),
  lastName: z.string().min(1, "Achternaam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().min(1, "Telefoonnummer is verplicht"),
  subject: z.enum(["physics", "mathematics", "other"]),
  otherSubject: z.string().optional(),
  timeSlotIds: z.array(z.string()).min(1, "Selecteer minimaal één tijdslot"),
  notes: z.string().optional(),
});

export const insertAdminSettingsSchema = z.object({
  hourlyRate: z.number().min(0),
  notificationEmail: z.string().email(),
  availableDays: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])),
  defaultTimeSlotDuration: z.number().min(30),
});

// Types
export type TimeSlot = z.infer<typeof insertTimeSlotSchema> & { id: string; createdAt: Date };
export type Appointment = z.infer<typeof insertAppointmentSchema> & { 
  id: string; 
  totalDuration: number;
  totalCost: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date; 
};
export type AdminSettings = z.infer<typeof insertAdminSettingsSchema> & { id: string };

export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertAdminSettings = z.infer<typeof insertAdminSettingsSchema>;