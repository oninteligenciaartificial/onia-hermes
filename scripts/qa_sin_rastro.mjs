#!/usr/bin/env node
/**
 * ¿Queda rastro de datos de PRUEBA dentro de una organización REAL?
 *
 * 🔴 Nace del 2026-09-12, y de la SEGUNDA vez que el mismo carril lo hace.
 *
 * Para probar el circuito aprobar→enviar hay que sembrar en una organización que ya tenga
 * onboarding hecho y plan vigente — crear una de cero cuesta media vuelta. Así que este carril
 * sembró un paciente y una cita dentro de `clinica-sergio-p2ljs`, la cuenta REAL de Sergio
 * Urcullo, y los borró al terminar por id exacto. La limpieza se declaró "verificada" contra un
 * inventario escrito a mano: paciente, cita, acciones, aprobaciones, despachos, corridas.
 *
 * **Ese inventario a mano falla abierto en la escritura DERIVADA.** `POST` no fue lo único que
 * escribió: `logAudit` dejó 4 filas en `audit_logs` de la cuenta real, con el nombre del paciente
 * de prueba y el texto de un WhatsApp que nunca se mandó — visibles para el dueño en
 * `/admin/audit`. Sobrevivieron a la limpieza porque nadie las había puesto en la lista. Las
 * encontró esta auditoría, no la lista.
 *
 * Y hubo un segundo daño, peor que la basura: el nombre de la fila sembrada copió la **forma
 * sellada de OTRO carril** (`zz-qa-AAAA-MM-DD-HHMM`). El barredor de `recorrido_cliente.mjs`
 * borra por esa forma —correctamente, es la suya—, así que se llevó la fila ajena y la contó
 * como propia. Su informe concluyó que el paso 6 de Importadora había escrito dentro de la
 * cuenta de Sergio Urcullo: un cruce de tenant que **nunca existió**, abierto como tarea CRÍTICA
 * (`t_3f352044`). Un sello sin el nombre del carril hace que el instrumento del vecino acuse al
 * producto de un bug que es tuyo.
 *
 * Qué hace este script, y por qué así:
 *
 * - **Deriva el universo de la BASE, nunca de una lista.** Toda tabla real del schema `public`
 *   con columna `organizationId` (más `organizations` por su propio `id`), y de cada una TODAS
 *   sus columnas de texto y JSON. Una tabla nueva —o una escritura derivada que nadie previó,
 *   como `audit_logs`— entra sola. Una lista a mano es exactamente lo que ya falló.
 * - **Rojo sólo si la marca cae en una organización REAL.** Las filas dentro de una org que es
 *   de prueba son basura normal de QA y las barre su dueño; lo que no puede quedar es una marca
 *   de prueba mezclada con los datos de un cliente.
 * - **Tri-estado.** Si no puede hablar con la base sale `no-medido` (exit 2). Un auditor que
 *   confunde "no pude preguntar" con "no hay nada" es peor que ninguno.
 *
 * Uso:  node scripts/qa_sin_rastro.mjs            # audita producción
 *       node scripts/qa_sin_rastro.mjs --json     # lo mismo, para otro script
 */
import { execFileSync } from 'node:child_process';

/** La marca que dejan los carriles en sus datos de prueba: `zz-qa-…` o `zzqa…`. */
export const MARCA = 'zz-?qa';

/** Tipos de columna donde puede esconderse la marca. `jsonb` importa: `audit_logs` la guarda ahí. */
const TIPOS_CON_TEXTO = new Set(['text', 'character varying', 'character', 'jsonb', 'json']);

/** Una organización es DE PRUEBA si su propio nombre o slug lleva la marca. Todo lo demás es real. */
export function esOrganizacionDePrueba(org) {
  const campos = [org?.slug, org?.name].filter((v) => typeof v === 'string');
  return campos.some((v) => new RegExp(MARCA, 'i').test(v));
}

/** SQL que devuelve el catálogo de columnas donde hay que buscar. No nombra ninguna tabla. */
export function consultaDeUniverso() {
  return `SELECT c.table_name, c.column_name, c.data_type
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON t.table_schema = c.table_schema AND t.table_name = c.table_name AND t.table_type = 'BASE TABLE'
    WHERE c.table_schema = 'public'
      AND (c.table_name = 'organizations'
           OR c.table_name IN (SELECT table_name FROM information_schema.columns
                               WHERE table_schema = 'public' AND column_name = 'organizationId'))
    ORDER BY c.table_name, c.column_name`;
}

/**
 * Arma la consulta de rastro a partir del catálogo. Devuelve `null` si el catálogo no trae
 * ninguna columna donde buscar — así el llamador distingue "no hay nada" de "no pude preguntar".
 */
