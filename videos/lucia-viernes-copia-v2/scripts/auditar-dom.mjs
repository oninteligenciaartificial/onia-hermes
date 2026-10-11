// Auditoría pura: acumula todos los fallos; no abre navegador ni detiene el primer cuadro.
// v2: además del borde/lateral/solape de v1.1, exige (a) letra mínima por texto medida NODO por NODO (≥ 44 px en general, ≥ 48 px en los textos grandes, nunca < 40),
// (b) UNA sola idea a ≥ 50 % de opacidad por cuadro fuera de los empujes (plan.grupos), (c) el rótulo de IA en el cuadro 0 a ≥ 44 px.
export function auditarDom(rows,reads,faces,plan){
 const fallos=[];let count=0,min=Infinity;
 const add=(ok,rule,id,row,value,limit)=>{if(!ok)fallos.push({regla:rule,id,cuadro:row?.f??null,tiempo:row?.t??null,valor:value,limite:limit});};
 const push=t=>plan.costuras.some(c=>t>=c.t-.25-1e-6&&t<=c.t+1e-6);
 const TY=plan.tipografia,grandes=new Set(TY.grandes_ids),grupoDe={};for(const [g,ids] of Object.entries(plan.grupos))for(const i of ids)grupoDe[i]=g;
 for(const r of rows){if(push(r.t))continue;const visible=r.boxes.filter(b=>b.opacity>=.5);
  for(const b of visible){count++;
   add(b.y>=292,'borde superior',b.id,r,b.y,'y >= 292');
   add(b.y+b.h<=1490,'corte inferior',b.id,r,b.y+b.h,'y+h <= 1490');
   add(b.x>=80-.5&&b.x+b.w<=1000+.5,'corte lateral',b.id,r,{izquierda:b.x,derecha:b.x+b.w},'80 <= x; x+w <= 1000 (tolerancia 0,5 px)');
   const ms=b.minSize??b.size,req=grandes.has(b.id)?TY.grandes:TY.general;
   add(ms>=TY.absoluto,'letra bajo el mínimo absoluto',b.id,r,ms,`font-size >= ${TY.absoluto}`);
   add(ms>=req,grandes.has(b.id)?'letra pequeña (texto grande)':'letra pequeña',b.id,r,ms,`font-size >= ${req} en todo nodo de texto`);
   for(const face of faces[b.clip]??[]){const [x1,y1,x2,y2]=face;
    add(!(b.x<x2&&b.x+b.w>x1&&b.y<y2+40&&b.y+b.h>y1-40),'texto sobre cara',b.id,r,{texto:[b.x,b.y,b.x+b.w,b.y+b.h],cara:face},'sin intersección con cara +40 px');
    if(b.y>y2)min=Math.min(min,b.y-y2);
   }
   count+=0;
  }
  for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++){const a=visible[i],b=visible[j],dx=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),dy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);
   add(!(dx>4&&dy>4),'solape de textos',`${a.id}/${b.id}`,r,{ancho:dx,alto:dy},'intersección <= 4 px en al menos un eje');
  }
  const grupos=[...new Set(visible.map(b=>grupoDe[b.id]??b.id))];
  add(grupos.length<=1,'más de una idea a la vez',grupos.join(' + '),r,grupos,'un solo grupo de texto a >= 50 % de opacidad por cuadro (plan.grupos)');
 }
 const f0=rows.find(r=>r.f===0),first=reads.find(r=>r.id==='dato'),cta=reads.find(r=>r.id==='cta');
 add(!!f0?.boxes.some(b=>b.id==='rotulo'&&(b.minSize??b.size)>=TY.general&&b.opacity>=.9),'rótulo IA f0','rotulo',f0,f0?.boxes.find(b=>b.id==='rotulo')??null,`visible en f0 a >= ${TY.general} px (nunca < ${TY.absoluto})`);
 add(!!f0?.boxes.some(b=>b.id==='titulo'&&b.opacity>=.9),'título f0','titulo',f0,f0?.boxes.find(b=>b.id==='titulo')??null,'visible en f0');
 add(!!first&&first.a<3,'cifra antes de 3 s','dato',first?{f:Math.round(first.a*24),t:first.a}:null,first?.a??null,'inicio legible < 3 s');
 add(!!cta&&cta.duration>=2.4,'duración CTA','cta',cta?{f:Math.round(cta.a*24),t:cta.a}:null,cta?.duration??null,'legible >= 2,4 s');
 return {fallos,cajas:count,margen_minimo_menton:Number.isFinite(min)?min:null,primer_dato:first?.a??null,cta_duracion:cta?.duration??null};
}
