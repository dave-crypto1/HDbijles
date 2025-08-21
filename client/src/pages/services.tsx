import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Atom, Calculator, Book, Check } from "lucide-react";

export default function Services() {
  const { t } = useLanguage();

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
    <div className="min-h-screen pt-20">
      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-6">
              {t("services.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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

          <div className="text-center">
            <Button
              asChild
              className="group relative px-8 py-4 navy-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <a href="/booking">
                <span className="relative z-10 flex items-center space-x-2">
                  <Atom className="h-5 w-5" />
                  <span>{t("hero.bookNow")}</span>
                </span>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}