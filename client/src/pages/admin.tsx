import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { Settings, Save, Trash2, Plus, Calendar, FileEdit, Users } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const formSettingsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contactEmail: z.string().email("Valid email is required"),
  hourlyRate: z.number().min(1, "Hourly rate must be at least 1"),
});

const availabilitySchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  enabled: z.boolean().optional().default(true),
});

type LoginForm = z.infer<typeof loginSchema>;
type FormSettingsForm = z.infer<typeof formSettingsSchema>;
type AvailabilityForm = z.infer<typeof availabilitySchema>;

export default function Admin() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newAvailability, setNewAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
    enabled: true
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const { data: formSettings } = useQuery({
    queryKey: ["/api/form-settings"],
    enabled: isAuthenticated,
  });

  const { data: availability = [] } = useQuery({
    queryKey: ["/api/availability"],
    enabled: isAuthenticated,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (user && !userLoading) {
      setIsAuthenticated(true);
    }
  }, [user, userLoading]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const settingsForm = useForm<FormSettingsForm>({
    resolver: zodResolver(formSettingsSchema),
    defaultValues: formSettings || {
      title: "",
      description: "",
      contactEmail: "",
      hourlyRate: 15,
    },
  });

  useEffect(() => {
    if (formSettings) {
      settingsForm.reset(formSettings);
    }
  }, [formSettings, settingsForm]);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: FormSettingsForm) => {
      return apiRequest("PATCH", "/api/form-settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Form settings have been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/form-settings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const addAvailabilityMutation = useMutation({
    mutationFn: async (data: AvailabilityForm) => {
      return apiRequest("POST", "/api/availability", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      setNewAvailability({ date: "", startTime: "", endTime: "", enabled: true });
      toast({ title: "Availability added successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to add availability", variant: "destructive" });
    },
  });

  const removeAvailabilityMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/availability/${id}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({ title: "Availability removed successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to remove availability", variant: "destructive" });
    },
  });

  const clearAvailabilityMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/availability", null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({ title: "All availability cleared successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to clear availability", variant: "destructive" });
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Booking updated",
        description: "Booking status has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update booking",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const handleSettingsSubmit = (data: FormSettingsForm) => {
    updateSettingsMutation.mutate(data);
  };

  const handleAddAvailability = () => {
    if (newAvailability.date && newAvailability.startTime && newAvailability.endTime) {
      addAvailabilityMutation.mutate(newAvailability);
    }
  };

  const handleRemoveAvailability = (id: string) => {
    removeAvailabilityMutation.mutate(id);
  };

  const handleClearAllAvailability = () => {
    clearAvailabilityMutation.mutate();
  };


  if (userLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-0 glassmorphism rounded-3xl shadow-2xl"></div>
            <div className="relative z-10 p-8">
              <div className="text-center mb-6">
                <Settings className="h-12 w-12 text-navy-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-navy-900 dark:text-white">
                  {t("admin.login.title")}
                </h3>
              </div>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="relative group">
                  <Label
                    htmlFor="username"
                    className={`absolute left-4 transition-all duration-300 px-2 rounded-md ${
                      loginForm.watch("username")
                        ? "-top-2.5 text-sm text-navy-600 bg-white/80 dark:bg-gray-800/80"
                        : "top-4 text-base text-gray-500 bg-transparent"
                    }`}
                  >
                    {t("admin.login.username")}
                  </Label>
                  <Input
                    id="username"
                    {...loginForm.register("username")}
                    className="peer px-4 py-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200/30 dark:border-gray-600/30 rounded-xl focus:border-navy-500"
                  />
                </div>
                <div className="relative group">
                  <Label
                    htmlFor="password"
                    className={`absolute left-4 transition-all duration-300 px-2 rounded-md ${
                      loginForm.watch("password")
                        ? "-top-2.5 text-sm text-navy-600 bg-white/80 dark:bg-gray-800/80"
                        : "top-4 text-base text-gray-500 bg-transparent"
                    }`}
                  >
                    {t("admin.login.password")}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...loginForm.register("password")}
                    className="peer px-4 py-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200/30 dark:border-gray-600/30 rounded-xl focus:border-navy-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full px-6 py-3 navy-gradient text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  {loginMutation.isPending ? "Logging in..." : t("admin.login.submit")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-900 dark:text-white mb-4">
            {t("admin.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("admin.subtitle")}
          </p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="form-editor" className="flex items-center space-x-2">
              <FileEdit className="h-4 w-4" />
              <span>Form Editor</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Availability</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No bookings yet
                    </p>
                  ) : (
                    bookings.map((booking: any) => (
                      <div key={booking.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">
                              {booking.firstName} {booking.lastName}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.contact}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Subject: {booking.subject}
                            </p>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <p className="font-medium mb-1">Scheduled Time Slots:</p>
                              {Array.isArray(booking.timeSlots) ? (
                                <div className="ml-2 space-y-1">
                                  {booking.timeSlots.map((slot: any, index: number) => (
                                    <div key={index} className="text-xs bg-navy-50 dark:bg-navy-900/20 px-2 py-1 rounded">
                                      <span className="font-medium">{slot.dayName}:</span> {slot.time}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs ml-2">Time slots not available</p>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Duration: {booking.totalDuration} minutes
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Cost: €{(booking.totalCost / 100).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant={booking.status === "confirmed" ? "default" : "outline"}
                              onClick={() =>
                                updateBookingStatusMutation.mutate({
                                  id: booking.id,
                                  status: "confirmed",
                                })
                              }
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant={booking.status === "cancelled" ? "destructive" : "outline"}
                              onClick={() =>
                                updateBookingStatusMutation.mutate({
                                  id: booking.id,
                                  status: "cancelled",
                                })
                              }
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form-editor">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.formEditor.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={settingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="title">{t("admin.formEditor.formTitle")}</Label>
                    <Input
                      id="title"
                      {...settingsForm.register("title")}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">{t("admin.formEditor.description")}</Label>
                    <Textarea
                      id="description"
                      {...settingsForm.register("description")}
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">{t("admin.formEditor.contactEmail")}</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...settingsForm.register("contactEmail")}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hourlyRate">{t("admin.formEditor.hourlyRate")}</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      {...settingsForm.register("hourlyRate", { valueAsNumber: true })}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={updateSettingsMutation.isPending}
                    className="w-full navy-gradient text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateSettingsMutation.isPending ? "Saving..." : t("admin.formEditor.save")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.availability.title")}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Voeg specifieke datums toe wanneer je beschikbaar bent. Standaard zijn alle datums niet beschikbaar.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Add new availability form */}
                  <div className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-4">Nieuwe beschikbaarheid toevoegen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="date">Datum</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newAvailability.date}
                          onChange={(e) => setNewAvailability(prev => ({ ...prev, date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Starttijd</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newAvailability.startTime}
                          onChange={(e) => setNewAvailability(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">Eindtijd</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newAvailability.endTime}
                          onChange={(e) => setNewAvailability(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleAddAvailability}
                          disabled={addAvailabilityMutation.isPending || !newAvailability.date || !newAvailability.startTime || !newAvailability.endTime}
                          className="w-full navy-gradient text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {addAvailabilityMutation.isPending ? "Adding..." : "Toevoegen"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Current availability list */}
                  <div>
                    <h3 className="font-medium mb-4">Huidige beschikbaarheid</h3>
                    {availability.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        Geen beschikbaarheid ingesteld. Voeg hierboven datums toe.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {availability
                          .sort((a: any, b: any) => a.date.localeCompare(b.date))
                          .map((avail: any) => (
                          <div key={avail.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex-1">
                              <span className="font-medium">
                                {new Date(avail.date + 'T00:00:00').toLocaleDateString('nl-NL', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {avail.startTime} - {avail.endTime}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveAvailability(avail.id)}
                              disabled={removeAvailabilityMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Clear all button */}
                  {availability.length > 0 && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={handleClearAllAvailability}
                        disabled={clearAvailabilityMutation.isPending}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {clearAvailabilityMutation.isPending ? "Clearing..." : "Alle beschikbaarheid verwijderen"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Additional system settings can be configured here.
                  </p>
                  <Button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    variant="outline"
                  >
                    Clear Local Storage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
