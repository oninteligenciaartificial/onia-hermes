# Bolivian TR4 / AS700 - auditoria tecnica local estatica 2026-06-24

## Resumen ejecutivo

Se realizo una auditoria tecnica local, estatica y autorizada del paquete copiado
desde USB para entender la estructura del sistema TR4 / AS700 sin ejecutar
binarios, sin conectarse a servidores externos, sin extraer credenciales y sin
consultar datos productivos de Bolivian.

Resultado principal: el paquete si contiene el ejecutable principal `as700.exe`
y suficientes dependencias para entender tecnologia, runtime, modulos, tablas
referenciadas y documentacion historica. No contiene codigo fuente
PowerBuilder, base de datos productiva ni configuracion final de conexion.

El hallazgo mas importante para Onia es que TR4 debe mantenerse como sistema
externo/adaptador. La ruta comercial y tecnica correcta sigue siendo:
exportaciones manuales, importadores asistidos o conectores read-only aprobados
por Bolivian; no prometer escritura ni integracion en tiempo real antes de una
fase formal con el responsable tecnico.

## Alcance y limites

### Alcance ejecutado

- Inventario local del USB y copia local.
- Clasificacion por extensiones, carpetas y tamanos.
- Revision estatica de ejecutables, firmas y hashes.
- Identificacion de tecnologias y dependencias.
- Extraccion estatica de cadenas no sensibles desde binarios para mapear
  modulos, tablas, rutas y tipo de conexion.
- Revision de documentacion tecnica incluida en `referencia_estatica`.

### Limites aplicados

- No se ejecuto `as700.exe`.
- No se ejecuto ningun flujo del sistema.
- No se conecto a `server-bg`, unidad `T:`, unidad `P:` ni otra red.
- No se imprimieron ni buscaron valores de credenciales, tokens o claves.
- No se copiaron bases de datos productivas ni documentos operativos.
- No se hizo ingenieria inversa profunda ni descompilacion.

## Evidencia local

### Origen y copia local

Origen inspeccionado:

```text
D:\AS700_scrape
```

Copia local de trabajo:

```text
C:\dev\datasets\AS700_scrape
```

Validacion de copia:

```text
SourceFiles : 1674
DestFiles   : 1674
SourceBytes : 271929119
DestBytes   : 271929119
Match       : True
```

### Ejecutables detectados

```text
C:\dev\datasets\AS700_scrape\as700.exe
C:\dev\datasets\AS700_scrape\pbcef\pbcefclient.exe
```

`as700.exe`:

```text
Bytes       : 2971648
SHA256      : BA19A050404AC69CBF1F3AF5320035B52ED476EDDA98033389F0D8281CD7C90F
Signature   : NotSigned
Product     : PowerBuilder Enterprise Series
Company     : Appeon
Description : Appeon Product File
```

`pbcefclient.exe`:

```text
Bytes       : 760072
SHA256      : 27294278B130DF0725F012A24CEBB5CD2DDC5A4BE9F313252E8C7A218E9E784B
Signature   : Valid
Signer      : Appeon Inc.
```

## Inventario de contenido

### Carpetas principales

```text
pbcef                  71 files   145404081 bytes
theme                 745 files     9917498 bytes
theme190              705 files     8243844 bytes
referencia_estatica     7 files      367465 bytes
```

### Extensiones principales

```text
.dll        133 files  205507008 bytes
.pak         58 files   27218205 bytes
.png        581 files   10711332 bytes
.dat          1 file    10326688 bytes
.bmp        815 files    7002656 bytes
.pbx          2 files    4673024 bytes
.exe          2 files    3731720 bytes
.bin          3 files     984908 bytes
.ocx          1 file      558288 bytes
.json        20 files     516432 bytes
.txt          7 files     275022 bytes
.pbd          1 file      192512 bytes
.ini          4 files     162050 bytes
.db           4 files      31744 bytes
.ico         40 files      28480 bytes
```

### Archivos grandes relevantes

```text
pbcef\libcef.dll                  92759304
pbcef\icudtl.dat                  10326688
pbvm.dll                           9212624
gsdll32.dll                        8818688
pdflib.dll                         7493328
pbdwe.dll                          5733072
mfc140u.dll                        4869496
pbresource.dll                     4019408
pbnismtp2017.pbx                   3459072
pbUIS.dll                          3438288
libcurl.dll                        3311312
as700.exe                          2971648
```

## Tecnologias detectadas

### Tecnologia base

- PowerBuilder / Appeon.
- Aplicacion Windows de escritorio.
- Runtime PowerBuilder empaquetado junto al ejecutable.

