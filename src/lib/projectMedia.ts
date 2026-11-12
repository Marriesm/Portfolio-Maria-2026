import type { Project } from "../data/portfolio";

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
  /** nome do projeto a que a tela pertence */
  project: string;
  /** texto da barra de endereço da janelinha */
  url: string;
}

/**
 * Toda imagem em src/assets/projetos/ entra no build. O nome diz de qual projeto ela é:
 * "<slug>-<número>.<ext>" (ex.: farol-1.png, farol-2.webp) ou só "<slug>.<ext>".
 */
const files = import.meta.glob<string>("../assets/projetos/*.{png,jpg,jpeg,webp,avif,gif}", {
  eager: true,
  import: "default",
});

const bySlug = new Map<string, { order: number; src: string }[]>();
for (const [path, src] of Object.entries(files)) {
  const name = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  const match = name.match(/^(.*?)(?:-(\d+))?$/);
  if (!match) continue;
  const [, slug, n] = match;
  const list = bySlug.get(slug) ?? [];
  list.push({ order: n ? Number(n) : 0, src });
  bySlug.set(slug, list);
}

export function projectImages(project: Project): ProjectImage[] {
  const list = [...(bySlug.get(project.slug) ?? [])].sort((a, b) => a.order - b.order);
  return list.map(({ src }, i) => {
    const caption = project.captions?.[i];
    return {
      src,
      caption,
      project: project.title,
      url: project.mediaLabel ?? project.slug,
      alt: caption ? `${project.title}: ${caption}` : `${project.title}, tela ${i + 1}`,
    };
  });
}

/** Todas as telas, projeto a projeto, na ordem da página. */
export const allProjectImages = (projects: Project[]) => projects.flatMap(projectImages);
