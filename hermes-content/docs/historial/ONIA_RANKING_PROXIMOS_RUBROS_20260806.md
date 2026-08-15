# Ranking de próximos rubros Onia — alcance en Bolivia vs costo de encender

**Fecha:** 2026-08-06 · **Insumos internos:** `ONIA_FUNCIONES_OPERATIVAS_20260801.md`, `vertical-pack.ts`/`types.ts` (onia-platform), `ONIA_PLANES_REQUISITOS_20260801.md` · **Método:** costo de encendido = doc interno; mercado y competencia = investigación web con fuentes citadas. Donde no hay dato duro, se dice "sin dato" — no se estimó en silencio.

## Driver transversal: SIAT 30-sep-2026

**[Corrección 2026-08-06, verificada en PDF oficial]** La cadena normativa real: la RND 102500000036 (11-sep-2025) amplió el plazo de los grupos 9°-12° solo hasta el 31-mar-2026; fue la **[RND 102600000007 (25-mar-2026)](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/)** la que fijó el **30-sep-2026** como plazo final para que los grupos **9° al 12° — micro y pequeñas empresas — emitan por facturación en línea**; desde el 01-oct-2026 solo vale la modalidad asignada. Esos grupos SON el target de Onia: **todos los rubros chicos están presionados a la vez, con fecha**. Los más presionados: los que facturan a empresas (servicios profesionales, importadora/construcción, educación privada). Matiz obligatorio del pitch (regla [[siat-pitch-portal-gratis]]): el SIN da Portal Web gratis — se vende "no tengas que tipear", nunca "obligatorio por ley". **Gate real: la homologación SIAT de Onia sigue bloqueada por NIT (S2, caduca 1-oct)** — sin eso, el driver lo capitaliza la competencia (Emizor).

## a) Tabla ranking

Ticket según `ONIA_PLANES_REQUISITOS`: Básico Bs 320/mes o **Bs 89/sem** · Pro Bs 750/mes o Bs 199/sem · Full Bs 1.500/mes. Score = alcance (mercado × ticket × presión SIAT) / esfuerzo (doc interno).

