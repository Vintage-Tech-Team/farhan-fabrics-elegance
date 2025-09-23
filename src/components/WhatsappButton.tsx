import { useMemo } from "react";

type WhatsappButtonProps = {
  phoneNumber: string; // E.164 format preferred, e.g., "+923001234567"
  defaultMessage?: string;
};

const WhatsappButton = ({
  phoneNumber,
  defaultMessage,
}: WhatsappButtonProps) => {
  const href = useMemo(() => {
    const base = "https://wa.me/";
    const msg = defaultMessage
      ? `?text=${encodeURIComponent(defaultMessage)}`
      : "";
    return `${base}${phoneNumber.replace(/[^+\d]/g, "")}${msg}`;
  }, [phoneNumber, defaultMessage]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M19.11 17.06c-.29-.14-1.7-.84-1.96-.94s-.45-.14-.64.14-.73.94-.91 1.13-.34.21-.63.07a6.6 6.6 0 0 1-1.94-1.2 7.29 7.29 0 0 1-1.35-1.68c-.14-.24 0-.37.11-.5s.24-.28.36-.42a1.62 1.62 0 0 0 .24-.4.45.45 0 0 0 0-.42c0-.14-.64-1.55-.88-2.13s-.47-.5-.64-.5h-.55a1.06 1.06 0 0 0-.76.35 3.21 3.21 0 0 0-1 2.39 5.57 5.57 0 0 0 1.16 2.95 12.73 12.73 0 0 0 4.87 4.24 16.88 16.88 0 0 0 1.67.62 4 4 0 0 0 1.86.12 3 3 0 0 0 2-1.41 2.5 2.5 0 0 0 .17-1.41c-.07-.11-.27-.18-.56-.32zM16.06 4a11.94 11.94 0 0 0-10.2 18 1 1 0 0 1 .1.78L4.8 26.92a1 1 0 0 0 1.28 1.28l4.1-1.16a1 1 0 0 1 .78.1 12 12 0 1 0 5.1-23.14zm0 21.9a9.9 9.9 0 0 1-5.05-1.4 1 1 0 0 0-.77-.1l-2.39.67.67-2.38a1 1 0 0 0-.1-.77 9.92 9.92 0 1 1 18.38-4.94 10 10 0 0 1-10 9.92z"
        />
      </svg>
    </a>
  );
};

export default WhatsappButton;
