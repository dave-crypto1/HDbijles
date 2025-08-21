import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertFormSettingsSchema, insertAvailabilitySchema, type Booking } from "@shared/schema";
import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'hdbijles@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Booking routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      
      // Send email notification
      try {
        const formSettings = await storage.getFormSettings();
        const timeSlotsList = Array.isArray(booking.timeSlots) 
          ? booking.timeSlots.map((slot: any) => `${slot.day} ${slot.time}`).join(", ")
          : "Invalid time slots";

        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'hdbijles@gmail.com',
          to: formSettings.contactEmail,
          subject: `Nieuwe bijles boeking - ${booking.firstName} ${booking.lastName}`,
          html: `
            <h2>Nieuwe Bijles Boeking</h2>
            <p><strong>Naam:</strong> ${booking.firstName} ${booking.lastName}</p>
            <p><strong>Contact:</strong> ${booking.contact}</p>
            <p><strong>Vak:</strong> ${booking.subject}</p>
            <p><strong>Tijdsloten:</strong> ${timeSlotsList}</p>
            <p><strong>Totale duur:</strong> ${booking.totalDuration} minuten</p>
            <p><strong>Totale kosten:</strong> €${(booking.totalCost / 100).toFixed(2)}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Form settings routes
  app.get("/api/form-settings", async (req, res) => {
    try {
      const settings = await storage.getFormSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch form settings" });
    }
  });

  app.patch("/api/form-settings", async (req, res) => {
    try {
      const validatedData = insertFormSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateFormSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update form settings" });
      }
    }
  });

  // Availability routes
  app.get("/api/availability", async (req, res) => {
    try {
      const availability = await storage.getAvailability();
      res.json(availability);
    } catch (error) {
      console.error("Error getting availability:", error);
      res.status(500).json({ message: "Failed to get availability" });
    }
  });

  // Add availability
  app.post("/api/availability", async (req, res) => {
    try {
      const validatedData = insertAvailabilitySchema.parse(req.body);
      const availability = await storage.addAvailability(validatedData);
      res.status(201).json(availability);
    } catch (error) {
      console.error("Error adding availability:", error);
      res.status(500).json({ message: "Failed to add availability" });
    }
  });

  // Remove availability
  app.delete("/api/availability/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.removeAvailability(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Availability not found" });
      }
    } catch (error) {
      console.error("Error removing availability:", error);
      res.status(500).json({ message: "Failed to remove availability" });
    }
  });

  // Clear all availability
  app.delete("/api/availability", async (req, res) => {
    try {
      await storage.clearAllAvailability();
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing availability:", error);
      res.status(500).json({ message: "Failed to clear availability" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session (simplified for demo)
      (req as any).session = { userId: user.id, username: user.username };
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    (req as any).session = null;
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const session = (req as any).session;
    if (session && session.userId) {
      res.json({ user: { id: session.userId, username: session.username } });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
