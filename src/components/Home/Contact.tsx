import { useTranslations } from "../../i18n/utils";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import emailjs from "@emailjs/browser";

interface Props {
  lang: "en" | "es";
}

// Configure EmailJS - Get these values from https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_AUTOREPLY = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID_AUTOREPLY;
const EMAILJS_TEMPLATE_ID_NOTIFICATION = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID_NOTIFICATION;
const EMAILJS_RECIPIENT_EMAIL = import.meta.env.PUBLIC_EMAILJS_RECIPIENT_EMAIL;

// At the top of Contact.tsx (temporarily for debugging)
export default function Contact({lang}: Props) {
  const t = useTranslations(lang);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    // Initialize EmailJS
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID_AUTOREPLY || !EMAILJS_TEMPLATE_ID_NOTIFICATION || !EMAILJS_PUBLIC_KEY) {
      setResponseMessage("Contact form is not configured. Please contact the site owner.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessageType("");
    
    try {
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);
      
      const userName = formData.get("name") as string;
      const userEmail = formData.get("email") as string;
      const userMessage = formData.get("message") as string;

      // Auto-reply to the user who sent the message
      const autoReplyParams = {
        to_email: userEmail,
        user_name: userName,
      };

      // Notification to the site owner
      const notificationParams = {
        to_email: EMAILJS_RECIPIENT_EMAIL,
        from_name: userName,
        from_email: userEmail,
        message: userMessage,
      };

      // Send auto-reply to user
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_AUTOREPLY,
        autoReplyParams
      );

      // Send notification to site owner
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_NOTIFICATION,
        notificationParams
      );

      setResponseMessage(t("section.contact.form.success"));
      setMessageType("success");
      formElement.reset();
    } catch (error) {
      console.error("Email sending failed:", error);
      setResponseMessage(t("section.contact.form.error"));
      setMessageType("error");
    } finally {
      setIsLoading(false); 
    }
  }

  return(
    <section
      className="item__card slide-in flex flex-col justify-center items-center gap-10 mb-10 h-lvh"
      id="contact"
    >
      <h2
        className="text-xl md:text-5xl font-medium mb-10 hover-underline-animation left"
      >
        {t("section.contact.title")}
      </h2>
      <form
        onSubmit={handleSubmit}
        id="contactForm"
        className="flex flex-col gap-10 text-lg mt-5 border border-gray-300 p-5 rounded-lg w-full"
      >
        <fieldset className="flex items-center gap-2">
          <label className="w-24" htmlFor="name">{t("section.contact.form.name")}:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="font-light w-full p-3 border border-gray-300 rounded-lg"
          />
        </fieldset>
        <fieldset className="flex items-center gap-2">
          <label className="w-24" htmlFor="email">{t("section.contact.form.email")}:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="font-light w-full p-3 border border-gray-300 rounded-lg"
          />
        </fieldset>
        <fieldset className="flex items-center gap-2">
          <label className="w-24" htmlFor="message"
            >{t("section.contact.form.message")}:</label
          >
          <textarea
            id="message"
            name="message"
            required
            className="font-light w-full p-3 border border-gray-300 rounded-lg"
          ></textarea>
        </fieldset>
        <button 
          type="submit"
          disabled={isLoading}
          className="p-3 border rounded-2xl hover:text-white hover:bg-amber-900 ease-in-out transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {
            isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-blue-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              <span>{t("section.contact.form.submit")}</span>
            )
          }
        </button>
      </form>
      {responseMessage && (
        <p
          id="responseMessage"
          className={`text-lg text-center mt-5 p-3 border rounded-lg ${
            messageType === "success"
              ? "border-green-300 bg-green-50 text-green-800"
              : "border-red-300 bg-red-50 text-red-800"
          }`}
        >
          {responseMessage}
        </p>
      )}
    </section>
  )
}
