// Auditoría pura: acumula todos los fallos; no abre navegador ni detiene el primer cuadro.
export function auditarDom(rows,reads,faces,plan){
 const fallos=[];let count=0,min=Infinity;
 const add=(ok,rule,id,row,value,limit)=>{if(!ok)fallos.push({regla:rule,id,cuadro:row?.f??null,tiempo:row?.t??null,valor:value,limite:limit});};
 const push=t=>plan.costuras.some(c=>t>=c.t-.25-1e-6&&t<=c.t+1e-6);
 for(const r of rows){if(push(r.t))continue;const visible=r.boxes.filter(b=>b.opacity>=.5);
  for(const b of visible){count++;
   add(b.y>=292,'borde superior',b.id,r,b.y,'y >= 292');
   add(b.y+b.h<=1490,'corte inferior',b.id,r,b.y+b.h,'y+h <= 1490');
   add(b.x>=80-.5&&b.x+b.w<=1000+.5,'corte lateral',b.id,r,{izquierda:b.x,derecha:b.x+b.w},'80 <= x; x+w <= 1000 (tolerancia 0,5 px)');
   add(b.size>=34,'letra pequeña',b.id,r,b.size,'font-size >= 34');
   const c=plan.clips.find(c=>b.clip==='overlay-'+c.id);
   if(c){const frame=Math.round((r.t-c.a)*24),near=faces[c.id]?.filas.filter(a=>Math.abs(a[0]-frame)<=2)??[];
    add(near.length>0,'caja cara ausente',b.id,r,{clip:c.id,cuadro_fuente:frame},'caja medida a ±2 cuadros');
    for(const [sourceFrame,face] of near){const [x1,y1,x2,y2]=face;
     add(!(b.x<x2&&b.x+b.w>x1&&b.y<y2+40&&b.y+b.h>y1-40),'texto sobre cara',b.id,r,{texto:[b.x,b.y,b.x+b.w,b.y+b.h],cara:face,cuadro_fuente:sourceFrame},'sin intersección con cara +40 px');
     if(b.y>y2)min=Math.min(min,b.y-y2);
    }
   }
  }
  for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++){const a=visible[i],b=visible[j],dx=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),dy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);
   add(!(dx>4&&dy>4),'solape de textos',`${a.id}/${b.id}`,r,{ancho:dx,alto:dy},'intersección <= 4 px en al menos un eje');
  }
 }
 const f0=rows.find(r=>r.f===0),first=reads.find(r=>r.id==='dato-m1'),cta=reads.find(r=>r.id==='cta');
 add(!!f0?.boxes.some(b=>b.id==='rotulo'&&b.size===40&&b.opacity>=.9),'rótulo IA f0','rotulo',f0,f0?.boxes.find(b=>b.id==='rotulo')??null,'visible en f0 a 40 px');
 add(!!f0?.boxes.some(b=>b.id==='titulo'&&b.opacity>=.9),'título f0','titulo',f0,f0?.boxes.find(b=>b.id==='titulo')??null,'visible en f0');
 add(!!first&&first.a<3,'cifra antes de 3 s','dato-m1',first?{f:Math.round(first.a*24),t:first.a}:null,first?.a??null,'inicio legible < 3 s');
 add(!!cta&&cta.duration>=2.4,'duración CTA','cta',cta?{f:Math.round(cta.a*24),t:cta.a}:null,cta?.duration??null,'legible >= 2,4 s');
 return {fallos,cajas:count,margen_minimo_menton:Number.isFinite(min)?min:null,primer_dato:first?.a??null,cta_duracion:cta?.duration??null};
}
