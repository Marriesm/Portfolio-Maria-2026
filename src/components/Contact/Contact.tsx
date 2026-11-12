import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { contact, profile } from "../../data/portfolio";
import { buttonClass } from "../Button/button";
import { Station } from "../Station/Station";
import { useToast } from "../Toast/Toast";
import styles from "./Contact.module.css";

const whatsappLink = (text: string) => `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(text)}`;

type Channel = "email" | "whatsapp";
type Status = "idle" | "sending" | "sent" | "error";

const EMAILJS = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};
const emailjsReady = Boolean(EMAILJS.service && EMAILJS.template && EMAILJS.publicKey);

export function Contact() {
  const toast = useToast();
  const mail = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // copia o e-mail; se o navegador bloquear, deixa o texto selecionado
  const copy = () => {
    const select = () => {
      if (!mail.current) return;
      const range = document.createRange();
      range.selectNodeContents(mail.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      toast("E-mail selecionado, copie com Ctrl+C");
    };
    if (navigator.clipboard) navigator.clipboard.writeText(profile.email).then(() => toast("E-mail copiado"), select);
    else select();
  };

  // sem EmailJS configurado, a mensagem sai pronta no app de e-mail de quem escreve
  const openMailApp = () => {
    const who = name.trim();
    const title = subject.trim() || `Contato pelo portfólio${who ? ` — ${who}` : ""}`;
    const body = `${message.trim()}\n\n${who}${from.trim() ? `\n${from.trim()}` : ""}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    toast("Abrindo seu e-mail com a mensagem pronta…");
  };

  const send = async (channel: Channel) => {
    const who = name.trim();
    const text = message.trim();
    if (channel === "email") {
      if (!emailjsReady) return openMailApp();
      setStatus("sending");
      try {
        // os nomes batem com as variáveis do template no EmailJS: {{name}}, {{title}}, {{email}}, {{message}}
        await emailjs.send(
          EMAILJS.service!,
          EMAILJS.template!,
          { name: who, title: subject.trim() || "Contato pelo portfólio", email: from.trim(), message: text },
          { publicKey: EMAILJS.publicKey! },
        );
        setStatus("sent");
        toast("Mensagem enviada! Eu respondo em breve ✦");
        setName("");
        setFrom("");
        setSubject("");
        setMessage("");
      } catch (err) {
        console.error("EmailJS:", err);
        setStatus("error");
        toast("Não consegui enviar agora. Tente pelo WhatsApp ou copie meu e-mail.");
      }
    } else {
      window.open(whatsappLink(`Oi, Maria Eduarda! Aqui é ${who || "alguém que viu seu portfólio"}.\n\n${text}`), "_blank", "noopener");
      toast("Abrindo o WhatsApp…");
    }
  };

  return (
    <Station id="s5" right>
      <h2>{contact.title}</h2>
      <p>{contact.text}</p>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
          void send(submitter?.value === "whatsapp" ? "whatsapp" : "email");
        }}
      >
        <label className={styles.field}>
          <span>Seu nome</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
        <label className={styles.field}>
          <span>Seu e-mail (para eu responder)</span>
          <input type="email" value={from} onChange={(e) => setFrom(e.target.value)} autoComplete="email" required />
        </label>
        <label className={`${styles.field} ${styles.wide}`}>
          <span>Assunto</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Vaga, projeto, freela…" />
        </label>
        <label className={`${styles.field} ${styles.wide}`}>
          <span>Mensagem</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            placeholder="Conta um pouco sobre a vaga ou o projeto…"
          />
        </label>
        <div className={`${styles.actions} ${styles.wide}`}>
          <button className={buttonClass("primary")} type="submit" value="email" disabled={status === "sending"}>
            {status === "sending" ? "Enviando…" : "✉ Enviar mensagem"}
          </button>
          <button className={buttonClass()} type="submit" value="whatsapp">
            Enviar no WhatsApp
          </button>
          <span className={styles.status} role="status" aria-live="polite">
            {status === "sent" && "✓ Mensagem enviada"}
            {status === "error" && "✕ Falhou: tente o WhatsApp"}
          </span>
        </div>
      </form>

      <div className={styles.copybox}>
        <code ref={mail}>{profile.email}</code>
        <button className={buttonClass()} type="button" onClick={copy}>
          Copiar
        </button>
      </div>
      <p style={{ fontFamily: "var(--f-mono)", fontSize: 14, margin: "0 0 14px" }}>
        WhatsApp:{" "}
        <a className={styles.inline} href={whatsappLink(profile.whatsappGreeting)} target="_blank" rel="noopener">
          {profile.whatsapp}
        </a>
      </p>
      <div className={styles.linksRow}>
        <a className={buttonClass("primary")} href={profile.resume.href} download={profile.resume.fileName}>
          <span aria-hidden="true">↓</span> Baixar currículo
        </a>
        <a className={buttonClass()} href={whatsappLink(profile.whatsappGreeting)} target="_blank" rel="noopener">
          WhatsApp
        </a>
        {profile.instagram && (
          <a className={buttonClass()} href={`https://www.instagram.com/${profile.instagram}`} target="_blank" rel="noopener">
            Instagram
          </a>
        )}
        <a className={buttonClass()} href={profile.linkedin} target="_blank" rel="noopener">
          LinkedIn
        </a>
        <a className={buttonClass()} href={profile.github} target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
    </Station>
  );
}
