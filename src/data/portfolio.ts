/**
 * Todo o conteúdo do portfólio fica aqui. Edite os textos neste arquivo;
 * os componentes só cuidam da aparência.
 */

/** Cor de destaque usada por um item (mapeia para as variáveis CSS). */
export type Tone = "signal" | "pink" | "data";

export type Palette = "" | "fucsia" | "roxo";

export interface Capability {
  tone: Tone;
  title: string;
  text: string;
}

export interface SkillArea {
  code: string;
  title: string;
  tags: string[];
  /** cor da área no layout */
  tone: Tone;
  /** ocupa duas colunas */
  wide?: boolean;
  /** destaque especial (borda em degradê) */
  featured?: boolean;
  /** frase curta que aparece no card em destaque */
  note?: string;
}

export interface ProjectStat {
  value: string;
  label: string;
}

export interface Project {
  /**
   * Liga o projeto às imagens em src/assets/projetos/: "farol-1.png", "farol-2.png"…
   * aparecem sozinhas na galeria do projeto, na ordem do número.
   */
  slug: string;
  /** texto da barra de endereço da janelinha da galeria */
  mediaLabel?: string;
  /** legendas das imagens, na mesma ordem (opcional) */
  captions?: string[];
  meta: string;
  kind: string;
  title: string;
  description: string;
  /** mostra o bloco do farol (crítico/atenção/saudável) com estes critérios */
  farolCriteria?: string[];
  /** repositórios no GitHub (projetos pessoais) */
  repos?: { label: string; href: string }[];
  /** site publicado */
  live?: string;
  /** chips de destaque que acendem em cascata no hover */
  highlights?: string[];
  stats?: ProjectStat[];
}

export interface Experience {
  when: string;
  role: string;
  org: string;
  bullets: string[];
}

export interface PlatformArea {
  area: string;
  tone: Tone;
  /** slugs dos projetos (módulos) desta área */
  modules: string[];
}

export interface Course {
  name: string;
  detail: string;
}

export interface SoftSkill {
  title: string;
  text: string;
}

/** Setores na ordem da página (o índice é o número do setor). */
export const sectors = [
  { id: "s0", label: "Início" },
  { id: "s1", label: "Skills" },
  { id: "s2", label: "Projetos" },
  { id: "s3", label: "Experiência" },
  { id: "s4", label: "Formação" },
  { id: "s5", label: "Contato" },
] as const;

export type SectorId = (typeof sectors)[number]["id"];

export const palettes: { value: Palette; color: string; label: string }[] = [
  { value: "", color: "#39FF9F", label: "Verde neon" },
  { value: "fucsia", color: "#FF2BD6", label: "Fúcsia" },
  { value: "roxo", color: "#C77DFF", label: "Roxo" },
];

export const profile = {
  name: "Maria Eduarda Soares Moreira",
  markFirst: "maria",
  markSecond: ".eduarda",
  role: "Software Engineer · Full Stack · AI Engineer",
  nowAtRole: "Analista de Telemetria em TI",
  nowAtCompany: "Poli Digital",
  city: "Goiânia - GO",
  /** legenda embaixo da foto no topo */
  portraitCaption: "disponível para novos projetos",
  email: "ms-eduardasoares@outlook.com",
  whatsapp: "(62) 98278-1169",
  /** número só com dígitos, com DDI 55, para o link wa.me */
  whatsappNumber: "5562982781169",
  whatsappGreeting: "Oi, Maria Eduarda! Vi seu portfólio e queria conversar.",
  /** seu @ do Instagram, sem o "@"; vazio esconde o botão */
  instagram: "",
  linkedin: "https://www.linkedin.com/in/marriesoares",
  github: "https://github.com/Marriesm",
  /** PDF em public/; troque o arquivo para atualizar o currículo */
  resume: {
    href: "/curriculo-maria-eduarda.pdf",
    fileName: "Curriculo-Maria-Eduarda-Soares-Moreira.pdf",
  },
};

