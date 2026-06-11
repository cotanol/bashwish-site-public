"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      // Admin API is on localhost:3000
      const response = await fetch(`${API_URL}/api/public/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Network error" }));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "¡Gracias por suscribirte!" });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Error al suscribirse",
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al procesar la suscripción";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto md:mx-0 pt-2"
        onSubmit={handleSubscribe}
      >
        <input
          type="email"
          placeholder="Enter your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-black text-[#1C3658] placeholder:text-[#1C3658]/60 focus:outline-none focus:ring-2 focus:ring-[#1C3658]/20 shadow-[2px_2px_0_#000000] bg-[#fff] disabled:opacity-50"
        />

        <Button
          type="submit"
          variant="golden"
          size="golden"
          disabled={isSubmitting}
          className="text-sm md:text-base"
        >
          {isSubmitting ? "Enviando..." : "Subscribe"}
        </Button>
      </form>

      {message && (
        <p
          className={`text-sm mt-2 font-medium ${
            message.type === "success" ? "text-green-700" : "text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}
    </>
  );
}
