import ContactInfo from "@/components/templates/contact-us/ContactInfo";
import ContactForm from "@/components/templates/contact-us/ContactForm";

export default function ContactSection() {
    return (
        <section className="my-5 sm:my-7 md:my-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_0.8fr]">


                {/* Form */}
                <ContactForm />

                {/* Contact Info */}
                <ContactInfo />



            </div>
        </section>
    );
}