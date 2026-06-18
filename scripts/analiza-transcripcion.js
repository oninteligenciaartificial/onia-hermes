#!/usr/bin/env node
/**
 * Analizador de transcripciones de llamadas de venta ONIA
 * Usa OpenAI GPT-4o-mini para extracción estructurada
 *
 * Uso:
 *   node scripts/analiza-transcripcion.js <transcripcion.txt>
 *   cat transcript.txt | node scripts/analiza-transcripcion.js
 *
 * Variables de entorno:
 *   OPENAI_API_KEY
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const OPENAI_KEY = process.env.OPENAI_API_KEY;

const EXTRACCION_SYSTEM = `Sos asistente de ventas de ONIA, agencia de diseño web e IA en Santa Cruz, Bolivia.
Analizá transcripciones de llamadas de venta y extraé datos en JSON.
Si un dato no está en la llamada usá null. No inventes datos.
Respondé SOLO con JSON válido, sin markdown, sin texto extra.`;

const EXTRACCION_USER = (transcript) => `Extraé estos campos:

{
  "empresa": "nombre de la empresa cliente",
  "contacto": "nombre del responsable",
  "industria": "dental | clinica | audiovisual | productora | arquitecto | constructora | retail | comercio | restaurant | pyme | servicio",
  "ciudad": "ciudad del cliente",
  "necesidad_principal": "problema principal en 1-2 oraciones",
  "necesidades_secundarias": ["otras necesidades"],
  "presupuesto_mencionado": "monto o rango si lo mencionaron o null",
  "objeciones": ["objeciones expresadas"],
  "nivel_interes": "alto | medio | bajo | no_definido",
  "proximo_paso_acordado": "qué quedó acordado",
  "fecha_proximo_paso": "fecha o null",
  "productos_relevantes": ["IDs: dentalgest | gestios | web_landing | web_negocio | web_pro | consultoria"],
  "notas_internas": "observaciones de tono, urgencia, contexto",
  "resumen_ejecutivo": "2-3 oraciones de la oportunidad"
}

TRANSCRIPT:
---
${transcript}
---`;

function httpsPost(hostname, urlPath, headers, body) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname, path: urlPath, method: 'POST', headers }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch (e) { reject(new Error('Parse error')); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function extraerDatos(transcript) {
  const body = JSON.stringify({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    temperature: 0.1,
    messages: [
      { role: 'system', content: EXTRACCION_SYSTEM },
      { role: 'user', content: EXTRACCION_USER(transcript) },
    ],
  });

  const result = await httpsPost(
    'api.openai.com',
    '/v1/chat/completions',
    {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    body
  );

  if (result.error) throw new Error('OpenAI: ' + result.error.message);
  const text = result.choices[0].message.content.trim();
  const clean = text.replace(/^```json?\n?/i, '').replace(/```$/m, '').trim();
  return JSON.parse(clean);
}

async function main() {
  const args = process.argv.slice(2);
  let transcript = '';

  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    transcript = Buffer.concat(chunks).toString('utf8');
  } else if (args[0]?.endsWith('.txt')) {
    transcript = fs.readFileSync(args[0], 'utf8');
  } else {
    console.error('Uso: node scripts/analiza-transcripcion.js <transcripcion.txt>');
    process.exit(1);
  }

  if (!OPENAI_KEY) {
    console.error('Error: OPENAI_API_KEY no configurada');
    process.exit(1);
  }

  console.log('🎙️  Analizando transcripción con GPT-4o-mini...\n');

  const datos = await extraerDatos(transcript);

  const interes = { alto: '🔥', medio: '⚡', bajo: '❄️', no_definido: '❓' };
  console.log(`📋 ${datos.empresa || 'Empresa desconocida'}`);
  console.log(`👤 ${datos.contacto || '—'} | 🏭 ${datos.industria || '—'} | 📍 ${datos.ciudad || '—'}`);
  console.log(`${interes[datos.nivel_interes] || '❓'} Interés: ${datos.nivel_interes}`);
  if (datos.presupuesto_mencionado) console.log(`💰 ${datos.presupuesto_mencionado}`);
  if (datos.necesidad_principal) console.log(`\n🎯 ${datos.necesidad_principal}`);
  if (datos.objeciones?.length) console.log(`\n⚠️  Objeciones:\n${datos.objeciones.map(o => `   • ${o}`).join('\n')}`);
  if (datos.proximo_paso_acordado) console.log(`\n✅ ${datos.proximo_paso_acordado}`);
  if (datos.resumen_ejecutivo) console.log(`\n📊 ${datos.resumen_ejecutivo}`);

  // Guardar JSON
  const dir = path.join(__dirname, '..', 'hermes-content', 'propuestas');
  fs.mkdirSync(dir, { recursive: true });
  const slug = (datos.empresa || 'cliente').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const jsonPath = path.join(dir, `datos-${slug}-${Date.now()}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(datos, null, 2));
  console.log(`\n💾 ${jsonPath}`);

  // Generar propuesta
  if (datos.empresa) {
    console.log('\n📑 Generando propuesta...');
    const propArgs = [
      `--empresa=${datos.empresa}`,
      datos.industria && `--industria=${datos.industria}`,
      datos.necesidad_principal && `--necesidad=${datos.necesidad_principal.slice(0, 120)}`,
      datos.contacto && `--contacto=${datos.contacto}`,
      datos.ciudad && `--ciudad=${datos.ciudad}`,
      datos.productos_relevantes?.length && `--productos=${datos.productos_relevantes.join(',')}`,
      datos.objeciones?.length && `--notas=Objeciones: ${datos.objeciones.slice(0,2).join('. ')}`,
    ].filter(Boolean).map(a => `"${a}"`).join(' ');

    const out = execSync(`node "${path.join(__dirname, 'genera-propuesta.js')}" ${propArgs}`, {
      cwd: path.join(__dirname, '..'), encoding: 'utf8',
    });
    console.log(out.trim());
  }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
