# QA independiente launcher nativo — 2026-10-14

Snapshot congelado: `native_trusted_runtime.py` SHA-256
`FBD3015A859231D3B6661B6CD5AFEC3004CC2FC8BC1D6C940CAB206E79EB9AFF`;
`native_trusted_launcher.py` `6D88D29894A558248E90765F15C001213C899DF9463E6E6E92DB2C287D3A8CAC`;
`test_native_trusted_launcher.py` `9753CDC959A72ED43EDCF0657E8304AB5B130D250C929EFC1C8EFF06C9F1A3C8`;
runbook `C4E1BD721CFC9D6D3E7F7E1607C3F947750473E406DF861A6FA579B6C169BA6A`.

**PASS offline condicionado.** Comando:
`python -m unittest qa_launcher_sender qa_integration_native.NativeIntegrationAdversarialTests.test_wiring_routes_only_na_and_stop_holds_without_provider -v`
Exit 0; QA focal 2/2. QA sender SHA-256
`00A8CCC97BB61D5149C9CFD43BC457CBA7C4A34E5CFD2F37D07199FE269B4C60`; QA
integración SHA-256
`8553B4B8795AB5B3F515796CC88E4ADA0C8C44B4B09CAF9D6667BF83A8B0723B`.

La prueba confirma en fixtures que STOP y lease expirado bloquean el envío y
que el prompt válido contiene la línea pública única de propósito revisado,
acción, límites y resultados. El caso de integración verifica binding y STOP
del dispatch. No se repitieron las pruebas del autor ni otras suites verdes.

Revisión focal: launcher sólo acepta instancias existentes y se instala antes
de `connect`; no crea cola, scheduler ni servicio. Sender exige `app.running`,
identidad `_app.bot is _bot`, actor=chat privado, request/plan ligados, una
línea `ONIA_PURPOSE:` hash-checkeada y caps. El callback queda ligado al ID del
mensaje devuelto por el bot. Timeout o respuesta ambigua deja el challenge sin
binding y sin reenvío automático. El uninstall comprueba ownership y sólo es
preconnect.

Límites: adapter/bot simulados, factoría de autoridad mockeada, sink Windows con
fsync de fixture. Sin Telegram, proveedor, red, cola operativa o endpoint live;
no se ejecutó el ciclo de 30 minutos. Falta integrar el startup/consumer host y
la ruta de entrega de resultados. R4/setup sigue separado.
