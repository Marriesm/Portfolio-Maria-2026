/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** IDs do EmailJS (formulário de contato), definidos em .env.local e na Vercel */
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
