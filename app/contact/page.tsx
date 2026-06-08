"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { defaultStorefrontSettings, phoneHref, type StorefrontSettings } from "@/lib/settings";
import Breadcrumb from "@/components/Breadcrumb";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState<StorefrontSettings>(defaultStorefrontSettings);

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setSettings({
          supportEmail: data.supportEmail || defaultStorefrontSettings.supportEmail,
          supportPhone: data.supportPhone || defaultStorefrontSettings.supportPhone,
          address: data.address || defaultStorefrontSettings.address,
          maintenanceMode: Boolean(data.maintenanceMode),
        });
      })
      .catch(() => {});
  }, []);

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      setSubmitting(true);
      setStatus("idle");
      setMessage("");

      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          page: "contact",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Could not send message");
      }

      form.reset();
      setStatus("success");
      setMessage("Message sent. We will get back to you shortly.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="ig-contact-page">
      
      <section className="ig-contact-section">
        <Breadcrumb  title="Contact" />
        <div className="container mt-50">
          
          <div className="ig-contact-layout">
            <div className="ig-contact-left">
              <div className="ig-contact-cards">
                <div className="ig-contact-info-card">
                  <Mail size={30} />
                  <h2>Email Us</h2>
                  <a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a>
                </div>

                <div className="ig-contact-info-card">
                  <Phone size={30} />
                  <h2>Contact Us</h2>
                  <a href={phoneHref(settings.supportPhone)}>{settings.supportPhone}</a>
                </div>

                {settings.address ? (
                  <div className="ig-contact-info-card">
                    <MapPin size={30} />
                    <h2>Visit Us</h2>
                    <span>{settings.address}</span>
                  </div>
                ) : null}
              </div>

              <div className="ig-contact-map">
                <iframe
                  title="InsaneGenix support location map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address || "New Delhi, Delhi")}&z=10&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <form className="ig-contact-form" onSubmit={submitContact}>
              <div className="ig-contact-field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" placeholder="lawson Dowson" required />
              </div>

              <div className="ig-contact-field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" placeholder="supex@example.com" required />
              </div>

              <div className="ig-contact-field">
                <label htmlFor="contact-phone">Phone</label>
                <input id="contact-phone" name="phone" type="tel" />
              </div>

              <div className="ig-contact-field">
                <label htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" name="subject" type="text" />
              </div>

              <div className="ig-contact-field ig-contact-field-full">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Simultaneously we had a problem"
                  rows={6}
                  required
                />
              </div>

              {message ? (
                <p className={`ig-contact-feedback ${status === "success" ? "is-success" : "is-error"}`}>
                  {message}
                </p>
              ) : null}

              <label className="ig-contact-save">
                <input type="checkbox" name="remember" />
                <span>Save my name, email, and website in this browser for the next time I comment.</span>
              </label>

              <button type="submit" className="ig-contact-submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
