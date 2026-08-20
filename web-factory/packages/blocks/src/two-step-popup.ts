import { escapeAttribute, escapeHtml } from "./escape";

/**
 * two-step-popup — la captura de 10/10 de la escalera de popups.
 *
 * Sale del reel analizado en
 * hermes-content/references/video-intake/transcripciones/Instagram-DcEITCmoSHX.txt,
 * que puntua 8 popups reales del 0 al 10. El 10/10, textual: "la oferta super
 * clara y en el primer paso hacemos una PREGUNTA. Luego pedimos el correo y
 * luego el numero de telefono, y en base a los datos que recogimos podemos
 * hacer correos personalizados".
 *
 * EL EJE, y lo que separa esto de un popup de email cualquiera: el paso 1 NO
 * pide datos, pide un CLIC. Ese clic hace dos cosas a la vez —
 *   1. SEGMENTA: la respuesta viaja con el lead, asi que el seguimiento
 *      posterior puede hablar de lo que la persona dijo que queria.
 *   2. Es un MICROCOMPROMISO ("escalera de si", el 6/10 del mismo reel) que
 *      sube la conversion del paso 2.
 * Sin guardar la respuesta del paso 1 el multi-paso no sirve de nada: es un
 * popup de email con un clic extra de friccion. Por eso `answerName` no es
 * opcional de hecho — sin endpoint no se renderiza nada.
 *
 * ADAPTACION BOLIVIA: se pide WHATSAPP, no SMS. Es el canal real del comprador
 * aca; un campo "SMS" en Santa Cruz es un campo muerto. El correo queda como
 * secundario (`email: "optional"` por defecto) porque dos campos obligatorios
 * en el paso 2 tiran abajo lo que gano el paso 1.
 *
 * Lo que este bloque NO hace, a proposito:
 *   · NADA de confirmshaming. El descarte dice "Ahora no", nunca "no gracias,
 *     prefiero pagar precio completo". El propio reel castiga eso y no va con
 *     la marca.
 *   · No abre al instante ni a pantalla completa en movil: Google penaliza los
 *     intersticiales intrusivos en movil. Dispara por scroll/tiempo/salida y en
 *     movil entra como hoja inferior.
 *   · No crea un circuito de leads paralelo. El `src` viaja como campo oculto,
 *     igual que newsletter-band e inline-quote-form, y el runtime lo pisa con
 *     el `?src=` de la URL cuando viene de una campana.
 *
 * ACCESIBILIDAD: usa <dialog> nativo con showModal(), que ya trae foco atrapado
 * y cierre con Escape sin una linea de JS propia. No reimplementar eso a mano.
 *
 * ⚠️ TRAMPA YA PAGADA: bajo prefers-reduced-motion va `transition: none`, NO
 * `transition-duration: 0.01ms`. Con 0.01ms las propiedades discretas
 * (display/overlay del dialog) siguen animando y el dialogo queda ABIERTO en
 * opacity 0 — invisible y capturando clics. Esto ya nos paso.
 */

export type TwoStepPopupOption = {
  /** Valor que se guarda junto al lead. Esto ES la segmentacion. */
  value: string;
  label: string;
  /** Segunda linea bajo la etiqueta. Opcional. */
  hint?: string;
};

