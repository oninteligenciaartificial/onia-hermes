/**
 * Pack community-editorial — carruseles de conocimiento para la marca personal.
 *
 * Dirección: portada fotográfica/editorial como los carruseles de creador de IA;
 * interiores tipo bóveda: una idea, una tarjeta de prueba y una ruta visual clara.
 * La plantilla no intenta llenar el lienzo con texto: cada slide tiene un objeto
 * didáctico (flow, terminal, matrix, table o contract) que explica el concepto.
 */

const fs = require('fs');
const path = require('path');

function crear({ esc, emph, roleFor, ACCOUNTS, BRAND, getFmt }) {
  const text = (value) => String(value == null ? '' : value);
  const list = (value) => Array.isArray(value) ? value : [];

  function imagePath(slide, args) {
    // bg vacío en una slide significa "no uses la foto global".
    const raw = Object.prototype.hasOwnProperty.call(slide, 'bg') ? slide.bg : (args && args.bg);
    if (!raw) return '';
    const resolved = path.isAbsolute(raw) ? raw : path.resolve(raw);
    return fs.existsSync(resolved) ? resolved : '';
  }

  function imageDataUrl(file) {
    const ext = path.extname(file).toLowerCase();
    const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.webp' ? 'image/webp' : 'image/png';
    return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
  }

  function assetPath(raw) {
    if (!raw) return '';
    const resolved = path.isAbsolute(raw) ? raw : path.resolve(raw);
    return fs.existsSync(resolved) ? resolved : '';
  }

  function dots(idx, total) {
    return list(Array.from({ length: total }, (_, i) => i)).map((i) =>
      `<span class="dot${i === idx ? ' active' : ''}"></span>`).join('');
  }

  function renderFlow(visual) {
    const nodes = list(visual.nodes);
    return `<div class="visual visual-flow">
      <div class="visual-label">${esc(visual.label || 'FLUJO REAL')}</div>
      <div class="flow-list">${nodes.map((node, i) => `
        <div class="flow-node">
          <span class="node-index">${String(i + 1).padStart(2, '0')}</span>
          <span class="node-name">${esc(node.name || node)}</span>
          ${node.detail ? `<span class="node-detail">${esc(node.detail)}</span>` : ''}
        </div>${i < nodes.length - 1 ? '<span class="flow-arrow">→</span>' : ''}`)
        .join('')}</div>
      ${visual.note ? `<div class="visual-note">${emph(visual.note)}</div>` : ''}
    </div>`;
  }

  function renderTerminal(visual) {
    const lines = list(visual.lines);
    return `<div class="visual visual-terminal">
      <div class="terminal-bar"><i></i><i></i><i></i><span>${esc(visual.label || 'terminal')}</span></div>
      <div class="terminal-body">${lines.map((line) => {
        const value = typeof line === 'string' ? line : line.value;
        const kind = typeof line === 'string' ? '' : (line.kind || '');
        return `<div class="terminal-line ${esc(kind)}">${esc(value)}</div>`;
      }).join('')}</div>
    </div>`;
  }

  function renderMatrix(visual) {
    const items = list(visual.items);
    return `<div class="visual visual-matrix">
      <div class="visual-label">${esc(visual.label || 'DECISIÓN')}</div>
      <div class="matrix-list">${items.map((item, i) => `
        <div class="matrix-item">
          <span class="matrix-number">${String(i + 1).padStart(2, '0')}</span>
          <div><strong>${esc(item.title || item.label || item)}</strong>${item.body ? `<p>${esc(item.body)}</p>` : ''}</div>
        </div>`).join('')}</div>
    </div>`;
  }

  function renderTable(visual, slide) {
    const rows = list(visual.rows).length ? visual.rows : list(slide.lines).map((row) => ({ value: row }));
    return `<div class="visual visual-table">
      <div class="visual-label">${esc(visual.label || 'GUARDÁ ESTA TABLA')}</div>
      <div class="table-head"><span>${esc(visual.left || 'ENTRA')}</span><span></span><span>${esc(visual.right || 'SALE')}</span></div>
      <div class="table-rows">${rows.map((row) => {
        if (typeof row === 'string') return `<div class="table-row"><b>${esc(row)}</b></div>`;
        return `<div class="table-row"><b>${esc(row.left || row.from || row.value || '')}</b><span>→</span><b>${esc(row.right || row.to || '')}</b></div>`;
      }).join('')}</div>
    </div>`;
  }

  function renderContract(visual) {
    const fields = [
      ['INPUT', visual.input],
      ['OUTPUT', visual.output],
      ['PERMISOS', visual.permissions],
    ].filter(([, value]) => value);
    return `<div class="visual visual-contract">
      <div class="visual-label">${esc(visual.label || 'CONTRATO')}</div>
      ${fields.map(([label, value]) => `<div class="contract-row"><span>${label}</span><b>${esc(value)}</b></div>`).join('')}
    </div>`;
  }

  function renderScreenshot(visual) {
    const file = assetPath(visual.file || visual.src || visual.path);
    if (!file) {
      return renderNote({
        label: visual.label || 'PRODUCTO REAL',
        value: 'Falta la captura aprobada del producto.',
        detail: visual.caption || '',
      }, {});
    }
    return `<div class="visual visual-screenshot">
      <div class="screenshot-top"><span>${esc(visual.label || 'PRODUCTO REAL')}</span><i></i></div>
      <div class="screenshot-frame"><img class="${visual.fit === 'cover' ? 'fit-cover' : ''}" src="${imageDataUrl(file)}" alt=""></div>
      ${visual.caption ? `<p class="screenshot-caption">${emph(visual.caption)}</p>` : ''}
    </div>`;
  }

  function renderNote(visual, slide) {
    const label = visual.label || slide.pill || 'IDEA CLAVE';
    const value = visual.value || visual.note || slide.callout;
    // Sin texto propio no hay tarjeta: antes se rellenaba con una frase fija que
    // terminaba publicada en carruseles que no hablaban de eso (visto 29-sep).
    if (!value) return '';
    return `<div class="visual visual-note-card">
      <div class="visual-label">${esc(label)}</div>
      <div class="note-mark">↗</div>
      <strong>${emph(value)}</strong>
      ${visual.detail ? `<p>${emph(visual.detail)}</p>` : ''}
    </div>`;
  }

  function visualHtml(slide) {
    const visual = slide.visual || {};
    switch (visual.type) {
      case 'flow': return renderFlow(visual);
      case 'terminal': return renderTerminal(visual);
      case 'matrix': return renderMatrix(visual);
      case 'table': return renderTable(visual, slide);
      case 'contract': return renderContract(visual);
      case 'screenshot': return renderScreenshot(visual);
      default: return renderNote(visual, slide);
    }
  }

  function communityEditorialHtml(slide, idx, total, account, args) {
    const FMT = getFmt();
    const role = roleFor(slide, idx, total);
    const last = idx === total - 1;
    const acc = ACCOUNTS[account] || ACCOUNTS.onia;
    const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
    const bg = imagePath(slide, args);
    const hasPhoto = Boolean(bg);
    const serie = (args && args.serie) || 'IA PRÁCTICA';
    const episode = (args && args.episodio) || String(idx + 1).padStart(2, '0');
    const kicker = slide.pill || (role === 'cover' ? 'GUÍA DE CAMPO' : 'LO QUE APRENDÍ CONSTRUYENDO');
    const body = slide.body ? `<p class="body">${emph(slide.body)}</p>` : '';
    const headline = `<${role === 'cover' ? 'h1' : 'h2'} class="headline">${emph(slide.headline || '')}</${role === 'cover' ? 'h1' : 'h2'}>`;
    const photo = hasPhoto ? `<div class="photo" style="background-image:url('${imageDataUrl(bg)}')"></div><div class="scrim"></div>` : '';
    const paper = hasPhoto ? '' : '<div class="paper-grid"></div>';
    const footerCount = total > 1 ? `<span class="footer-count">${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>` : '';
    const footer = `<div class="footer"><span class="footer-handle">${esc(acc.handle)}</span><span class="footer-series">${esc(serie)}</span>${footerCount}</div>`;
    const visual = visualHtml(slide);
    const rawTrigger = text(slide.comment_trigger || slide.cta || 'GUÍA').trim();
    const trigger = rawTrigger.replace(/^coment(?:á|a)\s+/i, '').trim() || 'GUÍA';
    const cta = role === 'cta'
      ? slide.comment_trigger
        ? `<div class="cta-line"><span>Comentá</span><b>${esc(trigger)}</b></div>`
        : `<div class="cta-line cta-direct"><b>${esc(trigger)}</b><span>→</span></div>`
      : '';
    const accountName = text(acc.name || account || 'Onia').toUpperCase();
    const accountShort = text(acc.name || account || 'Onia').split(/\s+/)[0].toUpperCase();
    const coverBrand = `<div class="brandline"><span class="brand-dot"></span><span>${esc(accountName)}</span><span class="brand-rule"></span><span>${esc(serie)}</span></div>`;
    const interiorBrand = `<div class="interior-top"><span class="brand-dot"></span><span>${esc(accountShort)} / ${esc(serie)}</span><span class="top-kicker">${esc(kicker)}</span></div>`;

    return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@500;600&family=DM+Sans:wght@400;500;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
${tokens}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${FMT.w}px;height:${FMT.h}px;overflow:hidden}
body{font-family:'DM Sans',Inter,system-ui,sans-serif;background:#f7f5ef;color:#101312}
.slide{position:relative;width:${FMT.w}px;height:${FMT.h}px;overflow:hidden;background:#f7f5ef;color:#101312}
.photo{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0;filter:saturate(.82) contrast(1.04)}
.scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(5,9,8,.10) 0%,rgba(5,9,8,.08) 38%,rgba(5,9,8,.88) 100%)}
.paper-grid{position:absolute;inset:0;opacity:.44;background-image:radial-gradient(#c9cdc7 1.5px,transparent 1.5px);background-size:28px 28px}
.paper-grid:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,#f7f5ef 0%,rgba(247,245,239,.82) 62%,rgba(247,245,239,.3) 100%)}
.cover > *:not(.photo):not(.scrim), .cta > *:not(.photo):not(.scrim){position:relative;z-index:2}
.cover{background:#10221a;color:#fff;padding:64px 72px 54px;display:flex;flex-direction:column;justify-content:space-between}
.brandline{display:flex;align-items:center;gap:15px;font-family:'DM Mono',monospace;font-size:19px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.92)}
.brand-dot{display:inline-block;width:13px;height:13px;border-radius:50%;background:#13c978;box-shadow:0 0 0 5px rgba(19,201,120,.16)}
.brand-rule{height:1px;flex:1;background:rgba(255,255,255,.36);margin-left:14px}
.cover .brandline span:last-child{font-size:16px;color:#13c978}
.cover-content{max-width:920px;margin-top:auto;margin-bottom:36px}
.kicker{font-family:'DM Mono',monospace;font-weight:600;font-size:22px;letter-spacing:2px;text-transform:uppercase;color:#d8ffeb;margin-bottom:24px}
.headline{font-weight:800;letter-spacing:-3px;line-height:.97;text-wrap:balance}
.cover .headline{font-family:'DM Sans',sans-serif;font-size:95px;max-width:930px;text-shadow:0 4px 30px rgba(0,0,0,.28)}
.headline .g{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400;letter-spacing:-1px;color:#f7f5ef;background:none;padding:0;box-shadow:inset 0 -.16em 0 #13c978}
.body{font-size:31px;line-height:1.35;color:#66716d;max-width:800px;margin-top:25px}
.cover .body{color:rgba(255,255,255,.86);max-width:700px;font-size:31px}
.footer{position:relative;z-index:3;display:flex;align-items:center;gap:18px;font-family:'DM Mono',monospace;font-size:18px;letter-spacing:1px;color:#69726f}
.cover .footer{color:rgba(255,255,255,.82)}
.footer-handle{font-weight:600}
.footer-series{opacity:.7}
.footer-count{margin-left:auto;color:#08734a}.cover .footer-count,.cta .footer-count{color:#35d695}
.interior,.cta{padding:64px 72px 54px;display:flex;flex-direction:column}
.interior-top{display:flex;align-items:center;gap:15px;font-family:'DM Mono',monospace;font-size:18px;letter-spacing:1.5px;color:#29332f;text-transform:uppercase;position:relative;z-index:2}
.top-kicker{margin-left:auto;color:#08734a;font-size:16px}
.interior-main{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,47%) minmax(0,53%);gap:42px;align-items:center;flex:1;padding:42px 0 56px;min-width:0}
.interior-main > div{min-width:0}
.interior-main > div:last-child{min-width:0;width:100%}
.interior .headline{font-size:72px;max-width:500px}
.interior .headline .g{color:#0b8a52;background:linear-gradient(transparent 66%,#b8f0d3 66%);font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
.visual{border-radius:28px;background:#fff;border:1px solid rgba(16,19,18,.12);box-shadow:0 18px 45px rgba(21,36,30,.13);padding:30px;min-height:370px;display:flex;flex-direction:column;justify-content:center}
.visual-label{font-family:'DM Mono',monospace;font-size:16px;letter-spacing:2px;color:#526159;margin-bottom:23px}
.visual-note{font-size:25px;line-height:1.35;color:#39453f;border-top:1px solid #dce2dd;padding-top:20px;margin-top:26px}
.visual-note .g{font-weight:700;color:#0b8a52;background:none;padding:0}
.flow-list{display:flex;flex-direction:column;gap:10px}
.flow-node{display:grid;grid-template-columns:46px 1fr;align-items:center;border:1px solid #dfe6e0;background:#f7faf7;border-radius:15px;padding:14px 16px;min-height:58px}
.node-index{font-family:'DM Mono',monospace;font-size:16px;color:#0b8a52}
.node-name{font-size:23px;font-weight:800;color:#17201c}
.node-detail{grid-column:2;color:#526159;font-size:17px;margin-top:3px}
.flow-arrow{font-size:25px;color:#13b96b;margin:-5px 0 -5px 21px}
.visual-terminal{background:#121715;border-color:#121715;color:#f7f5ef;padding:0;overflow:hidden;justify-content:flex-start}
.terminal-bar{height:58px;background:#222b27;display:flex;align-items:center;gap:8px;padding:0 20px;font-family:'DM Mono',monospace;color:#a4b5ac;font-size:15px}
.terminal-bar i{width:11px;height:11px;border-radius:50%;background:#ef6b5e}.terminal-bar i:nth-child(2){background:#e8bb55}.terminal-bar i:nth-child(3){background:#50ca7c}.terminal-bar span{margin-left:9px}
.terminal-body{padding:26px 26px 32px;font-family:'DM Mono',monospace;font-size:18px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere}
.terminal-line{color:#c4d1c9}.terminal-line.command{color:#77e5a4}.terminal-line.comment{color:#879890}
.visual-matrix{background:#fdfcf8}
.matrix-list{display:flex;flex-direction:column;gap:16px}.matrix-item{display:grid;grid-template-columns:48px 1fr;gap:12px;padding:16px 0;border-top:1px solid #dce2dd}.matrix-item:first-child{border-top:0}.matrix-number{font-family:'DM Mono',monospace;color:#08734a;font-size:18px}.matrix-item strong{font-size:24px;color:#17201c}.matrix-item p{font-size:18px;line-height:1.35;color:#526159;margin-top:4px}
.visual-table{padding:28px 30px;background:#fdfcf8}.table-head,.table-row{display:grid;grid-template-columns:1fr 40px 1fr;align-items:center;gap:10px}.table-head{font-family:'DM Mono',monospace;font-size:14px;letter-spacing:1.4px;color:#526159;padding-bottom:14px;border-bottom:1px solid #cfd8d1}.table-rows{display:flex;flex-direction:column}.table-row{min-height:68px;border-bottom:1px solid #e1e6e2;font-size:21px}.table-row b{font-weight:700}.table-row span{text-align:center;color:#08734a;font-size:28px}
.visual-contract{background:#16231e;color:#f7f5ef;border-color:#16231e}.visual-contract .visual-label{color:#83cda4}.contract-row{padding:20px 0;border-top:1px solid rgba(255,255,255,.16);display:grid;grid-template-columns:130px 1fr;gap:18px}.contract-row span{font-family:'DM Mono',monospace;font-size:14px;color:#83cda4;letter-spacing:1px}.contract-row b{font-size:23px;line-height:1.2;font-weight:500}
.visual-screenshot{padding:0;overflow:hidden;justify-content:flex-start;background:#eef4f3;border-color:#cbd9d6}.screenshot-top{height:56px;padding:0 22px;display:flex;align-items:center;justify-content:space-between;background:#123f3d;color:#effbf6;font-family:'DM Mono',monospace;font-size:14px;letter-spacing:1.7px}.screenshot-top i{width:10px;height:10px;border-radius:50%;background:#35d695;box-shadow:0 0 0 5px rgba(53,214,149,.18)}.screenshot-frame{height:300px;background:#dfe9e7;display:flex;align-items:center;justify-content:center;overflow:hidden}.screenshot-frame img{width:100%;height:100%;object-fit:contain;object-position:center;background:#f4f8f7}.screenshot-frame img.fit-cover{object-fit:cover}.screenshot-caption{font-size:18px;line-height:1.35;color:#41504a;padding:18px 22px 21px}.screenshot-caption .g{color:#08734a;background:none;padding:0;font-weight:700}
.visual-note-card{position:relative;min-height:370px;background:#fff1d7;border-color:#efd8ac}.visual-note-card .note-mark{position:absolute;right:26px;top:22px;font-size:52px;color:#f19a33}.visual-note-card strong{font-family:'Instrument Serif',Georgia,serif;font-size:60px;line-height:1.02;font-weight:400;color:#1b1d1b;max-width:85%}.visual-note-card strong .g{color:#0b8a52}.visual-note-card p{font-size:21px;line-height:1.35;margin-top:24px;color:#59625d}
.save .interior-main{grid-template-columns:38% 62%}.save .headline{font-size:68px}.save .visual{min-height:460px}
.cta{background:#0e1713;color:#f7f5ef;padding-top:80px}.cta .interior-top{color:#dce8e1}.cta .top-kicker{color:#13c978}.cta .interior-main{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;max-width:900px}.cta .headline{font-size:90px;max-width:900px}.cta .headline .g{color:#13c978;background:none}.cta .body{color:#c3d0c8;max-width:700px}.cta-line{display:inline-flex;align-items:center;gap:18px;margin-top:38px;border-radius:999px;background:#13c978;color:#0e1713;padding:18px 28px;font-size:28px}.cta-line span{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:32px}.cta-line b{font-family:'DM Mono',monospace;font-size:23px;letter-spacing:1px}.cta-line.cta-direct span{font-family:'DM Sans',sans-serif;font-style:normal;font-weight:800}.cta-line.cta-direct b{font-size:22px}.cta .footer{color:#c3d0c8}.cta .visual{display:none}
</style></head><body>
<div class="slide ${role === 'cover' ? 'cover' : role === 'cta' ? 'cta' : `interior ${role}`}${hasPhoto ? ' has-photo' : ''}">
  ${role === 'cover' || role === 'cta' ? photo : paper}
  ${role === 'cover' ? `${coverBrand}<div class="cover-content"><div class="kicker">${esc(kicker)}</div>${headline}${body}</div>${footer}` : `${interiorBrand}<div class="interior-main">${role === 'cta' ? `<div>${headline}${body}${cta}</div>` : `<div>${headline}${body}</div>${visual}`}</div>${footer}`}
</div></body></html>`;
  }

  return communityEditorialHtml;
}

module.exports = { crear };
