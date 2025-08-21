import { TimeSlot, Appointment, AdminSettings, InsertTimeSlot, InsertAppointment, InsertAdminSettings } from "@shared/schema";

export interface IStorage {
  // Time slots
  getTimeSlots(date?: string): Promise<TimeSlot[]>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;
  updateTimeSlot(id: string, updates: Partial<InsertTimeSlot>): Promise<TimeSlot | null>;
  deleteTimeSlot(id: string): Promise<boolean>;
  
  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | null>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null>;
  deleteAppointment(id: string): Promise<boolean>;
  
  // Admin settings
  getAdminSettings(): Promise<AdminSettings | null>;
  updateAdminSettings(settings: InsertAdminSettings): Promise<AdminSettings>;
}

export class MemStorage implements IStorage {
  private timeSlots: TimeSlot[] = [];
  private appointments: Appointment[] = [];
  private adminSettings: AdminSettings | null = {
    id: "default",
    hourlyRate: 15,
    notificationEmail: "admin@hdbijles.nl",
    availableDays: ["wednesday", "friday", "saturday", "sunday"],
    defaultTimeSlotDuration: 30,
  };

  // Time slots
  async getTimeSlots(date?: string): Promise<TimeSlot[]> {
    if (date) {
      return this.timeSlots.filter(slot => slot.date === date);
    }
    return [...this.timeSlots];
  }

  async createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const newTimeSlot: TimeSlot = {
      id: Math.random().toString(36).substring(2, 15),
      ...timeSlot,
      createdAt: new Date(),
    };
    this.timeSlots.push(newTimeSlot);
    return newTimeSlot;
  }

  async updateTimeSlot(id: string, updates: Partial<InsertTimeSlot>): Promise<TimeSlot | null> {
    const index = this.timeSlots.findIndex(slot => slot.id === id);
    if (index === -1) return null;
    
    this.timeSlots[index] = { ...this.timeSlots[index], ...updates };
    return this.timeSlots[index];
  }

  async deleteTimeSlot(id: string): Promise<boolean> {
    const index = this.timeSlots.findIndex(slot => slot.id === id);
    if (index === -1) return false;
    
    this.timeSlots.splice(index, 1);
    return true;
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return [...this.appointments];
  }

  async getAppointment(id: string): Promise<Appointment | null> {
    return this.appointments.find(appointment => appointment.id === id) || null;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const settings = await this.getAdminSettings();
    const hourlyRate = settings?.hourlyRate || 15;
    
    // Calculate duration based on selected time slots
    const selectedSlots = await Promise.all(
      appointment.timeSlotIds.map(id => this.timeSlots.find(slot => slot.id === id))
    );
    
    const totalDuration = selectedSlots.length * 30; // 30 minutes per slot
    const totalCost = (totalDuration / 60) * hourlyRate;

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substring(2, 15),
      ...appointment,
      totalDuration,
      totalCost,
      status: "pending",
      createdAt: new Date(),
    };
    
    this.appointments.push(newAppointment);
    
    // Mark selected time slots as unavailable
    appointment.timeSlotIds.forEach(slotId => {
      this.updateTimeSlot(slotId, { isAvailable: false });
    });
    
    return newAppointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    const index = this.appointments.findIndex(appointment => appointment.id === id);
    if (index === -1) return null;
    
    this.appointments[index] = { ...this.appointments[index], ...updates };
    return this.appointments[index];
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const appointmentIndex = this.appointments.findIndex(appointment => appointment.id === id);
    if (appointmentIndex === -1) return false;
    
    const appointment = this.appointments[appointmentIndex];
    
    // Mark time slots as available again
    appointment.timeSlotIds.forEach(slotId => {
      this.updateTimeSlot(slotId, { isAvailable: true });
    });
    
    this.appointments.splice(appointmentIndex, 1);
    return true;
  }

  // Admin settings
  async getAdminSettings(): Promise<AdminSettings | null> {
    return this.adminSettings;
  }

  async updateAdminSettings(settings: InsertAdminSettings): Promise<AdminSettings> {
    this.adminSettings = {
      id: this.adminSettings?.id || "default",
      ...settings,
    };
    return this.adminSettings;
  }
}

export const storage = new MemStorage();