export type TwoStepPopupProps = {
  /** La oferta, dicha ANTES de pedir nada. Sin oferta, el popup es un 0/10. */
  offer: string;
  /** Subtitulo corto de la oferta. Opcional: el 1/10 del reel era "demasiado copy". */
  offerNote?: string;
  /** La pregunta del paso 1. Se responde con un clic, no escribiendo. */
  question: string;
  /** 2-3 opciones. Mas de 3 vuelve el paso 1 una decision, no un clic. */
  options: ReadonlyArray<TwoStepPopupOption>;
  /** Endpoint del formulario. Vacio = no se renderiza nada (un popup muerto es peor que ninguno). */
  action: string;
  /** Titulo del paso 2. */
  step2Heading?: string;
  /** Nombre del campo que lleva la respuesta del paso 1 al pipeline. */
  answerName?: string;
  /** Atribucion enviada como `src`, igual que el resto de los bloques de captura. */
  source?: string;
  /** Correo: obligatorio, opcional (defecto) o sin campo. */
  email?: "required" | "optional" | "off";
  whatsappLabel?: string;
  whatsappHint?: string;
  emailLabel?: string;
  submitLabel?: string;
  /** Que recibe la persona y cada cuanto. Va bajo el boton. */
  note?: string;
  /** Texto de descarte. Neutro siempre: nada de confirmshaming. */
  dismissLabel?: string;
  /** Mensaje tras enviar. */
  successHeading?: string;
  successCopy?: string;
  /** Cuando aparece. Nunca al instante. */
  trigger?: {
    /** % de scroll de la pagina (0-100). Defecto 45. */
    scroll?: number;
    /** Segundos desde la carga. Sin valor, no dispara por tiempo. */
    delaySeconds?: number;
    /** Intencion de salida (solo escritorio con puntero fino). */
    exitIntent?: boolean;
  };
  /** Dias antes de volver a mostrarlo tras un descarte. Defecto 14. */
  dismissDays?: number;
  /** Renderiza el dialog ya abierto y en flujo. Para la galeria y previews, no para produccion. */
  previewOpen?: boolean;
  id?: string;
};

const DEFAULTS = {
  step2Heading: "¿A donde te la mandamos?",
  answerName: "interes",
  whatsappLabel: "Tu WhatsApp",
  whatsappHint: "Ej: 70012345",
  emailLabel: "Tu correo (opcional)",
  submitLabel: "Quiero la oferta",
  dismissLabel: "Ahora no",
  successHeading: "Listo.",
  successCopy: "Te escribimos por WhatsApp en breve.",
  dismissDays: 14,
  scroll: 45,
} as const;