Evidencia:

- `as700.exe` identifica `PowerBuilder Enterprise Series` y `Appeon`.
- Presencia de `pbvm.dll`, `pbdwe.dll`, `pbresource.dll`, `pbdwr220.pbd`,
  `PBDOM.pbx`, `pbUIS.dll`, `pbshr.dll`.

### Base de datos y conectividad

Tecnologias probables:

- SQL Server.
- OLE DB.
- ODBC.
- MSOLEDBSQL.
- Soporte generico Appeon para SQL Server, ODBC y Oracle.

Evidencia de archivos:

```text
Appeon.DB.SQLServer.dll
Appeon.DB.Odbc.dll
Appeon.DB.Oracle.dll
Microsoft.Data.SqlClient.dll
pbodb.dll
pbodb.ini
pbmsoledbsql.dll
pbsnc.dll
pbsyc.dll
```

Cadenas embebidas relevantes no sensibles en `as700.exe`:

```text
OLEDB
PROVIDER='SQLOLEDB', DATASOURCE='
PROVIDERSTRING='database=
MSOLEDBSQL SQL Server
Provider='MSOLEDBSQL19',TrustServerCertificate=1, Encrypt=2
SQLCA ERROR - No pudo establecer conexion
```

No se encontro en claro una cadena completa con servidor, usuario o password.

### UI, web embebido y recursos

- CEF/Chromium embebido: carpeta `pbcef`.
- Temas visuales PowerBuilder/Appeon: `theme` y `theme190`.
- Recursos de iconos/imagenes empaquetados parcialmente en carpetas de temas.

Evidencia:

```text
pbcef\libcef.dll
pbcef\pbcefclient.exe
pbcef\locales\*.pak
theme\*\theme.json
theme190\*\theme.json
```

### PDF, mapas, texto y comunicaciones

- PDF: `pdflib.dll`, `gsdll32.dll`, `pbPDF.dll`, `pbpdfbuilder.dll`.
- Mapas: `GMap.NET.Core.dll`, `GMap.NET.WindowsForms.dll`.
- HTTP/REST/JSON/OAuth: `pbhttpclient.dll`, `pbrestclient.dll`,
  `pbjson.dll`, `pboauth.dll`, `libcurl.dll`.
- SMTP: `pbsmtpclient.dll`, `pbnismtp2017.pbx`.
- Texto/documentos: librerias `tx31_*`.

## Archivos importantes para entender el sistema

Prioridad alta:

```text
C:\dev\datasets\AS700_scrape\as700.exe
C:\dev\datasets\AS700_scrape\referencia_estatica\tr4hisFuncional.txt
C:\dev\datasets\AS700_scrape\referencia_estatica\tr4his.txt
C:\dev\datasets\AS700_scrape\referencia_estatica\TR4HISv3.0.0.txt
C:\dev\datasets\AS700_scrape\referencia_estatica\TR4HISv2.2.0.txt
C:\dev\datasets\AS700_scrape\manifest.json
C:\dev\datasets\AS700_scrape\pbodb.ini
```

Prioridad media:

```text
C:\dev\datasets\AS700_scrape\pbdwr220.pbd
C:\dev\datasets\AS700_scrape\PBDOM.pbx
C:\dev\datasets\AS700_scrape\pbnismtp2017.pbx
C:\dev\datasets\AS700_scrape\Appeon.DB.*.json
C:\dev\datasets\AS700_scrape\Appeon.DB.*.dll
```

## Documentacion incluida

La carpeta `referencia_estatica` contiene historicos funcionales y tecnicos:

```text
tr4his.txt
tr4hisFuncional.txt
TR4HISv2.2.0.txt
TR4HISv3.0.0.txt
manifest.json
pbodb.ini
runtimepackage.ini
```

Temas detectados en los historicos:

- Cambios de RUC a NIT.
- Compras y ventas.
- Libro de ventas y compras controladas.
- Bancos y transferencias.
- Punto de venta.
- Inventario fisico.
- Existencias.
- Produccion.
- Recursos humanos.
- Faena / frigorifico.
- Ordenes de trabajo.
- Control de lotes.
- Lineas de credito.
- Estacion de pesaje.
- Modulos por empresa/vertical como Weitnauer/Dufry, Fridosa, GIR/IMR.

## Mapa funcional probable

El ejecutable y los documentos sugieren que TR4 es un ERP modular.

Prefijos funcionales detectados:

```text
as = administracion / seguridad / usuarios / menu
cg = contabilidad
cp = cuentas / personas / credito
iv = inventario / ventas / compras / punto de venta
ts = tesoreria / bancos / transferencias
rh = recursos humanos
pr = produccion
fr = faena / frigorifico
ta = talleres / ordenes de trabajo
we = punto de venta / operaciones especificas
sa = caja / servicios / flujos / operaciones complementarias
```

Modulos frecuentes detectados en `as700.exe`:

```text
as023
as007
as900_01w1
as003
as900_27
as900_11
as900_90
as900_700
as900_01
as900_71
as700_02w1
as006_09dc1
as004
as900_01dc1
as020
```

Tambien aparecen modulos de negocio:

```text
cg250, cg300, cg305, cg310, cg315, cg400
cp300, cp350, cp400, cp510
iv250, iv256, iv260, iv262, iv263, iv264, iv300, iv470, iv480, iv500, iv530, iv550, iv560
ts250, ts260, ts300, ts310, ts330, ts350
rh250, rh500, rh560
pr250, pr500, pr550, pr555, pr600, pr605
fr056, fr058, fr250, fr260
ta250, ta260, ta300, ta310
we250, we300, we400, we500, we550
sa250, sa255, sa260, sa275, sa280, sa290, sa300
```

## Tablas detectadas por analisis estatico

Tablas referenciadas directamente en cadenas SQL dentro de `as700.exe`:

```text
as003
as004
as007
as011
as020
as023
as066
as067
cp005
```

Interpretacion probable:

- `as003`: parametros/globales del sistema.
- `as004`: usuarios/personas de sistema.
- `as007`: permisos o asignaciones por usuario/aplicacion.
- `as020`: defaults/configuracion por usuario.
- `as023`: catalogo/estado de aplicaciones/modulos.
- `cp005`: personas.

Esta interpretacion es inferencia desde nombres y consultas embebidas; debe
validarse con esquema real o documentacion del proveedor si se avanza a una
fase formal.

## Rutas externas detectadas

El ejecutable referencia recursos en:

```text
P:\TR4\as\graph\...
P:\TR4\as\graph\pngnvo\...
P:\TR4\as\graph\pngnvo_color\...
P:\TR4\as\graph\pngnvo_dark\...
```

Ejemplos de recursos referenciados:

```text
Info.png
user.png
password.png
GerenciaGeneral.png
Inventario.png
CuentasXCobrar.png
CuentasXPagar.png
Tesoreria.png
Contabilidad.png
Produccion.png
PuntodeVenta.png
SFE.png
TR4Movil.png
```

Implicacion: la copia actual puede ser util para estudio estatico, pero puede
no ejecutar visualmente completo si faltan recursos de `P:\TR4`. No se debe
copiar esa ruta sin autorizacion; si se aprueba, copiar solo recursos visuales
necesarios, no datos operativos.

## Datos sensibles y privacidad

No se detectaron archivos tipicos de datos operativos copiados:

```text
*.xls
*.xlsx
*.csv
*.mdb
*.accdb
*.sqlite
*.bak
*.backup
*.zip
*.rar
*.7z
*.pdf
*.doc
*.docx
*.sql
```

Los `.db` detectados son `Thumbs.db` en carpetas de temas. El `.dat` principal
es `pbcef\icudtl.dat`, propio de Chromium/CEF.

No se encontro una cadena de conexion completa en claro. Si existe configuracion
real de conexion, probablemente vive en el entorno de la maquina cliente,
registro de Windows, DSN ODBC, archivos no copiados o parametros del servidor.

## Hallazgos clave para Onia

1. Si hay suficiente evidencia para documentar TR4 como ERP legado
   PowerBuilder/Appeon.
2. Si hay suficiente evidencia para mapear modulos de negocio y preparar una
   entrevista tecnica con Bolivian.
3. Si hay suficiente evidencia para disenar un adaptador Onia alrededor de
   exportaciones/importaciones aprobadas.
4. No hay suficiente evidencia para prometer integracion directa a base de
   datos ni ejecucion local completa.
5. No conviene vender "reemplazo de TR4" en esta etapa. Conviene vender
   auditoria, capa gerencial, importadores, dashboard y flujos complementarios.

## Lo que se puede construir con esta auditoria

### Entregable inmediato

- Mapa de TR4 por modulos.
- Matriz de tablas detectadas vs posibles procesos.
- Checklist de informacion que Bolivian debe aprobar para una fase 1.
- Propuesta de "TR4 Adapter" read-only/manual.
- Base para Bolivian Electric OS sin tocar TR4 productivo.

### Producto Onia viable

Primera version vendible:

```text
Bolivian Electric OS - Fase 0/1
```

Incluye:

- Auditoria de procesos reales.
- Inventario de TR4 y dependencias.
- Mapa de exportaciones disponibles.
- CRM gerencial con carga manual/aprobada.
- Dashboard inicial con datos de muestra o exportaciones saneadas.
- StockCam / inventario con evidencia, sin escritura en TR4.

No incluye:

- Escritura en TR4.
- Conexion directa a base de datos productiva.
- Extraccion de datos historicos.
- Soporte TI de servidores.
- Garantia de integracion en tiempo real.

## Plan recomendado

### Fase 0 - Auditoria segura

Objetivo: entender procesos y datos sin tocar produccion.

Acciones:

1. Documentar pantallas y procesos con capturas saneadas.
2. Pedir lista de reportes/exportaciones que TR4 ya genera.
3. Identificar responsables por area: ventas, inventario, compras, tesoreria,
   contabilidad, gerencia.
4. Mapear que se hace dentro de TR4 y que se hace fuera en Excel/WhatsApp/papel.
5. Definir 3 reportes gerenciales iniciales de alto valor.

### Fase 1 - Capa Onia sin integracion directa

Objetivo: entregar valor sin riesgo tecnico.

Acciones:

1. Crear dashboard con archivos aprobados o datos de muestra.
2. Crear importador manual CSV/Excel si Bolivian aprueba exportaciones.
3. Crear CRM operativo separado.
4. Crear flujo StockCam para evidencia de inventario.
5. Crear reglas de acceso por rol.

### Fase 2 - Integracion read-only formal

Objetivo: automatizar lectura sin escribir en TR4.

Precondiciones:

- Responsable tecnico de Bolivian asignado.
- Motor de base de datos confirmado.
- Usuario read-only o vista SQL read-only creada por tecnico de Bolivian.
- Alcance de tablas/campos aprobado por gerencia.
- Acuerdo de tratamiento de datos.

### Fase 3 - Integracion avanzada

Solo despues de operar Fase 1/2 y validar valor:

- Sincronizacion programada.
- API interna si existe.
- Lectura por vistas controladas.
- Escritura o bidireccionalidad solo si Bolivian y el tecnico lo aprueban por
  escrito.

## Preguntas tecnicas para Bolivian

Preguntas minimas y no invasivas:

1. Que reportes exporta TR4 actualmente?
2. En que formatos exporta: Excel, CSV, PDF, TXT?
3. Que areas usan TR4 todos los dias?
4. Que procesos hacen fuera de TR4 aunque deberian estar conectados?
5. Que reportes gerenciales piden mas seguido?
6. Hay tecnico responsable del servidor TR4?
7. TR4 usa SQL Server confirmado o algun otro motor?
8. Existe ambiente de prueba?
9. Se puede crear una vista read-only para reportes?
10. Que datos NO deben salir nunca de los servidores?

## Recomendacion comercial

La auditoria permite vender con seriedad, pero no prometer de mas.

Recomendacion:

```text
Vender Fase 0 + Fase 1 como diagnostico operativo y capa gerencial segura.
```

Mensaje comercial:

```text
No vamos a tocar ni romper TR4. Primero vamos a entender sus procesos,
identificar que informacion ya pueden exportar y construir una capa gerencial
separada para que la direccion vea ventas, inventario, clientes y seguimiento
sin riesgo sobre el sistema principal.
```

Evitar decir:

```text
Vamos a conectarnos directo a TR4.
Vamos a reemplazar TR4.
Vamos a automatizar todo.
Vamos a leer la base de datos sin el tecnico.
```

## Archivos que faltarian si se quisiera ejecutar localmente

Para una prueba aislada y no productiva, faltaria confirmar:

- Recursos de `P:\TR4\as\graph\...`.
- Configuracion local de DSN/ODBC/OLEDB, si aplica.
- Ambiente de base de datos de prueba.
- Usuario read-only o datos ficticios.
- Dependencias registradas como OCX si alguna requiere registro local.

No se recomienda ejecutar `as700.exe` en la maquina principal hasta tener una
maquina virtual/sandbox sin red o un ambiente de prueba aprobado.

## Decision recomendada

La copia actual es suficiente para:

- documentar arquitectura probable;
- entender modulos;
- preparar preguntas tecnicas;
- disenar una oferta profesional;
- construir un importador/dash separado con exportaciones aprobadas.

No es suficiente para:

- migrar todo el sistema;
- correr TR4 completo;
- conectarse a datos reales;
- prometer integracion automatica;
- reemplazar la operacion actual.

La mejor decision para Onia es usar este hallazgo como base de una fase formal
de auditoria y no como excusa para tocar servidores productivos.