export const intro = {
  /** mensagens que se alternam no selo "sistema online" */
  typed: [
    "sistema online",
    "analista de telemetria em TI @ Poli Digital",
    "ai engineer · llms, rag e agentes",
    "python · java · spring boot · react · typescript",
    "health score · churn · onboarding · cobrança",
    "análise de reuniões com IA",
    "eng. de software · 6º semestre",
    "goiânia · GO",
  ],
  leadBefore: "Desenvolvo software de ponta a ponta, do ",
  leadStrong: "back-end e dados às interfaces e à IA",
  leadAfter: ". Transformo processos manuais em produtos escaláveis, integro sistemas por APIs e coloco LLMs, RAG e agentes para trabalhar a favor do negócio.",
  capabilities: [
    { tone: "signal", title: "Engine e APIs", text: "Python, Java, Spring Boot, Node.js" },
    { tone: "pink", title: "Telas", text: "React, Next.js, TypeScript, shadcn/ui" },
    { tone: "data", title: "Dados", text: "PostgreSQL, medalhão, health score" },
    { tone: "signal", title: "IA e automação", text: "LLMs, RAG, agentes no n8n" },
  ] satisfies Capability[],
  scrollCue: "role para viajar pela cidade",
};

export const skills = {
  title: "Competências técnicas",
  text: "Foco em código testado, versionado e fácil de manter, do banco de dados à tela.",
  areas: [
    { code: "@RestController", title: "Back-end", tone: "signal", tags: ["Python", "FastAPI", "Java", "Spring Boot", "Spring Data JPA", "Node.js", "APIs REST", "Webhooks", "JWT / OAuth 2.0", "Microsserviços"] },
    { code: "<Component />", title: "Front-end", tone: "pink", tags: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "shadcn/ui", "Radix UI", "Vite", "HTML5", "CSS3", "SPA"] },
    { code: "CREATE TABLE", title: "Banco de dados", tone: "data", tags: ["PostgreSQL", "Supabase", "MySQL", "Oracle", "SQLite", "Redis", "pgvector", "Alembic", "Seeds", "ORM (SQLAlchemy / JPA)"] },
    {
      code: "SELECT insight",
      tone: "signal",
      title: "Dados",
      tags: ["SQL analítico", "Modelagem", "ETL", "Medalhão (bronze/silver/gold)", "Snapshots e backfill", "KPIs", "Health score", "pandas", "Metabase", ".xlsx"],
    },
    {
      code: "model.predict()",
      tone: "pink",
      wide: true,
      featured: true,
      note: "IA aplicada à operação: agentes de atendimento, roteiros gerados por IA, co-piloto em reunião e avaliação automática de transcrições.",
      title: "IA e automação",
      tags: [
        "LLMs",
        "Gemini",
        "RAG",
        "Embeddings",
        "Busca vetorial",
        "Function calling",
        "LLM-as-a-judge",
        "Engenharia de prompts",
        "Roteiros gerados por IA",
        "Avaliação de reuniões por IA",
        "Classificação com IA",
        "Co-piloto em reunião",
        "Transcrição com IA",
        "Machine learning",
        "n8n",
        "HubSpot",
        "RD Station",
        "Pipe.run",
      ],
    },
    { code: "on: webhook", title: "Integrações", tone: "data", tags: ["API de sistema financeiro", "HubSpot", "Jira", "Google Calendar", "Meet", "Chat", "OAuth 2.0", "Filas e retry"] },
    {
      code: "design.solution()",
      tone: "pink",
      title: "Arquitetura de soluções",
      wide: true,
      tags: ["Levantamento de requisitos", "Desenho de soluções ponta a ponta", "Integração entre sistemas", "APIs e webhooks", "Arquitetura orientada a eventos", "Modelagem de dados", "Escalabilidade e custo", "Segurança e LGPD", "Diagramas C4", "Decisões técnicas documentadas (ADR)"],
    },
    {
      code: "docker compose up",
      tone: "pink",
      title: "DevOps e cloud",
      tags: ["Docker", "Docker Compose", "CI/CD", "GitHub Actions", "Linux", "Bash", "Vercel", "Variáveis de ambiente", "Logs e monitoramento"],
    },
    {
      code: "assert ok",
      tone: "signal",
      title: "Boas práticas",
      wide: true,
      tags: ["pytest", "TDD", "Clean Code", "SOLID", "Git e GitHub", "Pull requests", "Code review", "Commits semânticos", "Injeção de dependência", "Idempotência e retry", "Migrações versionadas", "Scrum / Kanban", "Documentação técnica"],
    },
  ] satisfies SkillArea[],
};

