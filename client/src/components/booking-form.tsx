import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { Calendar } from "./calendar";
import { CalendarCheck, Calculator, Atom, Book } from "lucide-react";

const bookingSchema = z.object({
  firstName: z.string().min(2, "Voornaam is verplicht"),
  lastName: z.string().min(2, "Achternaam is verplicht"),
  contact: z.string().min(5, "Email of telefoon is verplicht"),
  subject: z.string().min(1, "Selecteer een vak"),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface TimeSlot {
  day: string;
  time: string;
  dayName: string;
}

export function BookingForm() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

  const { data: formSettings } = useQuery({
    queryKey: ["/api/form-settings"],
  });

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      contact: "",
      subject: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingForm & { timeSlots: TimeSlot[]; totalDuration: number; totalCost: number }) => {
      return apiRequest("POST", "/api/bookings", data);
    },
    onSuccess: () => {
      toast({
        title: "Boeking bevestigd!",
        description: "Je ontvangt binnenkort een bevestigingsmail.",
      });
      form.reset();
      setSelectedSlots([]);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij boeken",
        description: error.message || "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingForm) => {
    if (selectedSlots.length === 0) {
      toast({
        title: "Geen tijdslot geselecteerd",
        description: "Selecteer minstens één tijdslot om door te gaan.",
        variant: "destructive",
      });
      return;
    }

    const totalDuration = selectedSlots.length * 30; // 30 minutes per slot
    const hourlyRate = (formSettings as any)?.hourlyRate || 15;
    const totalCost = Math.round((totalDuration / 60) * hourlyRate * 100); // in cents

    createBookingMutation.mutate({
      ...data,
      timeSlots: selectedSlots,
      totalDuration,
      totalCost,
    });
  };

  const totalDuration = selectedSlots.length * 30;
  const hourlyRate = (formSettings as any)?.hourlyRate || 15;
  const totalCost = (totalDuration / 60) * hourlyRate;

  const subjectOptions = [
    { value: "physics", label: t("subjects.physics"), icon: Atom, description: "Mechanica, elektriciteit, optica" },
    { value: "math", label: t("subjects.math"), icon: Calculator, description: "Algebra, geometrie, statistiek" },
    { value: "other", label: t("subjects.other"), icon: Book, description: "Vertel me wat je nodig hebt" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Booking Form */}
      <div className="order-2 lg:order-1">
        <div className="relative">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 glassmorphism rounded-3xl shadow-2xl"></div>
          
          {/* Form Content */}
          <div className="relative z-10 p-8 md:p-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">
                {(formSettings as any)?.title || t("booking.form.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {(formSettings as any)?.description || t("booking.form.description")}
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="relative group">
                  <Label
                    htmlFor="firstName"
                    className={`absolute left-4 transition-all duration-300 px-2 rounded-md ${
                      form.watch("firstName") || form.formState.errors.firstName
                        ? "-top-2.5 text-sm text-navy-600 bg-white/80 dark:bg-gray-800/80"
                        : "top-4 text-base text-gray-500 bg-transparent"
                    }`}
                  >
                    {t("booking.form.firstName")}
                  </Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    className="peer px-4 py-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200/30 dark:border-gray-600/30 rounded-xl focus:border-navy-500 focus:ring-0 transition-all duration-300 focus:shadow-lg focus:shadow-navy-500/20"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-navy-500/20 to-navy-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  {form.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="relative group">
                  <Label
                    htmlFor="lastName"
                    className={`absolute left-4 transition-all duration-300 px-2 rounded-md ${
                      form.watch("lastName") || form.formState.errors.lastName
                        ? "-top-2.5 text-sm text-navy-600 bg-white/80 dark:bg-gray-800/80"
                        : "top-4 text-base text-gray-500 bg-transparent"
                    }`}
                  >
                    {t("booking.form.lastName")}
                  </Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    className="peer px-4 py-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200/30 dark:border-gray-600/30 rounded-xl focus:border-navy-500 focus:ring-0 transition-all duration-300 focus:shadow-lg focus:shadow-navy-500/20"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-navy-500/20 to-navy-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  {form.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="relative group">
                <Label
                  htmlFor="contact"
                  className={`absolute left-4 transition-all duration-300 px-2 rounded-md ${
                    form.watch("contact") || form.formState.errors.contact
                      ? "-top-2.5 text-sm text-navy-600 bg-white/80 dark:bg-gray-800/80"
                      : "top-4 text-base text-gray-500 bg-transparent"
                  }`}
                >
                  {t("booking.form.contact")}
                </Label>
                <Input
                  id="contact"
                  {...form.register("contact")}
                  className="peer px-4 py-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200/30 dark:border-gray-600/30 rounded-xl focus:border-navy-500 focus:ring-0 transition-all duration-300 focus:shadow-lg focus:shadow-navy-500/20"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-navy-500/20 to-navy-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                {form.formState.errors.contact && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.contact.message}</p>
                )}
              </div>

              {/* Subject Selection */}
              <div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t("booking.form.subject")}
                </Label>
                <RadioGroup 
                  value={form.watch("subject")} 
                  onValueChange={(value) => form.setValue("subject", value)}
                  className="grid grid-cols-1 gap-3"
                >
                  {subjectOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <Label
                        htmlFor={`subject-${option.value}`}
                        className="flex items-center p-4 glassmorphism-card border-2 border-gray-200/30 dark:border-gray-600/30 rounded-xl cursor-pointer transition-all duration-300 hover:border-navy-400 has-[:checked]:border-navy-500 has-[:checked]:bg-navy-50/50 dark:has-[:checked]:bg-navy-900/20 has-[:checked]:shadow-lg has-[:checked]:shadow-navy-500/20"
                      >
                        <div className="w-12 h-12 navy-gradient rounded-lg flex items-center justify-center mr-4">
                          <option.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{option.label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
                        </div>
                        <RadioGroupItem
                          value={option.value}
                          id={`subject-${option.value}`}
                          className="ml-auto"
                        />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {form.formState.errors.subject && (
                  <p className="text-red-500 text-sm">{form.formState.errors.subject.message}</p>
                )}
              </div>

              {/* Selected Time Slots Summary */}
              <div className="p-4 bg-navy-50/50 dark:bg-navy-900/20 rounded-xl border border-navy-200/30 dark:border-navy-700/30">
                <h4 className="font-semibold text-navy-900 dark:text-white mb-2">
                  {t("booking.form.selectedSlots")}
                </h4>
                <div className="text-sm text-navy-700 dark:text-navy-300 mb-3">
                  {selectedSlots.length === 0 ? (
                    <p>{t("booking.form.noSlots")}</p>
                  ) : (
                    <div>
                      {selectedSlots.map((slot, index) => (
                        <div key={index} className="mb-1">
                          <strong>{slot.dayName}:</strong> {slot.time}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t("booking.form.totalDuration")}
                  </span>
                  <span className="font-semibold text-navy-600 dark:text-navy-400">
                    {totalDuration} minuten
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t("booking.form.totalCost")}
                  </span>
                  <span className="font-bold text-lg text-navy-600 dark:text-navy-400">
                    €{totalCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createBookingMutation.isPending}
                className="w-full group relative px-8 py-4 navy-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-4 focus:ring-navy-500/50"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <CalendarCheck className="h-5 w-5" />
                  <span>
                    {createBookingMutation.isPending ? "Bezig met boeken..." : t("booking.form.submit")}
                  </span>
                </span>
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {t("booking.form.paymentNote")}
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="order-1 lg:order-2">
        <Calendar selectedSlots={selectedSlots} onSlotsChange={setSelectedSlots} />
      </div>
    </div>
  );
}
