// Gera as imagens dos projetos a partir dos HTML desta pasta.
// Projetos profissionais: layouts próprios com dados fictícios, diferentes de qualquer produto real.
// Uso: npm i -D playwright-core  &&  node mocks/render.mjs
// Usa o Microsoft Edge (ou Chrome) já instalado no computador.
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const out = (name) => join(here, "../src/assets/projetos", name);
const wire = (t) => `${pathToFileURL(join(here, "wireframes.html")).href}?t=${t}`;

const MOCKS = [
  { url: wire("jornada"), out: "ativacao-1.png" },
  { url: wire("copiloto"), out: "ativacao-2.png" },
  { url: wire("historico"), out: "dados-historicos-1.png" },
  { url: wire("agenda"), out: "onboarding-1.png" },
  { url: wire("avaliacao"), out: "reunioes-ia-1.png" },
  { url: wire("cobranca"), out: "cobranca-1.png" },
  { url: wire("chat"), out: "ia-atendimento-1.png" },
  // projetos pessoais
  { url: pathToFileURL(join(here, "odonto-pro.html")).href, out: "odonto-pro-1.png" },
  { url: pathToFileURL(join(here, "alucre.html")).href, out: "alucre-1.png" },
  // maria-lu-1.png: print da loja rodando (npm run dev na pasta MARIALU_SITE)
  { url: pathToFileURL(join(here, "screenmatch.html")).href, out: "screenmatch-1.png" },
];

const browser = await chromium.launch({ channel: process.env.BROWSER ?? "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
for (const mock of MOCKS) {
  await page.goto(mock.url);
  await page.screenshot({ path: out(mock.out) });
  console.log("gerado:", mock.out);
}
await browser.close();
process.exit(0);