export function renderTwoStepPopup({
  offer,
  offerNote,
  question,
  options,
  action,
  step2Heading = DEFAULTS.step2Heading,
  answerName = DEFAULTS.answerName,
  source,
  email = "optional",
  whatsappLabel = DEFAULTS.whatsappLabel,
  whatsappHint = DEFAULTS.whatsappHint,
  emailLabel = DEFAULTS.emailLabel,
  submitLabel = DEFAULTS.submitLabel,
  note,
  dismissLabel = DEFAULTS.dismissLabel,
  successHeading = DEFAULTS.successHeading,
  successCopy = DEFAULTS.successCopy,
  trigger,
  dismissDays = DEFAULTS.dismissDays,
  previewOpen = false,
  id = "oferta",
}: TwoStepPopupProps): string {
  const headline = offer.trim();
  const ask = question.trim();
  const endpoint = action.trim();
  const choices = options.filter((o) => o.value.trim() && o.label.trim());

  // Tres cosas sin las cuales esto no es el 10/10 sino ruido: la oferta, la
  // pregunta con opciones, y un endpoint real donde caiga el lead.
  if (!headline || !ask || choices.length === 0 || !endpoint) return "";

  const titleId = `${id}-title`;
  const stepId = `${id}-step`;
  const q = `${id}-question`;

  const optionButtons = choices
    .map(
      (o, i) => `
          <button class="wf-pop-option" type="button" data-wf-pop-value="${escapeAttribute(o.value.trim())}"${i === 0 ? " autofocus" : ""}
                  aria-label="${escapeAttribute(`${ask} ${o.label.trim()}`)}">
            <span class="wf-pop-option-num">${i + 1}</span>
            <span class="wf-pop-option-text">
              <span class="wf-pop-option-label">${escapeHtml(o.label.trim())}</span>
              ${o.hint?.trim() ? `<span class="wf-pop-option-hint">${escapeHtml(o.hint.trim())}</span>` : ""}
            </span>
          </button>`,
    )
    .join("");

  const emailField =
    email === "off"
      ? ""
      : `<label class="wf-pop-field">
            <span class="wf-pop-label">${escapeHtml(emailLabel)}</span>
            <input class="wf-pop-input" type="email" name="email" autocomplete="email"
                   placeholder="nombre@correo.com"${email === "required" ? " required" : ""}>
          </label>`;

  return `
    <dialog class="wf-pop" id="${escapeAttribute(id)}" aria-labelledby="${titleId}"
            ${previewOpen ? "open" : ""}
            data-wf-pop
            data-wf-pop-scroll="${trigger?.scroll ?? DEFAULTS.scroll}"
            ${trigger?.delaySeconds ? `data-wf-pop-delay="${trigger.delaySeconds}"` : ""}
            ${trigger?.exitIntent ? `data-wf-pop-exit="1"` : ""}
            data-wf-pop-days="${dismissDays}">
      <div class="wf-pop-card">
        <button class="wf-pop-close" type="button" data-wf-pop-close aria-label="Cerrar">&times;</button>

        <p class="wf-pop-step" id="${stepId}" aria-live="polite">Paso <span data-wf-pop-n>1</span> de 2</p>
        <h2 class="wf-pop-title" id="${titleId}">${escapeHtml(headline)}</h2>
        ${offerNote?.trim() ? `<p class="wf-pop-note">${escapeHtml(offerNote.trim())}</p>` : ""}

        <!-- PASO 1 - un clic, cero campos. Es el paso que segmenta. -->
        <div class="wf-pop-panel" data-wf-pop-panel="1">
          <p class="wf-pop-question" id="${q}">${escapeHtml(ask)}</p>
          <div class="wf-pop-options" role="group" aria-labelledby="${q}">${optionButtons}
          </div>
        </div>

        <!-- PASO 2 - recien aca se pide un dato. -->
        <form class="wf-pop-panel" data-wf-pop-panel="2" hidden
              action="${escapeAttribute(endpoint)}" method="post">
          <p class="wf-pop-question">${escapeHtml(step2Heading)}</p>
          <p class="wf-pop-chosen" data-wf-pop-chosen hidden>Elegiste: <b data-wf-pop-chosen-v></b></p>

          <label class="wf-pop-field">
            <span class="wf-pop-label">${escapeHtml(whatsappLabel)}</span>
            <input class="wf-pop-input" type="tel" name="whatsapp" required
                   inputmode="tel" autocomplete="tel" pattern="[0-9+()\\s-]{7,20}"
                   placeholder="${escapeAttribute(whatsappHint)}">
          </label>
          ${emailField}

          <input type="hidden" name="${escapeAttribute(answerName)}" data-wf-pop-answer value="">
          <input type="hidden" name="src" data-wf-pop-src value="${escapeAttribute(source?.trim() ?? "")}">

          <button class="wf-pop-submit" type="submit">${escapeHtml(submitLabel)}</button>
          ${note?.trim() ? `<p class="wf-pop-fine">${escapeHtml(note.trim())}</p>` : ""}
          <button class="wf-pop-dismiss" type="button" data-wf-pop-close>${escapeHtml(dismissLabel)}</button>
        </form>

        <div class="wf-pop-panel" data-wf-pop-panel="3" hidden>
          <p class="wf-pop-question">${escapeHtml(successHeading)}</p>
          <p class="wf-pop-note">${escapeHtml(successCopy)}</p>
        </div>
      </div>
    </dialog>
  `;
}

/**
 * Estilos con tokens del cliente. En movil entra como hoja inferior en vez de
 * tapar la pantalla entera: la guia de Google sobre intersticiales intrusivos
 * castiga lo segundo, y una landing que no indexa no trae un solo prospecto.
 * Nota: sin backticks en los comentarios — esto vive dentro de un template
 * literal y uno suelto corta la hoja a la mitad.
 */
