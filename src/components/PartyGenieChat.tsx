"use client";

// 1. Añadimos useEffect y useRef a los imports
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  venue?: {
    id: string;
    name: string;
    city: string;
    url: string;
    image: string | null;
    startingPrice: string;
    maxCapacity: number;
  };
}

export default function PartyGenieChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "You have awakened the genie. Now, detail your heart's desire: What is this perfect party you wish for? Speak, and I shall reveal the path to make it reality! ✨",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Referencia para el final del chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 3. Función para hacer scroll al fondo
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 4. Efecto que se dispara cuando cambian los mensajes, carga, o se abre el chat
  useEffect(() => {
    if (isOpen) {
      // Pequeño timeout para asegurar que el DOM se pintó (especialmente la animación de abrir)
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages, isLoading, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // El evento es opcional ahora para poder llamarlo desde onKeyDown

    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${apiUrl}/api/party-genie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          venue: data.venue,
        },
      ]);
    } catch (error) {
      console.error("Error calling Party Genie API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oh no! My magical powers encountered an issue. Please try again! ✨",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Manejador para detectar la tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Evita el salto de línea
      handleSubmit(); // Envía el formulario
    }
  };

  return (
    <>
      {/* Botón flotante del genio */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 bg-[#F8BD36] hover:bg-[#f7a600] rounded-full p-2 border-2 border-[#000000] shadow-[4px_4px_0_#000000] transition-all duration-300 hover:scale-110 hover:cursor-pointer ${
          isOpen ? "scale-0" : "scale-100"
        }`}
        aria-label="Abrir Party Genie"
      >
        <div className="relative w-16 h-16">
          <Image
            src="/party-genie.png"
            alt="Party Genie"
            width={64}
            height={64}
            className="object-contain"
          />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#1C3658] rounded-full animate-ping" />
        </div>
      </button>

      {/* Ventana de chat */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 h-[600px] flex flex-col transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <div className="bg-[#FBF2E0] border-2 border-[#000000] shadow-[6px_6px_0_#000000] rounded-lg overflow-hidden flex flex-col h-full">
          {/* Header */}
          <div className="bg-[#F8BD36] p-4 flex items-center justify-between border-b-2 border-[#000000]">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-1 border-2 border-[#1C3658]">
                <Image
                  src="/party-genie.png"
                  alt="Party Genie"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#1C3658] text-lg">
                  Party Genie
                </h3>
                <p className="text-xs text-[#1C3658]">Your magical assistant</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-[#1C3658] hover:text-[#0E2A47] transition-colors cursor-pointer"
              aria-label="Cerrar chat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body - Chat Messages */}
          <div className="p-6 bg-[#FBF2E0] flex-1 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.role === "user"
                    ? "ml-8 bg-[#1C3658] text-white"
                    : "mr-8 bg-white border-2 border-[#1C3658]"
                } rounded-lg p-4 shadow-[2px_2px_0_#1C3658]`}
              >
                {msg.role === "assistant" && (
                  <div className="flex gap-3 mb-3">
                    <div className="bg-[#F8BD36] rounded-full p-1 border border-[#1C3658] h-fit">
                      <Image
                        src="/party-genie.png"
                        alt="Party Genie"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#1C3658] text-sm leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}

                {/* Venue Card if present */}
                {msg.venue && (
                  <a
                    href={msg.venue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 p-3 bg-[#F8BD36] rounded-lg border-2 border-[#1C3658] hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-3">
                      {msg.venue.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={msg.venue.image}
                          alt={msg.venue.name}
                          className="w-20 h-20 object-cover rounded border border-[#1C3658]"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-[#1C3658] flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          {msg.venue.name}
                        </h4>
                        <p className="text-xs text-[#1C3658]/80">
                          📍 {msg.venue.city}
                        </p>
                        <p className="text-xs text-[#1C3658]/80">
                          💰 From ${msg.venue.startingPrice} | 👥 Up to{" "}
                          {msg.venue.maxCapacity} guests
                        </p>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-[#1C3658]" />
                <span className="ml-2 text-[#1C3658] text-sm">
                  The genie is thinking...
                </span>
              </div>
            )}

            {/* 6. Div invisible al final para anclar el scroll */}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario */}
          <div className="p-6 pt-4 bg-[#FBF2E0] flex-shrink-0">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown} // 7. Asignamos el evento aquí
                  placeholder="Describe your perfect party here..."
                  className="w-full px-3 py-3 border-2 border-[#1C3658] rounded-lg text-[#1C3658] placeholder:text-[#1C3658]/50 focus:outline-none focus:ring-2 focus:ring-[#F8BD36] focus:border-[#F8BD36] resize-none bg-white"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-full bg-[#1C3658] hover:bg-[#0E2A47] text-[#FBF2E0] font-semibold py-3 rounded-lg border-2 border-[#000000] shadow-[3px_3px_0_#000000] transition-all hover:shadow-[2px_2px_0_#000000] hover:translate-x-[1px] hover:translate-y-[1px] flex items-center cursor-pointer justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Consulting the genie...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-[#1C3658] px-4 py-2 border-t-2 border-[#000000] flex-shrink-0">
            <p className="text-xs text-[#FBF2E0] text-center">
              Powered by AI ✨ | DEMO Party Genie
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
