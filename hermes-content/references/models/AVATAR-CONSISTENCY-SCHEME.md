# Esquema de Consistencia de Avatares (protocolo canonico ONIA)

> Aplica a TODOS los personajes IA (Lucia, Mara, y los que sigan). Escrito 2026-07-06
> despues de que Sergio reporto perdida de consistencia (pelo, sonrisa, dientes
> cambiando entre generaciones usando el metodo Elements+nano_banana_2).

## Diagnostico del problema

Se mezclaron DOS mecanismos de identidad que son incompatibles entre si:

| Mecanismo | Que es | Consistencia |
|---|---|---|
| **Soul** (`soul_2` + soul_id) | Modelo ENTRENADO con 8+ fotos de la persona | Alta — validado repetidas veces con prompts de texto |
| **Reference Element** (`nano_banana_2` + 1 imagen) | Una sola foto suelta como "sugerencia" de parecido | Baja — el modelo reparte fidelidad entre cara+outfit+lugar a la vez, y la cara es la que mas cede |

Soul V2 **no soporta** Reference Elements (limitacion de la plataforma, no nuestra). Por
eso, para lograr "outfit exacto de una foto real" tuve que cambiar a nano_banana_2 con la
cara como un Element mas — y eso bajo la consistencia facial. Evidencia visible en las
pruebas: forma de sonrisa, dientes y textura/volumen de pelo variaron entre las 3
generaciones (cleangirl-bathroom v1, nightout-bar, cleangirl-bathroom v2).

## Regla de oro

1. **Un solo generador de cara por personaje: el Soul.** Toda pieza donde la cara importa
   (contenido diario, redes, UGC generico) se genera con `soul_2` + soul_id + descripcion
   de texto del outfit/lugar (de la bible). Este es el metodo PRINCIPAL — probado estable.
2. **La fuente de identidad nunca se reemplaza por un output generado.** El Soul se
   entrena UNA vez desde fotos/frames REALES (o su version escalada sin generacion). Nunca
   se re-entrena ni se "ancla" desde una imagen que el mismo sistema genero antes —
   eso encadena deriva (real -> generado -> generado-de-lo-generado).
3. **Reference Elements (nano_banana_2) = herramienta SECUNDARIA, no un generador de
   identidad.** Se usa solo cuando hace falta el objeto/prenda/lugar EXACTO de una foto
   real (ej. mostrar un producto real en mano, o un mueble/vestuario muy especifico), y
   con estas condiciones obligatorias:
   - Se acepta de antemano que la cara puede variar un poco — no se promete lock perfecto.
   - Se generan 2-3 candidatos, nunca se acepta el primero a ciegas.
   - QA manual obligatorio (paso 4) antes de guardar cualquier resultado como "bueno".
4. **QA obligatorio antes de aprobar cualquier imagen:** comparar visualmente contra la
   referencia canonica del personaje (la carpeta de frames reales). Si la cara, el pelo o
   la sonrisa no calzan, se DESCARTA — no se seguye generando encima, no se guarda en el
   bible como si fuera buena.
5. **No se publica ni se deja como "definitiva" ninguna pieza generada con Elements sin
   aprobacion explicita**, precisamente porque su consistencia es mas fragil.

## Que cambia en la practica

| Necesito | Antes (mal) | Ahora (correcto) |
|---|---|---|
| Contenido diario/generico con su cara | Elements (nano_banana_2) | **`soul_2` + texto** (0.12cr, alta consistencia) |
| Mostrar un producto/prenda EXACTA de una foto | Elements (nano_banana_2) | Elements, aceptando el trade-off, con 2-3 candidatos + QA |
| Ancla de identidad para cualquier uso | Foto ya generada | Frame real (o escalado sin IA generativa) |

## Aplica a

- **Lucia** — Soul `9a0d6953-ff2e-40ba-b763-806e0d447325`. Fuente real: `pecas-source-frames/`.
- **Mara** — Soul `b8f5c353-faaf-44eb-ae5a-4e0bacfd333f`. Pendiente auditar si su ancla
  actual es frame real o generado (mismo chequeo que se hizo con Lucia).

## Que hacer con lo ya generado con Elements

Las imagenes `lucia-elements-combo-*.png` quedan como **pruebas de concepto del metodo
secundario**, no como contenido aprobado ni como referencia de identidad. No usarlas para
entrenar nada ni como ancla de nadie.