export const TWO_STEP_POPUP_CSS = `
/*
 * El bloque trae su propio border-box. Sin esto, en movil el padding de la
 * tarjeta se suma al 100% de ancho y la hoja se sale de la pantalla llevandose
 * el boton de cerrar: se vio en la captura de Pixel 7. Un bloque que publica su
 * hoja de estilos no puede depender de que la pagina anfitriona traiga reset.
 */
.wf-pop, .wf-pop * { box-sizing: border-box; }

.wf-pop {
  padding: 0;
  border: 0;
  background: transparent;
  max-width: 100%;
  max-height: 100%;
  overflow: visible;
}

.wf-pop::backdrop {
  background: color-mix(in srgb, var(--color-fg) 55%, transparent);
  backdrop-filter: blur(2px);
}

.wf-pop-card {
  position: relative;
  width: min(440px, calc(100vw - 32px));
  padding: 34px 30px 26px;
  border-radius: 20px;
  background: var(--color-bg);
  color: var(--color-fg);
  box-shadow: 0 40px 90px -30px rgba(10, 17, 38, .5);
  text-align: left;
}

.wf-pop-close {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: color-mix(in srgb, var(--color-fg) 55%, transparent);
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
}

.wf-pop-close:hover { color: var(--color-fg); }

.wf-pop-step {
  margin: 0 0 10px;
  font-size: .72rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-fg) 50%, transparent);
}

.wf-pop-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4.4vw, 1.95rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.wf-pop-note {
  margin: 10px 0 0;
  color: color-mix(in srgb, var(--color-fg) 72%, transparent);
  line-height: 1.5;
  font-size: .93rem;
}

.wf-pop-question {
  margin: 22px 0 12px;
  font-weight: 600;
  font-size: 1rem;
}

.wf-pop-options {
  display: grid;
  gap: 8px;
}

/* El paso 1 se responde con un clic: la opcion es un boton grande, no un radio. */
.wf-pop-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 16%, transparent);
  border-radius: 14px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color .2s var(--wf-ease, ease), background-color .2s var(--wf-ease, ease);
}

.wf-pop-option:hover {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.wf-pop-option-num {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 16%, transparent);
  color: var(--color-primary);
  font-size: .78rem;
  font-weight: 700;
}

.wf-pop-option-text { display: block; }
.wf-pop-option-label { display: block; font-weight: 600; }

.wf-pop-option-hint {
  display: block;
  margin-top: 2px;
  font-size: .82rem;
  color: color-mix(in srgb, var(--color-fg) 60%, transparent);
}

/*
 * Pastilla en linea, no barra a todo el ancho: a todo el ancho se leia como un
 * campo deshabilitado del formulario. Se vio en la captura del paso 2.
 */
.wf-pop-chosen {
  display: inline-block;
  margin: 0 0 14px;
  padding: 6px 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: color-mix(in srgb, var(--color-fg) 78%, transparent);
  font-size: .82rem;
}

.wf-pop-chosen b { color: var(--color-fg); }

.wf-pop-field { display: block; margin-bottom: 12px; }

.wf-pop-label {
  display: block;
  margin-bottom: 6px;
  font-size: .78rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-fg) 62%, transparent);
}

.wf-pop-input {
  width: 100%;
  min-height: 50px;
  padding: 0 16px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 20%, transparent);
  border-radius: 12px;
  background: transparent;
  color: inherit;
  font: inherit;
}

.wf-pop-option:focus-visible,
.wf-pop-input:focus-visible,
.wf-pop-submit:focus-visible,
.wf-pop-close:focus-visible,
.wf-pop-dismiss:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.wf-pop-submit {
  width: 100%;
  min-height: 52px;
  margin-top: 6px;
  border: 0;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-bg);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: filter .2s var(--wf-ease, ease);
}

.wf-pop-submit:hover { filter: brightness(1.08); }

.wf-pop-fine {
  margin: 12px 0 0;
  font-size: .8rem;
  color: color-mix(in srgb, var(--color-fg) 58%, transparent);
}

/* Descarte neutro. Nada de confirmshaming: no se castiga al que dice que no. */
.wf-pop-dismiss {
  display: block;
  margin: 14px auto 0;
  border: 0;
  background: transparent;
  color: color-mix(in srgb, var(--color-fg) 55%, transparent);
  font: inherit;
  font-size: .86rem;
  text-decoration: underline;
  cursor: pointer;
}

.wf-pop[open] { animation: wf-pop-in .28s var(--wf-ease, ease); }
.wf-pop[open]::backdrop { animation: wf-pop-fade .28s var(--wf-ease, ease); }

/* previewOpen: abierto sin showModal(), se muestra en flujo (galeria/preview). */
.wf-pop[open]:not(:modal) { position: static; margin: 24px auto; }

@keyframes wf-pop-in { from { opacity: 0; transform: translateY(14px); } }
@keyframes wf-pop-fade { from { opacity: 0; } }

/* Movil: hoja inferior, no pantalla completa. */
@media (max-width: 560px) {
  .wf-pop {
    margin: auto 0 0;
    width: 100%;
    max-width: 100%;
  }
  /*
   * width: 100% y NO 100vw. Con 100vw la tarjeta mide el ancho del viewport
   * DENTRO de un dialog ya centrado, se desborda a la derecha y el boton de
   * cerrar queda fuera de pantalla. Se vio en la captura de movil.
   */
  .wf-pop-card {
    width: 100%;
    border-radius: 20px 20px 0 0;
    padding: 28px 20px 20px;
  }
  .wf-pop[open] { animation: wf-pop-up .28s var(--wf-ease, ease); }
  @keyframes wf-pop-up { from { transform: translateY(100%); } }
}

/*
 * ⚠️ transition: none — NO transition-duration: 0.01ms.
 * Con 0.01ms las propiedades discretas del dialog siguen animando y el dialogo
 * queda abierto en opacity 0: invisible y capturando clics. Ya nos paso.
 */
@media (prefers-reduced-motion: reduce) {
  .wf-pop,
  .wf-pop[open],
  .wf-pop[open]::backdrop,
  .wf-pop-option,
  .wf-pop-submit {
    animation: none;
    transition: none;
  }
  .wf-pop::backdrop { backdrop-filter: none; }
}
`.trim();

