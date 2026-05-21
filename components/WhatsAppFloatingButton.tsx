import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/254780558800"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110 z-50 whatsapp-pulse"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
