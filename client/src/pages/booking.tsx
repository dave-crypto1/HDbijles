import { BookingForm } from "@/components/booking-form";
import { useLanguage } from "@/hooks/use-language";

export default function Booking() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20">
      {/* Booking Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-6">
              {t("booking.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("booking.subtitle")}
            </p>
          </div>

          <BookingForm />
        </div>
      </section>
    </div>
  );
}