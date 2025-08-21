import { BookingForm } from "@/components/booking-form";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Atom, Calculator, Book, Clock, Mail, GraduationCap, Check } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Atom,
      title: t("services.physics.title"),
      description: "Gespecialiseerd in mechanica, elektriciteit en optica",
    },
    {
      icon: Calculator,
      title: t("services.math.title"),
      description: "Algebra, geometrie en calculus op maat uitgelegd",
    },
    {
      icon: Clock,
      title: "Flexibele Planning",
      description: "Beschikbaar op woensdag, vrijdag en weekenden",
    },
  ];

  const services = [
    {
      icon: Atom,
      title: t("services.physics.title"),
      description: t("services.physics.description"),
      topics: ["Mechanica & Dynamica", "Elektriciteit & Magnetisme", "Optica & Golven"],
    },
    {
      icon: Calculator,
      title: t("services.math.title"),
      description: t("services.math.description"),
      topics: ["Algebra & Vergelijkingen", "Geometrie & Trigonometrie", "Statistiek & Kansberekening"],
    },
    {
      icon: Book,
      title: t("services.other.title"),
      description: t("services.other.description"),
      topics: ["Huiswerkbegeleiding", "Examenvoorbereiding", "Studiemethodiek"],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block float mb-8">
              <div className="w-24 h-24 navy-gradient rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-3xl">HD</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-navy-900 dark:text-white mb-6 leading-tight">
              HD <span className="text-navy-600">Bijles</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                className="group relative px-8 py-4 navy-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <a href="#booking">
                  <span className="relative z-10 flex items-center space-x-2">
                    <Atom className="h-5 w-5" />
                    <span>{t("hero.bookNow")}</span>
                  </span>
                </a>
              </Button>
              <div className="text-center">
                <span className="text-3xl font-bold text-navy-600 dark:text-navy-400">€15</span>
                <span className="text-gray-600 dark:text-gray-400 text-lg">/uur</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 glassmorphism-card rounded-2xl">
                <div className="w-16 h-16 bg-navy-100 dark:bg-navy-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-navy-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-6">
              {t("services.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/20 dark:border-gray-700/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-navy-600/5 to-navy-800/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 navy-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-navy-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                    {service.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-2xl font-bold text-navy-600">
                    €15 <span className="text-lg font-normal text-gray-500">/uur</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-6">
              {t("booking.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("booking.subtitle")}
            </p>
          </div>

          <BookingForm />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-6">
            {t("contact.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t("contact.subtitle")}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center p-6 glassmorphism-card rounded-2xl">
              <div className="w-16 h-16 bg-navy-100 dark:bg-navy-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("contact.email")}</h3>
              <a 
                href="mailto:hdbijles@gmail.com" 
                className="text-navy-600 dark:text-navy-400 hover:underline"
              >
                hdbijles@gmail.com
              </a>
            </div>
            
            <div className="text-center p-6 glassmorphism-card rounded-2xl">
              <div className="w-16 h-16 bg-navy-100 dark:bg-navy-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("contact.aboutMe")}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("contact.aboutDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 navy-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">HD</span>
            </div>
            <span className="text-xl font-bold">HD Bijles</span>
          </div>
          <p className="text-navy-300 mb-6">
            Professionele bijlesdiensten door een ervaren 5de middelbaar student
          </p>
          <div className="flex items-center justify-center space-x-6 text-navy-300">
            <a href="mailto:hdbijles@gmail.com" className="hover:text-white transition-colors">
              <Mail className="h-4 w-4 inline mr-1" />
              hdbijles@gmail.com
            </a>
            <span>|</span>
            <span>€15/uur</span>
            <span>|</span>
            <span>Beschikbaar: Wo, Vr, Za, Zo</span>
          </div>
          <div className="mt-6 pt-6 border-t border-navy-800 text-sm text-navy-400">
            © 2024 HD Bijles. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
}
