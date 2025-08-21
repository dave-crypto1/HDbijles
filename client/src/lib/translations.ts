export const translations = {
  nl: {
    navigation: {
      home: "Home",
      services: "Diensten",
      booking: "Boek Bijles",
      contact: "Contact",
      admin: "Admin",
    },
    hero: {
      title: "HD Bijles",
      subtitle: "Professionele bijlesdiensten in Fysica en Wiskunde door een ervaren 5de middelbaar student",
      bookNow: "Boek je Bijles Nu",
      price: "€15/uur",
    },
    services: {
      title: "Onze Diensten",
      subtitle: "Gepersonaliseerde bijlessen die zijn afgestemd op jouw leerstijl en doelen",
      physics: {
        title: "Fysica Bijles",
        description: "Van basis mechanica tot complexe elektromagnetische verschijnselen. Ik help je de theorie te begrijpen met praktische voorbeelden.",
        topics: ["Mechanica & Dynamica", "Elektriciteit & Magnetisme", "Optica & Golven"]
      },
      math: {
        title: "Wiskunde Bijles",
        description: "Algebra, geometrie, statistiek en calculus uitgelegd op een manier die past bij jouw niveau en leertempo.",
        topics: ["Algebra & Vergelijkingen", "Geometrie & Trigonometrie", "Statistiek & Kansberekening"]
      },
      other: {
        title: "Andere Vakken",
        description: "Hulp nodig bij andere vakken? Laat het me weten! Ik help graag bij huiswerk en examenvoorbereiding.",
        topics: ["Huiswerkbegeleiding", "Examenvoorbereiding", "Studiemethodiek"]
      }
    },
    booking: {
      title: "Boek je Bijles",
      subtitle: "Kies je tijdslot en vak. Betaling gebeurt ter plaatse na de les.",
      form: {
        title: "Boek je Bijles",
        description: "Vul je gegevens in om een afspraak te maken",
        firstName: "Voornaam",
        lastName: "Achternaam",
        contact: "Email of Telefoon",
        subject: "Kies je vak:",
        selectedSlots: "Geselecteerde Tijdsloten:",
        noSlots: "Geen tijdsloten geselecteerd",
        totalDuration: "Totale duur:",
        totalCost: "Totale kosten:",
        submit: "Bevestig Boeking",
        paymentNote: "Betaling gebeurt ter plaatse na de les. Je ontvangt een bevestigingsmail op hdbijles@gmail.com"
      },
      calendar: {
        title: "Kies je Tijdslot",
        subtitle: "Selecteer één of meerdere 30-minuten blokken",
        legend: {
          available: "Beschikbaar",
          selected: "Geselecteerd",
          booked: "Bezet"
        }
      }
    },
    contact: {
      title: "Contact",
      subtitle: "Heb je vragen? Neem gerust contact met me op!",
      email: "Email",
      aboutMe: "Over Mij",
      aboutDescription: "5de middelbaar student met passie voor onderwijs"
    },
    admin: {
      title: "Admin Dashboard",
      subtitle: "Beheer je bijlesdienst en formulier instellingen",
      login: {
        title: "Admin Login",
        username: "Username",
        password: "Password",
        submit: "Inloggen"
      },
      formEditor: {
        title: "Formulier Editor",
        formTitle: "Formulier Titel",
        description: "Beschrijving",
        contactEmail: "Contact Email",
        hourlyRate: "Uurtarief (€)",
        subjects: "Vakken",
        addSubject: "Vak Toevoegen",
        save: "Wijzigingen Opslaan"
      },
      availability: {
        title: "Beschikbaarheid",
        save: "Beschikbaarheid Opslaan"
      }
    },
    days: {
      sunday: "Zondag",
      monday: "Maandag",
      tuesday: "Dinsdag",
      wednesday: "Woensdag",
      thursday: "Donderdag",
      friday: "Vrijdag",
      saturday: "Zaterdag"
    },
    subjects: {
      physics: "Fysica",
      math: "Wiskunde",
      other: "Andere Vakken"
    }
  },
  en: {
    navigation: {
      home: "Home",
      services: "Services",
      booking: "Book Tutoring",
      contact: "Contact",
      admin: "Admin",
    },
    hero: {
      title: "HD Tutoring",
      subtitle: "Professional tutoring services in Physics and Mathematics by an experienced 5th year high school student",
      bookNow: "Book Your Tutoring Now",
      price: "€15/hour",
    },
    // ... (similar structure for other languages)
  },
  fr: {
    navigation: {
      home: "Accueil",
      services: "Services",
      booking: "Réserver",
      contact: "Contact",
      admin: "Admin",
    },
    // ... (French translations)
  },
  ar: {
    navigation: {
      home: "الرئيسية",
      services: "الخدمات",
      booking: "احجز الدرس",
      contact: "اتصل بنا",
      admin: "الإدارة",
    },
    // ... (Arabic translations)
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.nl;
