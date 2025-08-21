import { useLanguage } from "@/hooks/use-language";
import { Mail, GraduationCap } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20">
      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-6">
            {t("contact.title")}
          </h1>
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

          <div className="mt-12 p-8 glassmorphism-card rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">
              Beschikbaarheid
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold mb-2">Weekdagen:</h3>
                <p>Woensdag: 14:00 - 17:00</p>
                <p>Vrijdag: 15:00 - 18:00</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Weekend:</h3>
                <p>Zaterdag: 10:00 - 16:00</p>
                <p>Zondag: 13:00 - 16:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}