export function consultaDeRastro(catalogo) {
  const porTabla = new Map();
  for (const col of catalogo) {
    if (!porTabla.has(col.table_name)) porTabla.set(col.table_name, []);
    porTabla.get(col.table_name).push(col);
  }

  const tramos = [];
  for (const [tabla, columnas] of porTabla) {
    const nombres = new Set(columnas.map((c) => c.column_name));
    // `organizations` se apunta a sí misma; el resto cuelga por `organizationId`.
    const org = tabla === 'organizations' ? '"id"' : '"organizationId"';
    if (tabla !== 'organizations' && !nombres.has('organizationId')) continue;
    // Sin `id` la fila igual se puede nombrar: `ctid` es universal en Postgres.
    const clave = nombres.has('id') ? '"id"::text' : 'ctid::text';

    for (const col of columnas) {
      if (!TIPOS_CON_TEXTO.has(col.data_type)) continue;
      if (col.column_name === 'organizationId') continue; // el id de la org no es contenido
      tramos.push(
        `SELECT '${tabla}' AS tabla, '${col.column_name}' AS columna, ${clave} AS fila, ` +
        `${org} AS org, left("${col.column_name}"::text, 140) AS muestra ` +
        `FROM "${tabla}" WHERE "${col.column_name}"::text ~* '${MARCA}'`,
      );
    }
  }
  if (tramos.length === 0) return null;
  return tramos.join('\nUNION ALL\n');
}

/** Separa los hallazgos que caen en una organización real de los que caen en una de prueba. */
export function clasificar(hallazgos, organizaciones) {
  const porId = new Map(organizaciones.map((o) => [o.id, o]));
  const enReales = [];
  const enPrueba = [];
  for (const h of hallazgos) {
    const org = porId.get(h.org) || null;
    // Una fila cuya organización no existe en el catálogo NO se absuelve: es peor, está huérfana.
    (org && esOrganizacionDePrueba(org) ? enPrueba : enReales).push({ ...h, org });
  }
  return { enReales, enPrueba };
}

/**
 * Corre la auditoría. `psql` recibe una consulta y devuelve las filas crudas separadas por `|`.
 * Se inyecta para que el self-check pueda probar el detector sin tocar producción.
 */
export function auditar({ psql }) {
  let catalogo;
  let organizaciones;
  try {
    catalogo = filas(psql(consultaDeUniverso())).map(([table_name, column_name, data_type]) => ({ table_name, column_name, data_type }));
    organizaciones = filas(psql(`SELECT id, slug, name FROM organizations`)).map(([id, slug, name]) => ({ id, slug, name }));
  } catch (err) {
    return { estado: 'no-medido', motivo: `no pude leer el catálogo de la base: ${err.message}` };
  }
  if (catalogo.length === 0) return { estado: 'no-medido', motivo: 'el catálogo de columnas vino vacío' };

  const sql = consultaDeRastro(catalogo);
  if (sql === null) return { estado: 'no-medido', motivo: 'ninguna tabla con organizationId tiene columnas de texto' };

  let hallazgos;
  try {
    hallazgos = filas(psql(sql)).map(([tabla, columna, fila, org, muestra]) => ({ tabla, columna, fila, org, muestra }));
  } catch (err) {
    return { estado: 'no-medido', motivo: `no pude buscar el rastro: ${err.message}` };
  }

  const { enReales, enPrueba } = clasificar(hallazgos, organizaciones);
  return {
    estado: enReales.length > 0 ? 'sucio' : 'limpio',
    tablasMiradas: new Set(catalogo.map((c) => c.table_name)).size,
    enReales,
    enPrueba,
  };
}

function filas(salida) {
  return String(salida).split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.split('|'));
}

/** El psql de producción: el contenedor `supabase-db` del VPS (desde casa, el shim va por SSH). */
export function psqlDeProduccion(consulta) {
  return execFileSync('docker', [
    'exec', '-i', 'supabase-db', 'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-tAc', consulta,
  ], { encoding: 'utf8', timeout: 120_000, stdio: ['ignore', 'pipe', 'pipe'] });
}

// La guarda: sin esto, importar el módulo desde el self-check dispararía la medición viva.
if (import.meta.url === `file://${process.argv[1]}`) {
  const r = auditar({ psql: psqlDeProduccion });
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(r, null, 2));
  } else if (r.estado === 'no-medido') {
    console.log(`NO MEDIDO: ${r.motivo}`);
  } else {
    console.log(`Miré ${r.tablasMiradas} tablas con organizationId.`);
    console.log(`En organizaciones REALES: ${r.enReales.length}`);
    for (const h of r.enReales) {
      console.log(`  🔴 ${h.tabla}.${h.columna} fila=${h.fila} org=${h.org?.slug || h.org || '(huérfana)'} → ${h.muestra}`);
    }
    console.log(`En organizaciones de prueba (normal, las barre su dueño): ${r.enPrueba.length}`);
    for (const h of r.enPrueba) console.log(`  · ${h.tabla}.${h.columna} org=${h.org?.slug}`);
  }
  process.exit(r.estado === 'no-medido' ? 2 : r.estado === 'sucio' ? 1 : 0);
}
