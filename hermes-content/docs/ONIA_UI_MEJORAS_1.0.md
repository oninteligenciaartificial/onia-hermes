# Mejoras de UI para la 1.0, priorizadas, con su referente

> **Doc vivo, sin fecha: se EDITA.** Nace el 8-oct (pedido de la madre): una lista priorizada de mejoras de UI del panel,
> cada una con su referente, su dueño y qué cambia. **Competencia = ideas, no copia. Nada de promesas nuevas.**
>
> **Límite que importa:** no hay cuenta de prueba, así que **no se miró el panel por dentro**. El estado sale del código de
> `onia-platform` `master` `b2d9d31` (8-oct, 14:44) y de los docs del 5-oct. `master` llega a producción con un cron cada
> 3 h (prompt de C13), pero «está en `master`» no es «se ve bien en pantalla». Las capturas de los referentes sí son de
> hoy. Las evidencias están en `hermes-content/research/competencia/ui-referentes/` (README ahí).

## 1. Lo que cambió respecto de lo que decían los docs (medido el 8-oct)

| Los docs decían | Hoy |
|---|---|
| El rediseño 1.0.1 (kit, Inicio, Agentes, barra inferior) está «en candidato», publicada: «sin dato» | **Está en `master`:** `components/ui/` trae `PropuestaCard`, `KpiTile`, `EmptyState` y `card.tsx`; `/pending` usa `PropuestaCard`; `BottomNav.tsx` pone el asistente al centro; `panel-hoy.tsx` y `agentes-pantalla.tsx` usan el kit. **Falta verlo en pantalla.** |
| B48: «las 11 páginas de venta se ven vacías hasta cargar el JS» | **No se reproduce.** Con JavaScript apagado y encendido, `/`, `/precios`, `/empezar`, `/agentes` y `/rubros` muestran la misma cantidad de texto (397, 1.084, 290, 428 y 433 palabras) y el titular se ve (commit `a9d19c6bb`). Queda un **hueco gris de ~150 px** bajo el titular en celular, mientras el bloque siguiente espera el scroll (`R/propia/precios-celular-8oct.png`) |
| Bug: «Se envía por WhatsApp a Lucía Mendoza» en la propuesta de Jorge Rivas | **No es un bug abierto.** Venía de datos de muestra; `pending-view.destinatario.render.test.ts` prueba que cada propuesta muestra SU destinatario. Se mira igual en la cuenta demo (fila G-01 de `ONIA_PROMESA_VS_PRODUCTO.md`) |
| Estados vacíos: «No hay datos» por todos lados | **Casi resuelto:** 15 archivos usan `EmptyState`. Quedan 3 «Sin datos aún» en `/reports`. No justifica una tarea aparte |
| Agenda por profesional, odontograma de 5 caras, caja diaria, presupuesto por fases, «Dejar de renovar» | **Siguen sin estar en `master`** (confirmado en el código): `/agenda` es la lista de hoy con «con quién es» cuando hay varios; `/appointments` es un mes; el odontograma no tiene caras por diente (el código no nombra oclusal, mesial, distal, vestibular ni lingual); WhatsApp ya escrito solo en «Mañana sin confirmar» (`ListaSinConfirmar.tsx`) |
| `/register` «ya está bien» | Paso 2 limpio (4 campos y uno opcional), pero dice **«versión 1.2»** de los términos mientras la web publica la 1.3 (C14), y **«sin tarjeta» no está junto al botón** (`R/propia/register-paso2-celular-8oct.png`) |

## 2. Cómo se priorizó

1. **Por el recorrido de la demo de 20 minutos** (`sales-kit/02-GUION-DEMO.md` §1.2): agenda (min 5-8), ficha (8-11) y
   Pendientes, «el momento» (11-15). Lo que el prospecto ve primero pesa más.
2. **Cerrar lo ya construido antes de abrir algo nuevo** (`CLAUDE.md`, «Nada a medias»): lo que espera solo un par de ojos
   va primero.
3. **Sin promesas nuevas:** una mejora que muestre algo que el catálogo no deja decir se baja de la lista.

## 3. La lista

**Quién:** *Plataforma* = necesita producción o criterio visual. *Codex* = código cerrado (ninguna hoy: ver §5).
**Sergio** = pasa por Sergio Urcullo antes de publicar (diseño nuevo o rediseño de una pantalla viva, `CLAUDE.md`).
Rutas de capturas: `R/` = `hermes-content/research/competencia/ui-referentes/`, `D/` = `hermes-content/research/competencia/`.

### A. Cerrar lo ya hecho (cero diseño)

