import express from "express";
import { z } from "zod";
import { storage } from "./storage";
import { insertTimeSlotSchema, insertAppointmentSchema, insertAdminSettingsSchema } from "@shared/schema";

const router = express.Router();

// Time slots routes
router.get("/api/timeslots", async (req, res) => {
  try {
    const date = req.query.date as string | undefined;
    const timeSlots = await storage.getTimeSlots(date);
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch time slots" });
  }
});

router.post("/api/timeslots", async (req, res) => {
  try {
    const data = insertTimeSlotSchema.parse(req.body);
    const timeSlot = await storage.createTimeSlot(data);
    res.status(201).json(timeSlot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create time slot" });
  }
});

router.put("/api/timeslots/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = insertTimeSlotSchema.partial().parse(req.body);
    const timeSlot = await storage.updateTimeSlot(id, data);
    if (!timeSlot) {
      return res.status(404).json({ error: "Time slot not found" });
    }
    res.json(timeSlot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to update time slot" });
  }
});

router.delete("/api/timeslots/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteTimeSlot(id);
    if (!success) {
      return res.status(404).json({ error: "Time slot not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete time slot" });
  }
});

// Appointments routes
router.get("/api/appointments", async (req, res) => {
  try {
    const appointments = await storage.getAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

router.get("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await storage.getAppointment(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
});

router.post("/api/appointments", async (req, res) => {
  try {
    const data = insertAppointmentSchema.parse(req.body);
    const appointment = await storage.createAppointment(data);
    res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

router.put("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const appointment = await storage.updateAppointment(id, data);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

router.delete("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteAppointment(id);
    if (!success) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

// Admin settings routes
router.get("/api/admin/settings", async (req, res) => {
  try {
    const settings = await storage.getAdminSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin settings" });
  }
});

router.put("/api/admin/settings", async (req, res) => {
  try {
    const data = insertAdminSettingsSchema.parse(req.body);
    const settings = await storage.updateAdminSettings(data);
    res.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to update admin settings" });
  }
});

// Generate time slots for a specific day (admin only)
router.post("/api/admin/generate-timeslots", async (req, res) => {
  try {
    const { date, startHour, endHour } = req.body;
    const timeSlots = [];
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endTime = `${hour.toString().padStart(2, '0')}:${(minute + 30).toString().padStart(2, '0')}`;
        
        const timeSlot = await storage.createTimeSlot({
          date,
          startTime,
          endTime,
          isAvailable: true,
        });
        timeSlots.push(timeSlot);
      }
    }
    
    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate time slots" });
  }
});

export default router;