/**
 * Runtime del popup. Vanilla, sin dependencias, igual que motion.ts: los sitios
 * generados son HTML estatico.
 *
 * El foco atrapado y el Escape los da showModal() nativo — no se reimplementan.
 * Lo que si hace este runtime: disparar tarde (nunca al instante), recordar el
 * descarte, pasar de paso guardando la respuesta, y pisar el `src` del campo
 * oculto con el `?src=` de la URL cuando la visita viene de una campana, para
 * que el lead caiga en el MISMO circuito de atribucion que ya corre en
 * produccion y no en uno paralelo.
 */
export const TWO_STEP_POPUP_JS = `
(function(){
  var pops=[].slice.call(document.querySelectorAll('[data-wf-pop]'));
  if(!pops.length||!window.HTMLDialogElement)return;
  var urlSrc=new URLSearchParams(location.search).get('src');

  pops.forEach(function(dlg){
    var key='wf-pop:'+dlg.id;
    var days=parseInt(dlg.getAttribute('data-wf-pop-days'),10)||14;
    var seen=0;
    try{seen=parseInt(localStorage.getItem(key),10)||0;}catch(e){}
    if(seen===-1)return;                                  // ya convirtio: nunca mas
    if(seen&&Date.now()-seen<days*864e5)return;           // descarto hace poco

    var panels={};
    [].forEach.call(dlg.querySelectorAll('[data-wf-pop-panel]'),function(p){
      panels[p.getAttribute('data-wf-pop-panel')]=p;
    });
    var answer=dlg.querySelector('[data-wf-pop-answer]');
    var srcField=dlg.querySelector('[data-wf-pop-src]');
    var chosen=dlg.querySelector('[data-wf-pop-chosen]');
    var stepN=dlg.querySelector('[data-wf-pop-n]');
    if(urlSrc&&srcField)srcField.value=urlSrc;

    function remember(v){try{localStorage.setItem(key,String(v));}catch(e){}}
    function open(){
      if(dlg.open)return;
      dlg.showModal();                                    // foco atrapado + Escape nativos
      teardown();
    }
    function step(n){
      for(var k in panels)panels[k].hidden=(k!==String(n));
      if(stepN)stepN.textContent=String(Math.min(n,2));
    }

    // Se recuerda el descarte: un popup que reaparece en cada scroll es el que
    // hace que la gente odie los popups.
    // 'cancel' (Escape) va aparte de 'close' A PROPOSITO: el evento close se
    // dispara en una tarea ENCOLADA, asi que si la persona aprieta Escape y se
    // va de la pagina en el mismo instante, el descarte se pierde y el popup la
    // vuelve a interrumpir en la proxima visita. 'cancel' es sincrono.
    function descartar(){
      if(dlg.getAttribute('data-wf-pop-done')!=='1')remember(Date.now());
    }
    dlg.addEventListener('cancel',descartar);
    dlg.addEventListener('close',descartar);
    [].forEach.call(dlg.querySelectorAll('[data-wf-pop-close]'),function(b){
      b.addEventListener('click',function(){dlg.close();});
    });
    dlg.addEventListener('click',function(e){ if(e.target===dlg)dlg.close(); });

    // PASO 1: el clic guarda la respuesta y recien ahi se pide el dato.
    [].forEach.call(dlg.querySelectorAll('[data-wf-pop-value]'),function(btn){
      btn.addEventListener('click',function(){
        var v=btn.getAttribute('data-wf-pop-value');
        if(answer)answer.value=v;
        if(chosen){
          chosen.querySelector('[data-wf-pop-chosen-v]').textContent=btn.querySelector('.wf-pop-option-label').textContent;
          chosen.hidden=false;
        }
        step(2);
        var first=panels['2']&&panels['2'].querySelector('input:not([type=hidden])');
        if(first)first.focus();
      });
    });

    var form=panels['2'];
    if(form&&form.tagName==='FORM'){
      form.addEventListener('submit',function(){
        dlg.setAttribute('data-wf-pop-done','1');
        remember(-1);                                     // convirtio: no volver a molestar
      });
    }

    // Disparo: nunca al instante. Scroll, tiempo o salida (solo puntero fino).
    var offs=[];
    function teardown(){offs.forEach(function(f){f();});offs=[];}
    function on(t,ev,fn,opt){t.addEventListener(ev,fn,opt);offs.push(function(){t.removeEventListener(ev,fn,opt);});}

    var pct=parseInt(dlg.getAttribute('data-wf-pop-scroll'),10);
    if(pct>0){
      on(window,'scroll',function(){
        var h=document.documentElement.scrollHeight-window.innerHeight;
        if(h>0&&(window.scrollY/h)*100>=pct)open();
      },{passive:true});
    }
    var delay=parseInt(dlg.getAttribute('data-wf-pop-delay'),10);
    if(delay>0){var t=setTimeout(open,delay*1000);offs.push(function(){clearTimeout(t);});}
    if(dlg.getAttribute('data-wf-pop-exit')==='1'&&window.matchMedia&&window.matchMedia('(pointer:fine)').matches){
      on(document,'mouseout',function(e){ if(!e.relatedTarget&&e.clientY<=0)open(); });
    }
  });
})();
`.trim();

/** Script listo para pegar antes de </body>. */
export function renderTwoStepPopupScript(): string {
  return `<script>${TWO_STEP_POPUP_JS}</script>`;
}
