import ContactHero from "@/components/templates/contact-us/ContactHero";
import ContactSection from "@/components/templates/contact-us/ContactSection";
import ContactMethods from "@/components/templates/contact-us/ContactMethod";
import ContactFAQ from "@/components/templates/contact-us/ContactFAQ";
import ContactCTA from "@/components/templates/contact-us/ContactCTA";


export default function ContactPage() {
    return (
        <main dir="rtl" className="w-full">
            <ContactHero />

            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <ContactSection />
                <ContactMethods />
                <ContactFAQ />
                <ContactCTA />
            </div>
        </main>
    );
}