| # | Pantalla | Referente | Qué cambia | Quién |
|---|---|---|---|---|
| A1 | Inicio, Agentes, Pendientes, barra inferior, y lo del 4-5-oct: «A medias» (Pacientes), «Deuda» (ficha), «Mañana sin confirmar» (Agenda), `/checkout`, `/help`, `/patients/import` | — (es lo propio) | **Mirarlas renderizadas con la cuenta**, a 375 y 1440 px, claro y oscuro (`auditar-app.mjs`). Hecho = capturas anotadas con lo que se vea mal | Plataforma, y **Sergio** las ve |
| A2 | Caja diaria (#110) y presupuesto por fases (parche P2) | Doctocliq caja `D/doctocliq/cuenta-de-prueba/54-…`, `56-…`; presupuesto `33-…`, `36-…` | Capturas, OK de Sergio, y la migración `20261004190000` (según el handoff de la nube) **antes** del swap | Plataforma, **Sergio** |

### B. El recorrido de la demo (agenda → ficha → Pendientes)

| # | Pantalla | Referente | Qué cambia | Quién |
|---|---|---|---|---|
| B1 | **Agenda** (`/agenda`, `/appointments`) | Dentalink semanal `R/img/dentalink_agenda_semanal.png` y «Dar cita» `R/img/dentalink_dar_cita.png`; AgendaPro panel lateral `R/crops/agendapro_agenda_panel_lateral.png` | Semana con **una columna por profesional**; **el hueco libre es el botón** («+» en cada hueco). «Dar cita» pide paciente y motivo, no 4 pasos; con **tres** filtros (profesional, duración, hueco), no siete. (P10-5, B01) | Plataforma, **Sergio** (diseño nuevo) |
| B2 | Agenda: la cita | Doctocliq popover `D/doctocliq/cuenta-de-prueba/06-agenda-cita-popover-estados.jpg`; AgendaPro (línea de «ahora») | Confirmado / Cancelado / Atendido como íconos en 1 clic desde la cita, y el resto escondido; eliminar al final y en rojo; línea de «ahora»; filtro «Solo disponibles hoy». (B02) | Plataforma, **después de B1** (mismo archivo, `AgendaClient.tsx`) |
| B3 | Agenda: reserva online | Dentalink diaria `R/img/dentalink_agenda_diaria.png` | Banda sobre la agenda: «Hay reservas por validar → Ver y validar». La parte de datos y el aviso son **C11a (Codex)**; la banda, Plataforma después. (B05) | Plataforma, tras C11a |
| B4 | **Ficha** (`/patients/[id]`) | Dentalink `R/img/dentalink_ficha_cabecera.png`, `R/img/dentalink_ficha_citas.png`, `R/crops/dentalink_ficha_antecedentes_f40.png`; Doctocliq `D/doctocliq/cuenta-de-prueba/27-pacientes-ficha-clinica.jpg` | Cabecera con **alertas médicas** fijas y visibles en todas las pestañas (alergia a la penicilina, no enterrada); «Agendar» y «Cobrar» en la barra de pestañas; contador en las pestañas (Citas 3). «Ver todo» el historial. (B12, P10-6) | Plataforma, **Sergio**; **después de aplicar P2** (mismo `FichaVista.tsx`) |
| B5 | Ficha: plan de tratamiento | Doctocliq `27-…` (línea de 4 pasos) | Línea de pasos que muestra «2 de 4» del tratamiento. **Solo muestra lo cargado; no promete detectar** nada (catálogo §8) | Plataforma, con B4 |
| B6 | **Odontograma** | Doctocliq `D/doctocliq/cuenta-de-prueba/28-…`, `29-…`; Dentalink `D/dentalink/odontograma.jpg` | **5 caras por diente** (oclusal, mesial, distal, vestibular, lingual), dentición infantil y catálogo de hallazgos. Hoy el código no distingue caras. El que más separa a Onia de «una agenda con cuaderno». (B13, P10-6) | Plataforma, **Sergio**; después de P2. Es el más grande |
| B7 | **Pendientes** (`/pending`) | Dentalink `D/dentalink/tareas-resultado.jpg` (lista y detalle en una pantalla) | El kit ya está. **Mirar** que la fila de botones no se corte en celular y que «Aprobar y enviar» sea el único primario. Las pestañas «Del día / Atrasadas N» y «Finalizar ▾» con 3 salidas **no van en la 1.0** (definir «atrasada» es decisión de Sergio; es P2) | Plataforma, dentro de A1 |

### C. Entrada y primera impresión

| # | Pantalla | Referente | Qué cambia | Quién |
|---|---|---|---|---|
| C1 | `/register` paso 2 | Dapta `R/crops/dapta_hero_d.png`; Hostinger `R/crops/hostinger_webhosting_top.png` (garantía y total junto al botón) | «Sin tarjeta» pegado al botón «Crear mi cuenta · 14 días gratis»; la versión de los términos, con C14 (1.2 → 1.3). Una línea | Plataforma, con C14 |
| C2 | Web de venta, celular | — (medido hoy) | Cerrar el hueco gris de ~150 px bajo el titular (el bloque siguiente se revela tarde) | web-factory; prioridad baja |
| C3 | Inicio | Dentalink panel `R/img/dentalink_panel_desempeno.png` | Separar «trabajo hecho» de «cobrado» y mostrar la diferencia como deuda. Hace falta definir «trabajo hecho»: **no va sin decisión de Sergio** | Plataforma, 1.1 |

### D. Se anota y no se hace en la 1.0

«Finalizar ▾» con tres salidas (B37) · pestañas «Atrasadas N» · barra lateral con Favoritos y extendida a Cobros y Contabilidad
(1.1-A) · «Primeros pasos» con anillo de progreso (Doctocliq `D/doctocliq/cuenta-de-prueba/01-…`; Onia ya tiene la guía) ·
«Búsqueda rápida de hora» (AgendaPro) · editor de fichas por rubro (AgendaPro) · calculadora de plan (Dapta).

## 4. Lo que NO se toma de los referentes (para no abrir una promesa)

- **Selector de sede arriba del menú (Hostinger, Dentalink).** Varias sucursales es «no se nombra» (catálogo §7).
- **Una pestaña visible que no funciona.** Doctocliq muestra «Este servicio es parte del CRM y no está incluido»
  (`D/doctocliq/cuenta-de-prueba/10-…`): es «obra a la vista», prohibida en la venta.
- **Precio tachado y «79 % off» (Hostinger), «Close 21x more deals» y «+50.000 empresas» (Dapta).** Onia no tiene
  descuentos ni clientes pagando: sería fabricar.
- **Pedir tarjeta en el alta (Lety).** En Bolivia corta el alta y la prueba es «sin tarjeta».
- **El mega-menú de ~20 ajustes (Dentalink), la tabla plana y la fecha gigante.** Contradicen «menos pasos, menos páginas».
- **Una calculadora de plan (Dapta).** Con 4 planes y un solo eje (usuarios), agrega un paso.

## 5. Para Codex: ninguna hoy

Revisé qué mejoras de la lista son «código cerrado» y no hay ninguna que Codex pueda correr sin chocar:

| Mejora | Por qué no es de Codex hoy |
|---|---|
| B1, B2 | Diseño nuevo; B1 y B2 tocan el mismo archivo (`AgendaClient.tsx`). Es de Plataforma (`codex-relevo.md` §7) |
| B4, B5, B6 | Mismo `FichaVista.tsx` que el parche P2; hasta aplicarlo, cualquier cambio rompe su `git apply` |
| B3 | Depende de que C11a (reserva avisa) esté mergeado |
| B7, A1 | Es mirar, no construir |
| C1 | Una línea: no vale una corrida; va con C14 |
| `/reports` «Sin datos aún» ×3 | Tres líneas de bajo valor |

**Cuándo sí:** B3 (la banda) pasa a Codex cuando C11a esté en `master`, y los arreglos que salgan de A1 (si son chicos),
con el código de ese día. Un prompt escrito hoy se quedaría viejo: `master` de `onia-platform` pasó de `97fe306` a `b2d9d31` entre mis dos lecturas del 8-oct.
Formato: `hermes-content/docs/handoff/codex-tareas/` (META, PRUEBA DE HECHO, REGLA DE PARADA).

## 6. Cómo venden Lety y Dapta hoy (8-oct, solo páginas públicas)

| | **lety.ai** | **dapta.ai** |
|---|---|---|
| A quién le vende | A agencias que revenden IA con su marca. No a la clínica | Al negocio final: llamar a los leads y cerrar |
| Titular | «Sell AI. To any business. Get paid every month.» | «Create your first AI sales agent in 2 minutes» |
| Clics hasta empezar | 1 (a `app.lety.ai`); pide tarjeta, según la ficha del 3-oct | 0 para ver el alta, 1 con Google; sin tarjeta; botón «Claim my 2,000 credits» |
| Precio | En `/pricing`: $97, $297 y $497 al mes, más 4,9 / 2,9 / 1,9 % por transacción (dato nuevo) | En `/pricing`: $99, $499, $1.499 y a medida, con una calculadora antes |
| Primer beneficio | Plata de la agencia (ingreso mensual recurrente) | «Never miss a call»: no perder un lead |

**Qué le sirve a Onia:** un solo eje distingue los planes y el resto es igual; la frase de transparencia junto al precio; el
beneficio escrito en el botón del alta y «sin tarjeta» al lado. Ninguno de los dos le vende a una clínica dental de Santa
Cruz: no hay aquí un referente de cómo explicarle a un dueño de clínica el recall.

## 7. Decisiones de Sergio Urcullo que condicionan la lista

1. **Acento del panel:** petróleo `#12616B` o verde `#027650` (hoy conviven). Y **una tipografía** (hay cuatro versiones
   escritas). Sin eso, todo rediseño nuevo es provisorio.
2. **¿La web y la app pasan a «usted»?** `/register` mezcla «tenés» y «Cree su cuenta».
3. **Si el agente de WhatsApp sale de la venta** (`ONIA_PROMESA_VS_PRODUCTO.md` §3).
4. **Qué es «atrasada»** en Pendientes, y si «Aprobar y enviar» lleva ventana de deshacer.
5. **Los OK de A1 y A2:** lo único que no cuesta construir nada.