| # | Rubro (track) | Tamaño mercado BO/SCZ | Costo de encender | Competencia | Ticket | Score |
|---|---|---|---|---|---|---|
| 1 | **Estética / spa** (`esteticagest-clinical`) | Sin dato oficial; densidad alta en directorios SCZ ([amarillas.bo](https://amarillas.bo/rubro/salones-de-belleza), [Fresha ya lista salones en SCZ](https://www.fresha.com/lp/en/bo-santa-cruz-de-la-sierra)) | 🟢 CASI GRATIS — 90% de dental: copy + ficha sin odontograma + seeder | [AgendaPro](https://agendapro.com/es/centros-de-estetica/software-para-centros-de-estetica) (10.000+ negocios LatAm), Fresha (freemium). **Ninguna con contabilidad Bolivia ni SIAT** | Básico→Pro | **9/10** |
| 2 | **Veterinaria** (`vetgest-clinical`) | SER SCZ: ~50 licencias/año a veterinarias (2013-2017); "2 de cada 3 familias tienen mascota"; 1,72 M perros BO ([Economy](https://www.economy.com.bo/articulo/business/mascotas-mercado-que-crecer/20220810191430007031.html), [allpetfood](https://allpetfood.net/entrada/mascotas-en-bolivia--un-negocio-que-crece-al-6--anual-y-genera-mas-de-sus-155-millones-19584/)) | 🟢 CASI GRATIS — ídem estética; ficha = mascota + dueño | [VeteSoft](https://vetesoft.org/nube1/) (6.000+ clínicas LatAm), GVET, OkVet; ninguna con fiscal Bolivia | Básico→Pro | **8,5/10** |
| 3 | **Servicios profesionales** (`gestios-servicios-profesionales`) | SEPREC: entre los sectores de mayor crecimiento de **394.658 empresas** (+10,7% a ago-2025) ([SEPREC](https://www.seprec.gob.bo/index.php/2025/09/12/bolivia-fortalece-su-base-empresarial-con-un-crecimiento-del-107-hasta-agosto-de-2025/)) | 🟢 BARATO — set comercio + agenda existente | Casi nula como gestión integral (Emizor/Gosocket solo facturan) | Básico→Pro; **máxima presión SIAT** | **8/10** |
| 4 | Gastronomía (`gestios-gastronomia`) | El más grande con dato: ~4.100 empresas (2017), ~2.600 restaurantes SCZ (2015) ([Bolivia Emprende](https://boliviaemprende.com/noticias/santa-cruz-lidera-la-apertura-de-restaurantes-en-bolivia)) | 🟢 en papel; **pero espera mesas/comandas que comercio no tiene** | POS específicos USD 35-60/mes ([comparasoftware](https://www.comparasoftware.com.bo/software-para-restaurantes)), Toteat | Semanal Bs 89 | 6,5/10 |
| 5 | Educación privada | ~144 privadas SCZ (directorio no oficial) | 🟢 BARATO | sin jugador dominante | Pro→Full | 6/10 |
| 6 | Construcción (`proveegest-construccion`) | sin conteo; SEPREC lo lista dinámico | 🟠→🟢 se abarató (quotes_b2b+knowledge ya portados) | sin jugador local | Pro→Full | 6/10 |
| 7 | Turismo | sin dato duro | 🟢 | sin dato | Básico | 4/10 |
| 8 | Gimnasios/ópticas/farmacias | parcial/sin dato | 🔴 **NO están en los 11 tracks del contrato** → core congelado | Crossfy etc. en USD | — | 2/10 |
| 9 | Ganadero (`ganadero-offline`) | real pero exige offline = arquitectura | 🔴 el más lejos | — | — | 1/10 |

## b) TOP 3 para desarrollar YA

1. **Estética** — el mismo producto vendible de dental (agenda llena + impuestos al día) a un mercado urbano denso, por el costo de un seeder y copy.
2. **Veterinaria** — único "casi gratis" con dato duro de crecimiento; la competencia LatAm no tiene contabilidad ni SIAT Bolivia. El recordatorio de vacunas ES el agente Recall dental con otro copy.
3. **Servicios profesionales** — máxima presión SIAT al 30-sep (facturan a empresas), reusa comercio + agenda; los contadores son además **canal de distribución**.

Gastronomía queda 4.ª a propósito: mercado más grande pero encaje incompleto (mesas/comandas) y competencia POS establecida — se enciende **con prospecto real** (regla WOW-con-cliente-pagando).

## c) Plan de encendido concreto (mecánica que comercio recorrió en UN día)

1. `types.ts`: agregar el trackId a `SUPPORTED_VERTICAL_TRACK_IDS` (el `satisfies` gatea contra el contrato; los 11 rubros ya están espejados).
2. `vertical-pack.ts`: declarar SOLO presentación — brand (logo `""` hasta tener asset), nav, roleKeys (**"dueno"/primer rol SIEMPRE primero**: `provisionOrganization` asigna `roleKeys[0]` al owner), quickActions propios (sin esto hereda el FAB dental), bottomNavHrefs. Vocabulary/kpis/intake salen del espejo (NO se copian a mano).
3. `VERTICAL_PACKS`: agregar la entrada (Record total — olvidarlo no compila).
4. Seeder + copy por rubro; permisos finos de roleKeys pendientes igual que eléctrico/gestios.

Por rubro: **Estética** = nav dental sin odontograma (ficha genérica), quick actions cita/clienta/cobrar, seeder de servicios. **Veterinaria** = ídem; ficha mascota+dueño (partnerTypes del contrato ya lo traen); seeder especies/vacunas. **Servicios profesionales** = nav comercio + agenda; seeder tipos de servicio; el gancho es `/contabilidad` ya en prod.

Transversales que suben a los tres: UI de importación de datos · seed del cron de aprobaciones · compras a crédito.

## d) Qué NO tocar todavía

- **Ganadero** (offline = arquitectura) · **Gimnasios/ópticas/farmacias** (no están en el contrato; core congelado) · **Turismo** (sin dato que justifique ni el seeder) · **Gastronomía sin prospecto** (POS incompleto vs competidores de USD 35/mes) · **Educación** (ciclo de venta lento, nicho chico).

**Limitaciones del dato:** Bolivia no publica censos por rubro utilizables — estética, turismo y farmacias quedaron "sin dato"; restaurantes y gimnasios solo tienen cifras 2015-2018. Ninguna cifra fue estimada para rellenar. El dato que más falta sigue siendo interno: ticket promedio por cita en SCZ (pendiente D1).
