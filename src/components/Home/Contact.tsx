import { useTranslations } from "../../i18n/utils";
import { useState } from "react";
import type { FormEvent } from "react";

interface Props {
  lang: "en" | "es";
}

export default function Contact({lang}: Props) {
  const t = useTranslations(lang);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      
      const data: {
        success: boolean;
        message: string;
      } = await response.json();
      
      if (data.success) {
        setResponseMessage(t("section.contact.form.success"));
        (event.target as HTMLFormElement).reset(); 
      } else {
        setResponseMessage(t("section.contact.form.error"));
      }
    } catch (error) {
      setResponseMessage(t("section.contact.form.error"));
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
        <button className="p-3 border rounded-2xl hover:text-white hover:bg-amber-900 ease-in-out transition-colors duration-300">
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
                  stroke-width="4"></circle>
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
          className="text-lg text-center mt-5 p-3 border border-gray-300 rounded-lg"
        >
          {responseMessage}
        </p>
      )}
    </section>
  )
}