export const projects = {
  title: "Projetos",
  /** card central com o carrossel de telas */
  galleryLabel: "Setor 02 · Telas dos projetos",
  galleryTitle: "Por dentro das telas",
  text: "Plataforma de operação que construí de ponta a ponta (engine, API e telas) para várias áreas de uma empresa de software. Os projetos profissionais aparecem como módulos, descritos pelo resultado e pela tecnologia, com telas de demonstração redesenhadas e dados fictícios. No fim, projetos pessoais: um e-commerce, dois SaaS, meu primeiro portfólio e um projeto em Java.",
  /** mapa da plataforma: áreas atendidas e os módulos (slugs dos projetos) de cada uma */
  platform: {
    label: "Uma plataforma · várias áreas",
    areas: [
      { area: "Onboarding", tone: "signal", modules: ["ativacao", "onboarding"] },
      { area: "Sucesso do cliente", tone: "pink", modules: ["farol", "reunioes-ia"] },
      { area: "Financeiro", tone: "data", modules: ["cobranca"] },
      { area: "Atendimento", tone: "signal", modules: ["ia-atendimento"] },
      { area: "Dados e analytics", tone: "pink", modules: ["dados-historicos"] },
    ] satisfies PlatformArea[],
  },
  items: [
    {
      slug: "ativacao",
      mediaLabel: "demo · quadro de acompanhamento",
      captions: [
        "Quadro de acompanhamento: clientes por etapa, com alerta de quem está sem resposta (dados fictícios)",
        "Roteiro gerado por IA a partir do perfil e do objetivo do cliente (dados fictícios)",
        "Modo reunião: o co-piloto mostra o que falar e perguntar, item a item (dados fictícios)",
        "Avaliação por IA: nota por item com peso e trecho que comprova (dados fictícios)",
      ],
      meta: "IA · Onboarding",
      kind: "Onboarding com IA",
      title: "Onboarding guiado por IA",
      description:
        "Quadro que acompanha cada cliente do início ao uso pleno do produto. A IA classifica o perfil do cliente e gera o roteiro de cada reunião sob medida; durante a chamada, um co-piloto mostra o que falar e perguntar. Resultado: reuniões mais padronizadas e clientes parados identificados automaticamente.",
      highlights: ["LLM", "classificação por IA", "roteiros gerados por IA", "co-piloto em tempo real", "alertas automáticos", "React + TypeScript"],
    },
    {
      slug: "farol",
      mediaLabel: "demo · health score",
      meta: "Dados · Retenção",
      kind: "Health score",
      title: "Health score de clientes",
      description:
        "Score automático que classifica cada cliente em saudável, atenção ou crítico, combinando sinais de vários sistemas. Resultado: o risco de cancelamento aparece antes, com o motivo de cada classificação.",
      farolCriteria: ["sinais financeiros", "engajamento", "uso do produto", "chamados abertos"],
    },
    {
      slug: "dados-historicos",
      captions: ["Saúde da base dia a dia, com backfill, e para onde os clientes foram (dados fictícios)"],
      mediaLabel: "demo · série histórica",
      meta: "Dados · Modelagem",
      kind: "Série histórica",
      title: "Histórico e análise de retenção",
      description:
        "Camada de dados com foto diária, backfill retroativo e matriz de transição entre estados. Resultado: KPIs de retenção confiáveis ao longo do tempo e ranking dos motivos de cada mudança.",
      highlights: ["PostgreSQL", "SQL analítico", "snapshots diários", "backfill", "matriz de transição", "KPIs"],
    },
    {
      slug: "onboarding",
      mediaLabel: "demo · agendamento",
      captions: ["Agendamento em 3 passos: dia, horário livre e convite com título padronizado (dados fictícios)"],
      meta: "Integrações · Agenda",
      kind: "Agendamento",
      title: "Agendamento integrado ao Google Calendar",
      description:
        "Agendamento de reuniões direto na agenda da equipe: mostra só os horários livres, cria o evento com título padronizado, link de videochamada e convite por e-mail, e permite remarcar em um clique. Resultado: menos idas e vindas para marcar e agenda sempre organizada.",
      highlights: ["Google Calendar API", "OAuth 2.0", "Meet", "padronização de eventos", "remarcação"],
    },
    {
      slug: "reunioes-ia",
      mediaLabel: "demo · avaliação de reuniões",
      captions: ["Avaliação por IA: nota da reunião e cada item com peso e o trecho que comprova (dados fictícios)"],
      meta: "IA · Qualidade",
      kind: "Avaliação por IA",
      title: "Avaliação de reuniões com IA",
      description:
        "Cada reunião gravada vira transcrição e um LLM confere o roteiro item a item: o que foi tratado e o trecho que comprova. Os itens têm peso, formam uma nota e o que faltou volta na próxima reunião; um gestor pode pedir reavaliação. Resultado: qualidade das reuniões medida de forma consistente.",
      highlights: ["LLM-as-a-judge", "transcrição", "nota ponderada", "reavaliação", "bronze → silver → gold", "auditoria"],
    },
    {
      slug: "cobranca",
      mediaLabel: "demo · automação de cobrança",
      captions: ["Lembretes automáticos: linha do tempo D-3 → D+2 → pago e os envios do dia (dados fictícios)"],
      meta: "Automação · Financeiro",
      kind: "Cobrança",
      title: "Automação de cobrança",
      description:
        "Motor de envios diários por etapa (antes, no dia e depois do vencimento), com modos de teste e produção e relatório mensal em .xlsx. Resultado: lembretes no tempo certo sem trabalho manual.",
      highlights: ["Python", "agendamento diário", "modo teste/produção", "idempotência", ".xlsx"],
    },
    {
      slug: "ia-atendimento",
      mediaLabel: "demo · fluxo de atendimento",
      captions: ["Atendimento com IA: a conversa e, ao lado, cada passo do agente (dados fictícios)"],
      meta: "IA · Automação",
      kind: "Atendimento",
      title: "Agente de IA para atendimento (n8n)",
      description:
        "Agente que responde clientes no chat: recebe a mensagem por webhook, classifica a intenção com um LLM, busca o contexto via RAG e responde dentro de guardrails; quando precisa, passa para uma pessoa com prioridade. Resultado: respostas mais rápidas e equipe focada no que exige humano.",
      highlights: ["n8n", "webhooks", "LLM", "RAG", "guardrails", "handoff para humano"],
    },
    {
      slug: "maria-lu",
      mediaLabel: "marialu / loja de atacado",
      captions: ["Página inicial da loja: regras de atacado, desconto progressivo, Pix com desconto e catálogo"],
      meta: "E-commerce · Projeto pessoal",
      kind: "E-commerce",
      title: "Maria Lu Plus Size: e-commerce de atacado",
      description:
        "Loja virtual de atacado de moda plus size, do catálogo ao pagamento: busca, categorias e estoque, quantidade por cor com total na hora, pedido mínimo e desconto progressivo. A cotação calcula o frete por CEP (tabela própria, Melhor Envio ou Frenet) e gera PDF e mensagem para o WhatsApp; o checkout aceita Pix com QR Code e cartão ou boleto pelo Mercado Pago, com webhook de confirmação. Inclui painel da lojista protegido por senha.",
      highlights: ["Next.js 15", "TypeScript", "Tailwind CSS 4", "Pix com QR Code", "Mercado Pago + webhook", "Frete por CEP (Melhor Envio / Frenet)", "Supabase", "Painel administrativo"],
    },
    {
      slug: "odonto-pro",
      mediaLabel: "odontopro / agendamentos",
      captions: ["Página pública da clínica com agendamento online e o painel de agendamentos (clínica e pacientes fictícios)"],
      meta: "SaaS · Projeto pessoal",
      kind: "Full stack",
      title: "OdontoPro: SaaS de agendamento para clínicas",
      description:
        "Plataforma completa, publicada na Vercel, para clínicas odontológicas: cada clínica tem uma página pública onde o paciente escolhe o serviço e um horário livre. No painel, a clínica gerencia agendamentos, lembretes, serviços e perfil, e assina um plano pago com Stripe (checkout e webhooks). Login com NextAuth e dados em PostgreSQL via Prisma.",
      highlights: ["Next.js 16", "React 19", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Stripe + webhooks", "React Query", "Zod", "Tailwind", "Vercel"],
      live: "https://odonto-pro-nine.vercel.app",
      repos: [{ label: "Odonto-pro", href: "https://github.com/Marriesm/Odonto-pro" }],
    },
    {
      slug: "alucre",
      mediaLabel: "alucre / cartões e faturas",
      captions: ["Controle de cartões: limite, fatura atual, gastos por categoria e histórico de faturas (dados fictícios)"],
      meta: "SaaS · Projeto pessoal",
      kind: "Finanças",
      title: "Alucre: gestão financeira pessoal e do negócio",
      description:
        "App para quem vende e precisa separar o dinheiro do negócio do pessoal: painel de lucro, vendas com simulador, estoque com alertas e produtos mais vendidos, gastos pessoais e controle de cartões de crédito com faturas, parcelas futuras, linha do tempo e gastos por categoria. Login e dados no Supabase, com regras de negócio em funções SQL (RPC) e migrações versionadas.",
      highlights: ["Next.js 16", "React 19", "TypeScript", "Supabase", "PostgreSQL + RPC", "Zustand", "Recharts", "shadcn/ui", "Tailwind"],
    },
    {
      slug: "portfolio-v1",
      mediaLabel: "my-portfolio / início",
      captions: ["Meu primeiro portfólio: órbita de tecnologias em volta da foto, download dos currículos e formulário com EmailJS"],
      meta: "Front-end · Projeto pessoal",
      kind: "Portfólio 1.0",
      title: "Meu primeiro portfólio (versão 1.0)",
      description:
        "A primeira versão do meu portfólio, publicada na Vercel: SPA em React com TypeScript e Vite, estilos em SCSS Modules, animações de entrada e órbita de tecnologias, texto digitando, seções de ferramentas, skills, projetos e certificados, download dos currículos dev e dados, e formulário de contato e orçamento que envia e-mail pelo EmailJS.",
      highlights: ["React 19", "TypeScript", "Vite", "SCSS Modules", "AOS e animações", "EmailJS", "Responsivo", "Vercel"],
      live: "https://my-portf-lio-snowy.vercel.app",
      repos: [{ label: "my-portfolio", href: "https://github.com/Marriesm/my-portfolio" }],
    },
    {
      slug: "screenmatch",
      mediaLabel: "github / Marriesm / screenmatch",
      captions: ["Screenmatch: Streams e lambdas sobre os dados da API, com estatísticas por temporada (série de exemplo)"],
      meta: "Java · Projeto pessoal",
      kind: "Java + Spring",
      title: "Screenmatch: séries com Java e Spring Boot",
      description:
        "Aplicação em Java 17 com Spring Boot e Maven que consome uma API externa de filmes e séries, converte o JSON com Jackson e processa temporadas e episódios com Streams e lambdas: top 5 por avaliação, busca por trecho do título e estatísticas por temporada. A primeira versão, em Java puro, trabalha orientação a objetos com herança, interfaces e exceções próprias.",
      highlights: ["Java 17", "Spring Boot 3.5", "Maven", "Jackson", "Streams e lambdas", "API REST externa", "POO: herança e interfaces", "Exceções personalizadas"],
      repos: [
        { label: "screenmatch-spring-maven", href: "https://github.com/Marriesm/screenmatch-spring-maven" },
        { label: "screenmatch", href: "https://github.com/Marriesm/screenmatch" },
      ],
    },
  ] satisfies Project[] as Project[],
};

export const experience = {
  title: "Onde eu já entreguei",
  items: [
    {
      when: "jun 2026 — atual",
      role: "Analista de Telemetria em TI",
      org: "Poli Digital",
      bullets: [
        "Criei e desenvolvo de ponta a ponta (engine, API e telas) o software de operação usado por todas as áreas da empresa: onboarding, Customer Success, atendimento, financeiro e dados.",
        "Analiso os dados da operação e os transformo em relatórios de desempenho por equipe, carteira e atendimento, com KPIs, metas e tendências para a gestão.",
        "Monitoro indicadores como SLA, tempo de resposta, engajamento e uso do produto, com alertas automáticos quando algo sai do esperado.",
        "Criei o health score das carteiras e modelei a camada de dados histórica de churn, com snapshots diários e backfill.",
        "Desenvolvi soluções de IA para a operação: agentes de atendimento, roteiros gerados por IA e avaliação automática de reuniões.",
        "Construí automações de agendamento, cobrança e acompanhamento de clientes, integradas por APIs.",
        "Integrei sistema financeiro, CRM, Jira, Google Workspace e as plataformas de atendimento por APIs, webhooks e n8n; criei a IA de atendimento no n8n; mantenho migrações com Alembic, seeds e deploy.",
      ],
    },
    {
      when: "ago 2025 — jun 2026",
      role: "Estagiária de Automação",
      org: "Poli Digital",
      bullets: [
        "Automações de fluxos comerciais e operacionais com n8n, RD Station, HubSpot e Pipe.run.",
        "Efetivada como Analista de Telemetria em TI após 10 meses de estágio.",
      ],
    },
    {
      when: "2022 — 2024",
      role: "Proprietária",
      org: "Negócio próprio",
      bullets: ["Gestão completa do negócio, landing pages (HTML, Tailwind e React) e dashboard de vendas."],
    },
  ] satisfies Experience[],
};

export const education = {
  title: "Formação, cursos e soft skills",
  degree: {
    title: "Engenharia de Software",
    org: "Anhanguera · bacharelado · 6º semestre",
    when: "2024 — 2027",
    semester: 6,
    totalSemesters: 8,
    conclusion: "2027",
  },
  courses: [
    { name: "Java — Orientação a Objetos", detail: "Alura · 2025" },
    { name: "React com TypeScript", detail: "Alura · 2025" },
    { name: "SQL — funções de data", detail: "Alura · 2025" },
  ] satisfies Course[],
  languages: [
    { name: "Português", detail: "nativo" },
    { name: "Inglês técnico", detail: "leitura de documentação" },
  ] satisfies Course[],
  softSkills: [
    { title: "Visão de negócio", text: "Software pensado para churn, cobrança e retenção." },
    { title: "Ponta a ponta", text: "Da engine e API até as telas que a operação usa." },
    { title: "Rigor", text: "Simular antes de gravar, testar e auditar." },
    { title: "Trabalho em equipe", text: "Pull requests, revisão de código e documentação." },
    { title: "Empreendedorismo", text: "Gestão completa de um negócio próprio de 2022 a 2024." },
    { title: "Aprendizado contínuo", text: "Faculdade e cursos enquanto trabalho em tempo integral." },
  ] satisfies SoftSkill[],
};

export const contact = {
  title: "Fim da viagem. Vamos conversar?",
  text: "Goiânia - GO. Aberta a conversar sobre desenvolvimento full stack, dados, integrações e automação.",
};

export const footer = {
  left: "© 2026 Maria Eduarda Soares Moreira",
  right: "// modo imersivo v1.0 · three.js · Ctrl+K para comandos",
};

/** Falas do guia por setor: a primeira aparece ao chegar, as outras ao clicar no avatar. */
export const guideLines: string[][] = [
  ["Oi! Eu sou a Maria Eduarda ✦ Role a página que eu te levo pela minha cidade neon.", "Dica: aperte Ctrl+K pra pular direto pra qualquer lugar."],
  ["Essas torres são a minha stack: back-end, front-end, dados e IA com automação.", "Python, Java, Spring Boot, React, TypeScript e PostgreSQL no dia a dia."],
  [
    "Esse farol gigante é um health score: vermelho = cliente em risco!",
    "Tem IA em vários módulos: agente de atendimento, roteiros e avaliação de reuniões.",
  ],
  ["Cada arco é um ano da minha trajetória: 2022, 2024, 2025 e 2026.", "Fui efetivada como Analista de Telemetria depois de 10 meses de estágio."],
  ["Aqui fica minha formação: Engenharia de Software na Anhanguera, 6º semestre, cursos e idiomas.", "Faltam só dois semestres pra formatura! 🎓"],
  ["Chegamos! Copia meu e-mail ou me chama no WhatsApp.", "Gostou da viagem? O Byte também. au au! 🐾"],
];

/** Falas do Byte, o cachorrinho. */
export const byteLines = ["au au! 🐾", "*abana o rabo* bora ver os projetos?", "achei um bug… e enterrei no quintal 🦴"];

export type CommandAction =
  | { type: "goto"; target: SectorId }
  | { type: "copyEmail" }
  | { type: "downloadResume" }
  | { type: "toggleClassic" }
  | { type: "showGuide" }
  | { type: "palette"; palette: Palette };

export interface Command {
  label: string;
  group: string;
  action: CommandAction;
}

export const commands: Command[] = [
  { label: "Ir para Início", group: "navegar", action: { type: "goto", target: "s0" } },
  { label: "Ir para Skills", group: "navegar", action: { type: "goto", target: "s1" } },
  { label: "Ir para Projetos", group: "navegar", action: { type: "goto", target: "s2" } },
  { label: "Ver health score e churn", group: "projeto", action: { type: "goto", target: "s2" } },
  { label: "Ver o onboarding com IA", group: "projeto", action: { type: "goto", target: "s2" } },
  { label: "Ir para Experiência", group: "navegar", action: { type: "goto", target: "s3" } },
  { label: "Ir para Formação", group: "navegar", action: { type: "goto", target: "s4" } },
  { label: "Ver cursos e soft skills", group: "formação", action: { type: "goto", target: "s4" } },
  { label: "Ir para Contato", group: "navegar", action: { type: "goto", target: "s5" } },
  { label: "Copiar e-mail", group: "contato", action: { type: "copyEmail" } },
  { label: "Baixar currículo (PDF)", group: "contato", action: { type: "downloadResume" } },
  { label: "Alternar modo recrutador", group: "visual", action: { type: "toggleClassic" } },
  { label: "Mostrar avatar e dicas", group: "guia", action: { type: "showGuide" } },
  { label: "Paleta verde neon", group: "visual", action: { type: "palette", palette: "" } },
  { label: "Paleta fúcsia", group: "visual", action: { type: "palette", palette: "fucsia" } },
  { label: "Paleta roxa", group: "visual", action: { type: "palette", palette: "roxo" } },
];
