"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";

export function ContactForm() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      language === "tr"
        ? "Mesajınız gönderildi! En kısa sürede size dönüş yapacağım."
        : "Message sent! I'll get back to you soon."
    );

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5 md:space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div>
        <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-foreground">
          {language === "tr" ? "Ad Soyad" : "Name"}
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-secondary dark:bg-surface dark:border-primary/20 border border-border text-foreground placeholder:text-muted-foreground dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/50 transition-all"
          placeholder={language === "tr" ? "Adınız ve soyadınız" : "Your name"}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-foreground">
          {language === "tr" ? "E-posta" : "Email"}
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-secondary dark:bg-surface dark:border-primary/20 border border-border text-foreground placeholder:text-muted-foreground dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/50 transition-all"
          placeholder={language === "tr" ? "E-posta adresiniz" : "Your email"}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-foreground">
          {language === "tr" ? "Mesaj" : "Message"}
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-secondary dark:bg-surface dark:border-primary/20 border border-border text-foreground placeholder:text-muted-foreground dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/50 resize-none transition-all"
          placeholder={
            language === "tr"
              ? "Mesajınızı buraya yazın..."
              : "Write your message here..."
          }
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground rounded-lg hover:bg-primary/90 dark:hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg dark:shadow-xl dark:shadow-primary/20 font-medium"
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span>{language === "tr" ? "Gönderiliyor..." : "Sending..."}</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{language === "tr" ? "Gönder" : "Send"}</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
