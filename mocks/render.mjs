// Gera as imagens dos projetos a partir dos HTML desta pasta.
// Projetos profissionais: layouts próprios com dados fictícios, diferentes de qualquer produto real.
// Uso: npm i -D playwright-core  &&  node mocks/render.mjs
// Usa o Microsoft Edge (ou Chrome) já instalado no computador.
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const out = (name) => join(here, "../src/assets/projetos", name);
const wire = (t) => `${pathToFileURL(join(here, "wireframes.html")).href}?t=${t}`;

const MOCKS = [
  // onboarding: visual da versão antiga, com nomes genéricos
  { url: pathToFileURL(join(here, "onboarding/ativacao-quadro.html")).href, out: "ativacao-1.webp" },
  { url: pathToFileURL(join(here, "onboarding/ativacao-roteiros.html")).href, out: "ativacao-2.webp" },
  { url: pathToFileURL(join(here, "onboarding/ativacao-modo-reuniao.html")).href, out: "ativacao-3.webp" },
  { url: pathToFileURL(join(here, "onboarding/ativacao-avaliacao-ia.html")).href, out: "ativacao-4.webp" },
  { url: wire("historico"), out: "dados-historicos-1.webp" },
  { url: wire("agenda"), out: "onboarding-1.webp" },
  { url: wire("avaliacao"), out: "reunioes-ia-1.webp" },
  { url: wire("cobranca"), out: "cobranca-1.webp" },
  { url: wire("chat"), out: "ia-atendimento-1.webp" },
  // projetos pessoais
  { url: pathToFileURL(join(here, "odonto-pro.html")).href, out: "odonto-pro-1.webp" },
  { url: pathToFileURL(join(here, "alucre.html")).href, out: "alucre-1.webp" },
  // maria-lu-1.webp: print da loja rodando (npm run dev na pasta MARIALU_SITE)
  { url: pathToFileURL(join(here, "screenmatch.html")).href, out: "screenmatch-1.webp" },
];

const browser = await chromium.launch({ channel: process.env.BROWSER ?? "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
for (const mock of MOCKS) {
  await page.goto(mock.url);
  // o Chromium converte o print para WebP (bem mais leve que PNG)
  const png = (await page.screenshot()).toString("base64");
  const webp = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    c.getContext("2d").drawImage(img, 0, 0);
    return c.toDataURL("image/webp", 0.86).split(",")[1];
  }, png);
  writeFileSync(out(mock.out), Buffer.from(webp, "base64"));
  console.log("gerado:", mock.out);
}
await browser.close();
process.exit(0);
