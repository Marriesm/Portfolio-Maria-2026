import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import type { Palette } from "../../data/portfolio";
import { cssVar, prefersReducedMotion, stations } from "../../lib/dom";
import styles from "./Universe3D.module.css";

interface Universe3DProps {
  palette: Palette;
  classic: boolean;
  /** onde escrever "z … · vel …" a cada quadro */
  readoutRef: RefObject<HTMLSpanElement | null>;
}

type Role = "fg" | "signal" | "data" | "pink";
type ColoredMaterial = THREE.LineBasicMaterial | THREE.MeshBasicMaterial | THREE.PointsMaterial;

interface LabelData {
  text: string;
  role: Role;
  canvas: HTMLCanvasElement;
  texture: THREE.CanvasTexture;
}

interface World {
  recolor: () => void;
  start: () => void;
  stop: () => void;
}

const STZ = [0, -70, -140, -210, -280, -350]; // z de cada estação
const SIDE = [1, -1, 1, -1, 1, -1]; // lado onde fica o objeto (oposto ao painel)

/**
 * Mundo 3D guiado pela rolagem: uma rodovia neon com 5 estações.
 * A câmera percorre uma curva que passa por cada estação.
 */
export function Universe3D({ palette, classic, readoutRef }: Universe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const world = useRef<World | null>(null);
  const classicRef = useRef(classic);
  classicRef.current = classic;
  // sem WebGL (ou depois de erro) a cena some e fica só o fundo; o resto do site segue normal
  const [failed, setFailed] = useState(false);
  // muda quando o navegador devolve o contexto gráfico: recria a cena num canvas novo
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || failed) return;

    const reduce = prefersReducedMotion();
    const mobile = window.innerWidth < 820;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: false, powerPreference: "low-power" });
    } catch (err) {
      console.warn("Cena 3D desativada: WebGL indisponível.", err);
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(62, 1, 0.1, 400);

    const mats: ColoredMaterial[] = [];
    const M = <T extends ColoredMaterial>(m: T, role: Role): T => {
      m.userData.role = role;
      mats.push(m);
      return m;
    };
    const lineMat = (role: Role) => M(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 }), role);
    const wireMat = (role: Role) => M(new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.9 }), role);

    // chão em grade
    const gp: number[] = [];
    for (let x = -40; x <= 40; x += 4) gp.push(x, 0, 30, x, 0, -410);
    for (let z = 30; z >= -410; z -= 4) gp.push(-40, 0, z, 40, 0, z);
    const gg = new THREE.BufferGeometry();
    gg.setAttribute("position", new THREE.Float32BufferAttribute(gp, 3));
    const floor = new THREE.LineSegments(gg, lineMat("pink"));
    floor.position.y = -3;
    (floor.material as THREE.LineBasicMaterial).opacity = 0.55;
    scene.add(floor);

    // prédios ao longo da rodovia
    // todas as arestas de uma cor numa só geometria: 2 draw calls em vez de um por prédio
    const edgesA: number[] = [];
    const edgesB: number[] = [];
    const BOX_EDGES = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    for (let i = 0; i < (mobile ? 85 : 180); i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const w = 1.5 + Math.random() * 3;
      const h = 3 + Math.pow(Math.random(), 2) * 22;
      const d = 1.5 + Math.random() * 3;
      const cx = side * (14 + Math.random() * 24);
      const cz = 20 - Math.random() * 430;
      const [x0, x1, y0, y1, z0, z1] = [cx - w / 2, cx + w / 2, -3, -3 + h, cz - d / 2, cz + d / 2];
      const c = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];
      const out = i % 4 === 0 ? edgesB : edgesA;
      for (const [a, b] of BOX_EDGES) out.push(...c[a], ...c[b]);
    }
    for (const [pts, role] of [[edgesA, "data"], [edgesB, "signal"]] as const) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      scene.add(new THREE.LineSegments(g, lineMat(role)));
    }

    // poeira / dados flutuando
    const DN = mobile ? 600 : 1600;
    const dp = new Float32Array(DN * 3);
    for (let i = 0; i < DN; i++) {
      dp[i * 3] = (Math.random() - 0.5) * 80;
      dp[i * 3 + 1] = Math.random() * 30 - 3;
      dp[i * 3 + 2] = 20 - Math.random() * 430;
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
    const dust = new THREE.Points(dg, M(new THREE.PointsMaterial({ size: 0.12, transparent: true, opacity: 0.8 }), "signal"));
    scene.add(dust);

    // texto em sprite
    const labels: THREE.Sprite[] = [];
    const drawLabel = (s: THREE.Sprite) => {
      const { canvas: c, text, role, texture } = s.userData as LabelData;
      const g = c.getContext("2d");
      if (!g) return;
      g.clearRect(0, 0, c.width, c.height);
      g.font = '700 96px "Chakra Petch", sans-serif';
      g.textAlign = "center";
      g.textBaseline = "middle";
      const col = cssVar(`--${role}`) || cssVar("--fg");
      g.shadowColor = col;
      g.shadowBlur = 28;
      g.fillStyle = col;
      g.fillText(text, 512, 96);
      g.shadowBlur = 0;
      g.fillText(text, 512, 96);
      texture.needsUpdate = true;
    };
    const label = (text: string, size = 1, role: Role = "fg") => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 192;
      const texture = new THREE.CanvasTexture(c);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
      s.scale.set(10 * size, 1.875 * size, 1);
      s.userData = { text, role, canvas: c, texture } satisfies LabelData;
      labels.push(s);
      drawLabel(s);
      return s;
    };

    // Estação 0: núcleo
    const s0 = new THREE.Group();
    s0.position.set(7, 4, STZ[0] - 14);
    scene.add(s0);
    const coreA = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2, 1), wireMat("signal"));
    const coreB = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 0), wireMat("pink"));
    s0.add(coreA, coreB);
    const ring0 = new THREE.Mesh(new THREE.TorusGeometry(5, 0.04, 6, 120), wireMat("data"));
    ring0.rotation.x = 1.2;
    s0.add(ring0);

    // Estação 1: quatro monólitos
    const s1 = new THREE.Group();
    s1.position.set(-9, 0, STZ[1] - 12);
    scene.add(s1);
    const monoDefs: [string, Role][] = [
      ["BACK-END", "signal"],
      ["FRONT-END", "data"],
      ["DADOS", "pink"],
      ["IA · AUTOMAÇÃO", "signal"],
    ];
    const mono = monoDefs.map(([t, r], i) => {
      const h = 5 + i * 1.2;
      const m = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, h, 1.6)), lineMat(r));
      m.position.set((i - 1.5) * 3.4, -3 + h / 2, -i * 1.5);
      s1.add(m);
      const l = label(t, 0.42, r);
      l.position.set(m.position.x, h - 1.6, m.position.z);
      s1.add(l);
      return m;
    });

    // Estação 2: farol + jornada TTV
    const s2 = new THREE.Group();
    s2.position.set(8, 1, STZ[2] - 12);
    scene.add(s2);
    const lightDefs: [string, number][] = [
      ["#FF4D6D", 3.4],
      ["#FFC53D", 0],
      ["#2EE88E", -3.4],
    ];
    const lights = lightDefs.map(([hex, y]) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1.15, 20, 14), new THREE.MeshBasicMaterial({ color: hex, wireframe: true }));
      m.position.set(0, y + 3, 0);
      s2.add(m);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), new THREE.MeshBasicMaterial({ color: hex }));
      glow.position.copy(m.position);
      s2.add(glow);
      return { m, glow };
    });
    const pole = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.2, 11, 1.2)), lineMat("fg"));
    pole.position.set(0, 3, 0);
    s2.add(pole);
    const seg = [30, 25, 25, 20];
    const segRole: Role[] = ["signal", "data", "fg", "fg"];
    let x0 = -13;
    seg.forEach((w, i) => {
      const len = w * 0.22;
      const material = i < 2 ? M(new THREE.MeshBasicMaterial({}), segRole[i]) : wireMat("fg");
      const b = new THREE.Mesh(new THREE.BoxGeometry(len - 0.2, 0.35, 0.35), material);
      b.position.set(x0 + len / 2, -2, 2);
      x0 += len;
      s2.add(b);
    });
    const ttvL = label("ONBOARDING → ADOÇÃO", 0.45, "fg");
    ttvL.position.set(-8, -0.6, 2);
    s2.add(ttvL);
    const farolL = label("HEALTH SCORE", 0.45, "pink");
    farolL.position.set(0, 9.6, 0);
    s2.add(farolL);

    // Estação 3: portais da experiência
    const s3 = new THREE.Group();
    s3.position.set(0, 0, STZ[3] + 6);
    scene.add(s3);
    const years: [string, number][] = [
      ["2022", -0],
      ["2024", -7],
      ["2025", -14],
      ["2026", -21],
    ];
    years.forEach(([y, z], i) => {
      const a = new THREE.Mesh(new THREE.TorusGeometry(7.5, 0.08, 6, 80, Math.PI), wireMat(i % 2 ? "pink" : "data"));
      a.position.set(0, -3, z);
      s3.add(a);
      const l = label(y, 0.55, i === 3 ? "signal" : "fg");
      l.position.set(i % 2 ? -9 : 9, 3, z);
      s3.add(l);
    });

    // Estação 4: formação
    const sF = new THREE.Group();
    sF.position.set(5, 1, STZ[4] - 16);
    scene.add(sF);
    const hexDefs: [string, Role, number, number][] = [
      ["ENG. SOFTWARE", "signal", 0, 5],
      ["ALURA", "data", -4, 1],
      ["SOFT SKILLS", "pink", 4, 1],
    ];
    const hexes = hexDefs.map(([txt, r, x, y]) => {
      const g = new THREE.Group();
      g.position.set(x, y, 0);
      const h = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.4, 6), wireMat(r));
      h.rotation.x = Math.PI / 2;
      g.add(h);
      const l = label(txt, 0.38, r);
      l.position.set(0, -2.6, 0);
      g.add(l);
      sF.add(g);
      return h;
    });
    const cap = new THREE.Group();
    cap.position.set(0, 7.6, 0);
    sF.add(cap);
    const board = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 3), wireMat("fg"));
    board.rotation.y = Math.PI / 4;
    cap.add(board);
    const capBase = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.9, 8), wireMat("data"));
    capBase.position.y = -0.5;
    cap.add(capBase);

    // Estação 5: portal final
    const s4 = new THREE.Group();
    s4.position.set(-6, 3, STZ[5] - 14);
    scene.add(s4);
    const portal = [0, 1, 2].map((i) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(4 + i * 1.3, 0.06, 6, 120), wireMat((["signal", "pink", "data"] as const)[i]));
      s4.add(t);
      return t;
    });
    const hi = label("OLÁ ✦", 0.7, "signal");
    s4.add(hi);

    const recolor = () => {
      mats.forEach((m) => {
        m.color = new THREE.Color(cssVar(`--${m.userData.role as Role}`));
      });
      labels.forEach(drawLabel);
      scene.background = new THREE.Color(cssVar("--bg"));
      scene.fog = new THREE.Fog(cssVar("--bg"), 30, 110);
    };
    recolor();
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (!disposed) labels.forEach(drawLabel);
    });

    // caminho da câmera: passa por cada estação
    const camPts: THREE.Vector3[] = [];
    const lookPts: THREE.Vector3[] = [];
    STZ.forEach((z, i) => {
      camPts.push(new THREE.Vector3(-SIDE[i] * 2.5, 2.2 + Math.sin(i) * 0.8, z + 8));
      lookPts.push(new THREE.Vector3(SIDE[i] * 4, 1.5, z - 14));
    });
    camPts.push(new THREE.Vector3(0, 2, STZ[5] - 6));
    lookPts.push(new THREE.Vector3(-6, 3, STZ[5] - 14));
    const camCurve = new THREE.CatmullRomCurve3(camPts);
    const lookCurve = new THREE.CatmullRomCurve3(lookPts);

    let target = 0;
    let prog = 0;
    let mx = 0;
    let my = 0;
    let lastY = window.scrollY;
    let vel = 0;

    // posições das seções medidas só quando o layout muda, não a cada scroll
    let tops: number[] = [];
    let lastHeight = 0;
    const measure = () => {
      const sections = stations();
      tops = sections.map((s) => s.offsetTop);
      lastHeight = sections.length ? sections[sections.length - 1].offsetHeight : 0;
    };
    const layoutObserver = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    layoutObserver.observe(document.body);

    const onScroll = () => {
      if (!tops.length) return;
      const y = window.scrollY;
      const c = window.innerHeight * 0.5;
      let i = 0;
      tops.forEach((top, k) => {
        if (top <= y + c) i = k;
      });
      const top = tops[i];
      const next = tops[i + 1];
      const local = next !== undefined
        ? Math.min(1, Math.max(0, (y + c - top) / (next - top)))
        : Math.min(1, (y + c - top) / lastHeight);
      target = (i + local * 0.999) / tops.length;
      vel = Math.abs(y - lastY);
      lastY = y;
    };
    const onPointer = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    // no celular a barra de endereço muda a altura a cada rolagem: só redimensiona quando a largura muda
    // ou a altura cresce, e no máximo uma vez por quadro (evita realocar o buffer e piscar)
    let lastW = 0;
    let lastH = 0;
    let sizeFrame = 0;
    const applySize = () => {
      sizeFrame = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const widthChanged = w !== lastW;
      if (mobile && !widthChanged && h - lastH < 160) return;
      lastH = mobile && !widthChanged ? Math.max(h, lastH) : h;
      lastW = w;
      renderer.setSize(w, lastH, false);
      cam.aspect = w / lastH;
      cam.updateProjectionMatrix();
    };
    const size = () => {
      if (!sizeFrame) sizeFrame = requestAnimationFrame(applySize);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("resize", size);
    measure();
    onScroll();
    applySize();

    const look = new THREE.Vector3();
    const pos = new THREE.Vector3();
    let v = 0;
    let raf = 0;
    let tick = 0;
    // no celular a cena roda a ~30 quadros por segundo: metade do trabalho, mesma fluidez
    const skip = mobile ? 2 : 1;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (++tick % skip) return;
      const t = now / 1000;
      const sp = reduce ? 0 : 1;
      prog += (target - prog) * (reduce ? 1 : 0.14);
      v += (vel - v) * 0.1;
      vel *= 0.9;
      const u = Math.min(0.9999, (prog * STZ.length) / STZ.length);
      camCurve.getPoint(u, pos);
      lookCurve.getPoint(Math.min(1, u + 0.02), look);
      cam.position.set(pos.x + mx * 1.6, pos.y - my * 1, pos.z);
      cam.lookAt(look.x + mx * 3, look.y - my * 2, look.z);
      cam.fov = 62 + Math.min(14, v * 0.25);
      cam.updateProjectionMatrix();
      coreA.rotation.x = t * 0.3 * sp;
      coreA.rotation.y = t * 0.45 * sp;
      coreB.rotation.y = -t * sp;
      ring0.rotation.z = t * 0.4 * sp;
      mono.forEach((m, i) => (m.rotation.y = Math.sin(t * 0.6 + i) * 0.25 * sp));
      lights.forEach((l, i) => {
        const on = Math.floor(t * 0.8) % 3 === i;
        l.glow.scale.setScalar(on ? 1.25 : 0.6);
        l.m.rotation.y = t * 0.5 * sp;
      });
      hexes.forEach((h, i) => (h.rotation.z = t * (0.4 + i * 0.15) * sp));
      cap.rotation.y = t * 0.6 * sp;
      cap.position.y = 7.6 + Math.sin(t * 1.5) * 0.3 * sp;
      portal.forEach((p, i) => {
        p.rotation.x = t * (0.3 + i * 0.15) * sp;
        p.rotation.y = t * (0.2 + i * 0.1) * sp;
      });
      try {
        renderer.render(scene, cam);
      } catch (err) {
        console.warn("Cena 3D pausada após erro de renderização.", err);
        stop();
        setFailed(true);
        return;
      }
      if (tick % 8 === 0 && readoutRef.current) readoutRef.current.textContent = `z ${pos.z.toFixed(1)} · vel ${v.toFixed(1)}`;
    };

    // pausa no modo recrutador e com a aba em segundo plano
    const start = () => {
      if (!raf && !classicRef.current && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // o sistema pode tirar o contexto gráfico (pouca memória, troca de aba, GPU reiniciada)
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    start();

    world.current = { recolor, start, stop };

    return () => {
      disposed = true;
      stop();
      world.current = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", size);
      layoutObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      cancelAnimationFrame(sizeFrame);
      scene.traverse((obj) => {
        const o = obj as THREE.Mesh;
        o.geometry?.dispose();
        const materials = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        materials.forEach((m) => {
          (m as THREE.SpriteMaterial).map?.dispose();
          m.dispose();
        });
      });
      renderer.dispose();
      // libera o contexto na hora: navegadores têm limite de contextos WebGL abertos
      renderer.forceContextLoss();
    };
  }, [readoutRef, failed, generation]);

  // trocar paleta ou modo recolore a cena (as variáveis CSS já foram aplicadas)
  useEffect(() => {
    world.current?.recolor();
    if (classic) world.current?.stop();
    else world.current?.start();
  }, [palette, classic]);

  return (
    <>
      {!failed && <canvas key={generation} ref={canvasRef} className={styles.world} aria-hidden="true" />}
      <div className={styles.scan} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
    </>
  );
}
