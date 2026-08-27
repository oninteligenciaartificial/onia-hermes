# Cómo se divide el trabajo en sesiones

> Sergio, 2026-08-27: *"dime tus tareas y dividamos por cada sesión, y define qué quieres
> hacer, sin eso no avanzamos"*.
>
> Nace de una sesión real que saltó entre carruseles, naming, reels e infra sin cerrar
> ninguno. La regla del proyecto ya decía "un objetivo por sesión" y no se cumplió.

---

## 1. La regla que decide dónde va cada cosa

**No se separa por tema. Se separa por CHOQUE.** Dos trabajos van en sesiones distintas solo
si se pisan:

| Chocan si… | Ejemplo |
|---|---|
| Tocan **los mismos archivos** | dos sesiones editando `carousel_render.js` |
| Tocan **infra única** | VPS, n8n, Supabase — **un dueño a la vez, siempre** |
| Tocan **`main`** al mismo tiempo | dos merges cruzados |

Todo lo demás **corre en paralelo sin problema**. Repos distintos, carpetas distintas,
cuentas distintas: paralelo libre.

---

## 2. Los carriles, y qué se hace en cada uno

### 🎨 Carril CONTENIDO — `claude/ads-creatividades-publicos`
**Es el carril de esta sesión.** Toca `hermes-content/references/` y `scripts/carousel_*`.

Qué vive acá: carruseles, reels, historias, las tres cuentas (@oniahq, @sergio_urcullo,
Lucía), el motor de render y sus gates.

**No toca:** el producto, el VPS, n8n, precios.

### 💰 Carril PRECIOS — `carril/precios-docs`
Toca `pricing.ts`, `subscription-plans.ts` y los docs de precio.
**Choca con contenido** si una pieza cita un precio → el contenido **lee**, nunca define.

### 📊 Carril VENDEDORA — `carril/decks-vendedora`
Material de venta: decks, propuestas, one-pagers.
**Choca con precios** por la misma razón.

### 🔧 Carril PRODUCTO — repo `onia-platform`
Repo aparte → **paralelo libre**, nunca choca con contenido.

### ⚙️ Carril INFRA — VPS, n8n, Supabase, Postiz, DNS
🔴 **UN DUEÑO A LA VEZ, sin excepción.** Es el único carril que no admite paralelo.

---

## 3. Lo que está abierto HOY, verificado

### En el carril de contenido (el mío)

| Estado | Qué | Bloqueado por |
|---|---|---|
| 🔴 | **17+ piezas producidas, CERO publicadas** | tu OK |
| 🔴 | **O02 tiene cartelería en inglés**: "CLOSED" y "Grain & Good" en dos fotos | nada, lo hago |
| 🟡 | **3 archivos faltan y bloquean 4 formatos**: `capture-web.mjs`, `_reel.html`, `film-pattern.mjs` | nada, lo hago |
| 🟡 | **El pack visual de Sergio no existe** — sus piezas se ven como las de Onia | nada, lo hago |
| 🟡 | **La palabra STACK no tiene recurso** — S05 no se puede publicar sin él | nada, lo hago |
| ⚪ | Las ~45 fotos de la lista de tomas | vos, una tarde |
| ⚪ | Naming de la comunidad | **cerrado: Onia Community** |

### Fuera de mi carril (otras sesiones)

| Carril | Qué está abierto |
|---|---|
| **Infra** | Postiz se muere solo cada vez que se reinicia el VPS (pasó 22 y 24-ago) · el ticket a Hostinger por el steal |
| **Producto** | O01/O02 necesitan capturas nuevas del panel — y `panel-real.png` llega **cortado en origen** |
| **Precios** | conviven 10 listas de precios distintas |

---

## 4. Lo que hago yo, en orden, sin preguntarte nada

1. **Sacar la cartelería en inglés de O02.** Un "CLOSED" en una pieza para ferreteros
   bolivianos rompe la autenticidad. Es rápido.
2. **Los 3 archivos que faltan.** Se escriben una vez y desbloquean 4 formatos de costo
   cero. Es el mejor retorno por hora que hay en el manual.
3. **El pack visual de Sergio.** Sin esto sus piezas siguen pareciendo de Onia, y él es la
   única cuenta con audiencia real (411).
4. **El recurso de STACK**, para que su palabra clave se pueda encender.

## 5. Lo que solo podés hacer vos

| Prioridad | Qué | Cuánto te lleva |
|---|---|---|
| 🔴 1 | **Tomar `@oniacommunity`** — verificado libre hoy | 2 minutos |
| 🔴 2 | **Mirar las 17 piezas y decir sí o no.** Es el único cuello de botella real: puedo producir 90 al mes y no sirve de nada si no sale ninguna | una sentada |
| 🔴 3 | **Las ~45 fotos** de la lista de tomas | una tarde |
| 🟡 4 | Cerrar con Samuel: tope al CPM y definir "acumuladas" | esta semana |
| 🟡 5 | Ticket a Hostinger por el steal del VPS | esta semana |
| ⚪ 6 | Instagram → Apps y sitios web: sacar lo que no reconozcas | 5 minutos |

---

## 6. 🔴 El cuello de botella verdadero

**No es producción. Es aprobación.**

Hay 17 piezas listas y ninguna publicada. Producir más no mueve nada: lo que mueve es que
salga la primera. El objetivo que importa sigue siendo **un lead real punta a punta** —
alguien que no conocemos comenta la palabra, recibe el DM y aparece en el panel. Eso no
puede pasar si no se publica.

## 7. Cómo arrancar la próxima sesión

Una frase, medible, y no se cierra hasta terminarla:

- ✅ *"Dejar las 4 piezas de @oniahq aprobadas y publicadas."*
- ✅ *"Escribir los 3 archivos que faltan y dejar P02, P04 y P12 rindiendo."*
- ❌ *"Mejorar el contenido."* — eso no se puede verificar, y es como empezó esta sesión.
