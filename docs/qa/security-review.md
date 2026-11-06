# Revisión de seguridad QA — W1 Onboarding guiado

Lista de controles derivados del spec y de SEC-01..SEC-09. No se inspeccionó el código de W1 (aún no existe) ni se ejecutó ningún escáner: ningún control se afirma como cumplido o fallido.

| Control | Frontera a revisar | Impacto si falla | Control esperado | Verificación | Estado |
|---|---|---|---|---|---|
| SEC-01 Secretos | Configuración y `.env.example` | Exposición de credenciales | `.env.example` solo con valores falsos; el OTP fijo vive en configuración y solo se acepta fuera de producción | Búsqueda por patrones o escáner de secretos | NO EJECUTADO |
| SEC-02 Datos sintéticos | Pruebas, fixtures y logs | Datos personales reales | Solo nombres, celulares y documentos sintéticos | Revisar fixtures y evidencia antes del PR | Parcial: las pruebas de `backend/test/onboarding.e2e-spec.ts` usan valores sintéticos |
| SEC-03 Logs | Validadores y manejo de errores | Filtración de celular, documento u OTP | Enmascarar o excluir datos sensibles | Entradas inválidas y revisión de logs | NO EJECUTADO |
| SEC-04 Errores | Respuestas 400, 404 y 409 | Stack trace o detalles internos | HTTP adecuado y código de motivo estable | Pruebas de error (cubiertas en parte por W1-AC1-T3 y W1-AC2) | NO EJECUTADO |
| SEC-05 Entradas hostiles | DTO de `PUT /onboarding/:id/steps/:stepKey` | Inyección o avance indebido | Validación en el servidor, límites de longitud y política para campos extra | Casos W1-AC2-T3 [EG] | EJECUTADO-FALLÓ (404, sin implementar) |
| SEC-06 Autorización | `GET /onboarding/:id`, `GET /wallets/:id` | Acceso a recursos de otra persona | La autenticación está fuera de alcance (Non-Goals de `design.md`) | No hay pruebas multiusuario diseñables | PENDIENTE DE DECISIÓN (ver [decisions.md](decisions.md)) |
| SEC-07 y SEC-08 Guardrails y HITL | Crew de `wallee` | Acción autónoma sin aprobación | Pruebas del Crew en `wallee` | `python -m unittest discover -s tests` (repositorio `wallee`) | Fuera de W1 |
| SEC-09 Integridad de la evidencia | `evidence.md` | Declarar probado lo no ejecutado | Comando, salida real, commit y PR | Revisión de la persona | Cumplido en [evidence.md](evidence.md): solo salidas reales |

Verificaciones propuestas, no ejecutadas: `npm audit` en `backend/` y `frontend/`, escaneo de secretos y confirmar que la validación del servidor no depende del frontend.
