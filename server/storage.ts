import { type User, type InsertUser, type Booking, type InsertBooking, type FormSettings, type InsertFormSettings, type Availability, type InsertAvailability } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;

  // Form settings methods
  getFormSettings(): Promise<FormSettings>;
  updateFormSettings(settings: Partial<InsertFormSettings>): Promise<FormSettings>;

  // Availability methods
  getAvailability(): Promise<Availability[]>;
  addAvailability(availability: InsertAvailability): Promise<Availability>;
  removeAvailability(id: string): Promise<boolean>;
  clearAllAvailability(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;
  private formSettings: FormSettings;
  private availability: Map<string, Availability>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.availability = new Map();
    
    // Initialize default form settings
    this.formSettings = {
      id: randomUUID(),
      title: "Boek je Bijles",
      description: "Vul je gegevens in om een afspraak te maken",
      contactEmail: "hdbijles@gmail.com",
      hourlyRate: 15,
      subjects: ["physics", "math", "other"],
    };

    // Start with no default availability - admin needs to add dates manually

    // Create default admin user
    this.createUser({ username: "haidar.amestoun", password: "Haidar2009" });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      status: "pending",
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
      return booking;
    }
    return undefined;
  }

  async getFormSettings(): Promise<FormSettings> {
    return this.formSettings;
  }

  async updateFormSettings(settings: Partial<InsertFormSettings>): Promise<FormSettings> {
    this.formSettings = { ...this.formSettings, ...settings };
    return this.formSettings;
  }

  async getAvailability(): Promise<Availability[]> {
    return Array.from(this.availability.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  async addAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const id = randomUUID();
    const availability: Availability = { ...insertAvailability, id, enabled: insertAvailability.enabled ?? true };
    this.availability.set(id, availability);
    return availability;
  }

  async removeAvailability(id: string): Promise<boolean> {
    return this.availability.delete(id);
  }

  async clearAllAvailability(): Promise<void> {
    this.availability.clear();
  }
}

export const storage = new MemStorage();
