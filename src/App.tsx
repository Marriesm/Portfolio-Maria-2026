import { useLayoutEffect, useRef, useState } from "react";
import { CommandPalette } from "./components/CommandPalette/CommandPalette";
import { Contact } from "./components/Contact/Contact";
import { Education } from "./components/Education/Education";
import { Footer } from "./components/Footer/Footer";
import { Guide } from "./components/Guide/Guide";
import { Hero } from "./components/Hero/Hero";
import { Hud } from "./components/Hud/Hud";
import { Journey } from "./components/Journey/Journey";
import { Nav } from "./components/Nav/Nav";
import { Projects } from "./components/Projects/Projects";
import { Skills } from "./components/Skills/Skills";
import { useToast } from "./components/Toast/Toast";
import { Universe3D } from "./components/Universe3D/Universe3D";
import { profile, type Command, type Palette } from "./data/portfolio";
import { useActiveSector } from "./hooks/useActiveSector";
import { prefersReducedMotion, store } from "./lib/dom";

const readPalette = (): Palette => {
  const p = store.get("neon");
  return p === "fucsia" || p === "roxo" ? p : "";
};

export function App() {
  const toast = useToast();
  const [palette, setPaletteState] = useState<Palette>(readPalette);
  const [classic, setClassicState] = useState(() => store.get("classic") === "1");
  const [guideHidden, setGuideHidden] = useState(() => store.get("guide") === "off");
  const [commandsOpen, setCommandsOpen] = useState(false);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const active = useActiveSector();

  // paleta e modo vivem no <html>, onde as variáveis CSS são trocadas
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (palette) root.dataset.palette = palette;
    else delete root.dataset.palette;
    root.classList.toggle("classic", classic);
  }, [palette, classic]);

  const setPalette = (p: Palette) => {
    setPaletteState(p);
    store.set("neon", p);
  };

  const toggleClassic = () => {
    const on = !classic;
    setClassicState(on);
    store.set("classic", on ? "1" : "");
    toast(on ? "Modo recrutador: versão limpa, sem 3D" : "Modo imersivo ativado");
  };

  const hideGuide = () => {
    setGuideHidden(true);
    store.set("guide", "off");
    toast("Avatar escondido. Use Ctrl+K para mostrar de novo.");
  };

  const runCommand = ({ action }: Command) => {
    switch (action.type) {
      case "goto":
        document.getElementById(action.target)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
        break;
      case "copyEmail":
        if (navigator.clipboard) navigator.clipboard.writeText(profile.email).then(() => toast("E-mail copiado"), () => toast(profile.email));
        else toast(profile.email);
        break;
      case "downloadResume": {
        const link = document.createElement("a");
        link.href = profile.resume.href;
        link.download = profile.resume.fileName;
        link.click();
        toast("Baixando o currículo…");
        break;
      }
      case "toggleClassic":
        toggleClassic();
        break;
      case "showGuide":
        setGuideHidden(false);
        store.set("guide", "");
        break;
      case "palette":
        setPalette(action.palette);
        break;
    }
  };

  return (
    <>
      <Universe3D palette={palette} classic={classic} readoutRef={readoutRef} />
      <Nav
        palette={palette}
        classic={classic}
        onPalette={setPalette}
        onToggleClassic={toggleClassic}
        onOpenCommands={() => setCommandsOpen(true)}
      />
      <Hud active={active} readoutRef={readoutRef} />
      <main>
        <Hero classic={classic} onToggleClassic={toggleClassic} />
        <Skills />
        <Projects />
        <Journey />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Guide active={active} hidden={guideHidden} onHide={hideGuide} />
      <CommandPalette open={commandsOpen} onOpenChange={setCommandsOpen} onRun={runCommand} />
    </>
  );
}
