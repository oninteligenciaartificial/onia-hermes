/*
 * Logica pura del modulo knowledge (referencia canonica; los productos la portan).
 * Sin estado, sin IO, sin dependencias, inmutable: maquina de estados del articulo,
 * INTEGRIDAD del arbol de taxonomia (categorias sin ciclos), slug determinista y
 * busqueda lexica simple. La busqueda SEMANTICA (embeddings) sigue external_gate:
 * aca solo se rankea por coincidencia de texto, nunca por similitud vectorial.
 */

// --- Normalizacion de texto (compartida por slug y busqueda) ------------------

/** Minusculas + sin acentos/diacriticos (NFD). Deterministico, no lanza. */
function normalizeText(text = "") {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Tokens alfanumericos de un texto ya normalizado (sin vacios). */
function tokenize(text = "") {
  return normalizeText(text)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

// --- Maquina de estados del articulo -----------------------------------------

export const ARTICLE_STATES = ["draft", "published", "archived"];

// draft -> published|archived ; published -> archived ; archived -> published (restaurar).
const ARTICLE_TRANSITIONS = {
  draft: ["published", "archived"],
  published: ["archived"],
  archived: ["published"],
};

/** True si la transicion de estado del articulo es valida. */
export function canTransitionArticle(from, to) {
  return (ARTICLE_TRANSITIONS[from] ?? []).includes(to);
}

/**
 * Aplica una transicion de estado y devuelve un articulo NUEVO (no muta).
 * Al publicar por primera vez sella publishedAt = now; una re-publicacion (desde
 * archived) conserva el publishedAt original. Archivar preserva publishedAt.
 * Lanza si la transicion es invalida.
 */
export function applyArticleTransition(article, to, { now = new Date().toISOString() } = {}) {
  const from = article?.status;
  if (!canTransitionArticle(from, to)) {
    throw new Error(`transicion de articulo invalida ${from} -> ${to}`);
  }
  return {
    ...article,
    status: to,
    publishedAt: to === "published" ? (article?.publishedAt ?? now) : (article?.publishedAt ?? null),
    updatedAt: now,
  };
}

// --- Integridad del arbol de taxonomia (categorias) --------------------------

/** Indexa las categorias por id (ignora entradas sin id). Uso interno. */
function indexById(categories = []) {
  const map = new Map();
  for (const category of categories ?? []) {
    if (category && category.id != null) map.set(category.id, category);
  }
  return map;
}

/**
 * Ruta de una categoria: ids desde la raiz hasta la categoria (inclusive), en
 * orden root-first (util para breadcrumbs). Si el id no existe devuelve [].
 * Lanza si detecta un ciclo mientras resuelve (arbol corrupto).
 */
export function resolveCategoryPath(categories, id) {
  const byId = indexById(categories);
  const path = [];
  const seen = new Set();
  let current = byId.get(id);
  while (current) {
    if (seen.has(current.id)) {
      throw new Error(`ciclo en la taxonomia al resolver la ruta de ${id}`);
    }
    seen.add(current.id);
    path.push(current.id);
    const parentId = current.parentId ?? null;
    current = parentId != null ? byId.get(parentId) : null;
  }
  return path.reverse();
}

/**
 * True si asignar newParentId como padre de la categoria id crearia un ciclo:
 * una categoria no puede ser su propio ancestro. newParentId nulo (=raiz) nunca
 * cicla; newParentId === id cicla; en cualquier otro caso, cicla si id ya es
 * ancestro de newParentId. Robusto ante ciclos preexistentes (corta el recorrido).
 */
export function wouldCreateCycle(categories, id, newParentId) {
  if (newParentId == null) return false;
  if (newParentId === id) return true;
  const byId = indexById(categories);
  const seen = new Set();
  let current = byId.get(newParentId);
  while (current) {
    if (current.id === id) return true;
    if (seen.has(current.id)) break;
    seen.add(current.id);
    const parentId = current.parentId ?? null;
    current = parentId != null ? byId.get(parentId) : null;
  }
  return false;
}

/**
 * Valida que TODO el arbol de categorias sea aciclico. Lanza en el primer ciclo
 * (directo A->A o indirecto A->B->A). Devuelve true si esta sano. No muta.
 */
export function assertAcyclic(categories = []) {
  const byId = indexById(categories);
  for (const category of categories ?? []) {
    const seen = new Set();
    let current = category;
    while (current) {
      if (seen.has(current.id)) {
        throw new Error(`ciclo en la taxonomia detectado en la categoria ${current.id}`);
      }
      seen.add(current.id);
      const parentId = current.parentId ?? null;
      current = parentId != null ? byId.get(parentId) : null;
    }
  }
  return true;
}

// --- Slug determinista --------------------------------------------------------

/**
 * Slug estable a partir de un texto: minusculas, sin acentos, no-alfanumericos a
 * guion, sin guiones al inicio/fin. Deterministico (misma entrada => misma salida).
 */
export function slugify(text = "") {
  return normalizeText(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Busqueda lexica (NO semantica) ------------------------------------------

const SEARCH_WEIGHTS = { title: 3, tag: 2, body: 1 };

/**
 * Puntaje lexico de un articulo contra una lista de terminos ya tokenizados.
 * Suma por termino: titulo (3) > tag (2) > cuerpo (1). Insensible a acentos y
 * mayusculas. Sin terminos => 0. Es un ranking simple por texto, no embeddings.
 */
export function scoreArticle(article, terms = []) {
  if (!Array.isArray(terms) || terms.length === 0) return 0;
  const title = normalizeText(article?.title ?? "");
  const body = normalizeText(article?.body ?? "");
  const tags = Array.isArray(article?.tags) ? article.tags.map((tag) => normalizeText(tag)) : [];

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += SEARCH_WEIGHTS.title;
    if (tags.some((tag) => tag.includes(term))) score += SEARCH_WEIGHTS.tag;
    if (body.includes(term)) score += SEARCH_WEIGHTS.body;
  }
  return score;
}

/**
 * Rankea articulos por coincidencia lexica con la consulta (titulo/tags/cuerpo).
 * Devuelve los articulos con puntaje > 0, de mayor a menor; empates en el orden
 * original (estable). Consulta vacia => []. No muta la lista de entrada.
 */
export function searchArticles(articles = [], query = "") {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  return (articles ?? [])
    .map((article, index) => ({ article, index, score: scoreArticle(article, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => (b.score - a.score) || (a.index - b.index))
    .map((entry) => entry.article);
}
