# Portfólio · Maria Eduarda (modo imersivo)

Portfólio em React + TypeScript + Vite. A rolagem leva a câmera por uma cidade neon em 3D
(three.js r128) com seis estações: Início, Skills, Projetos, Experiência, Formação e Contato.
O botão **Modo recrutador** troca para uma versão clara e limpa, sem 3D.

## Como rodar

Precisa do [Node.js](https://nodejs.org) 18 ou mais recente.

```bash
npm install      # instala as dependências
npm run dev      # abre em http://localhost:5173
```

Outros comandos:

```bash
npm run build    # checa o TypeScript e gera a versão final em dist/
npm run preview  # serve a pasta dist/ para conferir o build
```

## Como editar o conteúdo

Todos os textos ficam em **[src/data/portfolio.ts](src/data/portfolio.ts)**. Os componentes só cuidam da aparência.

| O que mudar | Onde, em `portfolio.ts` |
| --- | --- |
| Nome, cargo, e-mail, WhatsApp, LinkedIn, GitHub | `profile` |
| Número do WhatsApp (link wa.me) e mensagem inicial | `profile.whatsappNumber`, `profile.whatsappGreeting` |
| Instagram (o botão só aparece quando preenchido) | `profile.instagram`, sem o `@` |
| Legenda da foto ("maria.exe · online") | `profile.portraitCaption` |
| Arquivo e nome do currículo para download | `profile.resume` |
| Mensagens que se alternam no selo "sistema online" | `intro.typed` |
| Texto de abertura e os 4 cartões do topo | `intro` |
| Áreas e tecnologias | `skills.areas` (`wide: true` ocupa a linha toda) |
| Projetos | `projects.items` (`farolCriteria` mostra o bloco do farol, `stats` mostra os números) |
| Experiências | `experience.items` |
| Faculdade, cursos, idiomas e soft skills | `education` (a barra de progresso usa `semester` / `totalSemesters`) |
| Falas do avatar em cada setor | `guideLines` (uma lista por setor, na ordem da página) |
| Falas do Byte, o cachorrinho | `byteLines` |
| Itens da paleta de comandos (Ctrl+K) | `commands` |

Depois de salvar, o `npm run dev` atualiza a página sozinho.

### Prints dos projetos (carrossel)

Solte as imagens em **`src/assets/projetos/`** com o nome `<slug>-<número>.png` (ex.: `farol-1.webp`,
`farol-2.png`). Elas entram sozinhas no carrossel do topo da seção Projetos, separado das descrições: painéis
em 3D que giram em perspectiva, arrastados com o dedo ou o mouse, com setas, teclado (← →) e barra de
progresso. Clicar na tela do centro abre em tela cheia. O `slug` de cada projeto está em `projects.items`, e a
lista completa de nomes fica em `src/assets/projetos/LEIA-ME.md`.

- A ordem segue a dos projetos na página e, dentro de cada um, o número do arquivo.
- No `npm run dev`, sem nenhuma imagem, aparece um quadro tracejado explicando onde soltar os prints; no site
  publicado, o carrossel só aparece quando há imagens.
- Legendas: `captions` no projeto. Texto da barra de endereço: `mediaLabel`.
- Melhor proporção: 16:10. Borre dados de clientes antes de publicar.

### Telas de demonstração (dados fictícios)

As telas do carrossel foram recriadas em HTML na pasta **`mocks/`**, só com dados fictícios: Cliente Mock,
IDs 00000, telefones 00000000000, valores R$ 0.000,00 e e-mails @empresa-mock.com. Nenhum print real de
cliente entra no site. Para mudar um texto, edite o HTML e gere os PNG de novo:

```bash
npm i -D playwright-core
node mocks/render.mjs   # usa o Edge instalado; salva em src/assets/projetos/
```

### Formulário de contato

Quem visita escreve nome, e-mail e mensagem e escolhe **Enviar por e-mail** (abre o app de e-mail dela com
assunto e texto prontos, para `profile.email`) ou **Enviar no WhatsApp** (abre a conversa com a mensagem).
Não precisa de servidor. Se um dia quiser receber as mensagens sem depender do app de e-mail de quem escreve,
dá para ligar o formulário a um serviço como Web3Forms ou Formspree.

### Foto e currículo

- **Foto:** `src/assets/maria-foto.webp` (480×600, recortada no rosto). Para trocar, substitua o arquivo
  mantendo o nome e a proporção 4:5.
- **Currículo:** `public/curriculo-maria-eduarda.pdf`, baixado pelos botões "Baixar currículo" (topo e contato)
  e pelo Ctrl+K. Para atualizar, exporte o PDF novo e substitua esse arquivo com o mesmo nome.

### Onde fica o resto

```
src/
  data/portfolio.ts        conteúdo (edite aqui)
  styles/tokens.css        cores e fontes: tema escuro, paletas e modo recrutador
  styles/global.css        regras base do documento
  components/
    Universe3D/            cena 3D (three.js) guiada pela rolagem
    Nav/ Hud/ Hero/ Skills/ Projects/ Journey/ Education/ Contact/ Footer/
    Guide/                 avatar anime + Byte, o cachorrinho (Dog.tsx)
    CommandPalette/        paleta Ctrl+K
    Toast/                 avisos rápidos
    Station/ Button/ Tags/ peças compartilhadas
  assets/mari.webp         avatar anime do guia
  assets/maria-foto.webp   foto do topo
public/curriculo-maria-eduarda.pdf   currículo para download
```

Cada componente tem o seu `*.module.css`. As cores vêm das variáveis de `tokens.css`. Para criar uma paleta
nova, copie o bloco `:root[data-palette="roxo"]` e adicione a opção em `palettes`, em `portfolio.ts`.

## Como publicar na Vercel

**Pelo site (mais fácil)**

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. A Vercel detecta o Vite sozinha (build `npm run build`, saída `dist`). Clique em **Deploy**.

A cada `git push`, o site é publicado de novo.

**Pela linha de comando**

```bash
npm i -g vercel
vercel           # primeira vez: responde às perguntas e gera uma URL de prévia
vercel --prod    # publica em produção
```

## Acessibilidade

- Foco visível em todos os elementos interativos.
- Com `prefers-reduced-motion`, as animações param e a câmera só se move com a rolagem.
- O canvas 3D é decorativo (`aria-hidden`), e todo o conteúdo existe em texto.
- A cena 3D para quando o modo recrutador está ligado ou a aba fica em segundo plano, e libera a memória ao sair.
