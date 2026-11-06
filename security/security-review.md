<!-- security/security-review.md -->
# Revisión de seguridad — Sprint 1 (W1 + W2)

Revisión **propuesta, no ejecutada**. El backend de la app solo tiene el módulo `health`, así que no existe código de onboarding ni de pagos que inspeccionar. Todo está «NO EJECUTADO».

| ID | Control | Ubicación | Riesgo si falla | Corrección propuesta | Verificación propuesta | Estado |
|---|---|---|---|---|---|---|
| SEC-01 | Sin secretos; `.env.example` con valores falsos | raíz de la app | Alto | gitleaks o búsqueda por patrones; el OTP fijo solo en configuración fuera de producción | `gitleaks detect` (la persona) | NO EJECUTADO |
| SEC-02 | Solo datos sintéticos | fixtures, helpers de QA | Medio | celulares `9000000x`, nombres inventados | revisión manual de fixtures | PARCIAL: mis helpers son sintéticos; fixtures de la app NO REVISADAS |
| SEC-03 | Logs sin celular completo, documento ni token | logger de la app | Medio | enmascarar al registrar | revisión de logs al ejecutar | NO EJECUTADO (no hay código ni logs) |
| SEC-04 | Errores sin stack trace | filtros globales | Medio | filtro de excepciones con `code` estable | tests W1-AC2-T3 y W2-AC4-T3 (aserción contra stack/SQLITE) | NO EJECUTADO |
| SEC-05 | Entradas hostiles | DTOs de onboarding y pagos | Alto | `class-validator`, `whitelist`, consultas parametrizadas | tests EG de montos, nombre, celular, destino, campos extra | NO EJECUTADO |
| SEC-06 | Un usuario solo ve y paga con SU wallet | `/wallets/:id`, `/payments` | Alto | no hay autenticación (Non-Goal de W1: se identifica por `walletId`) | ninguna prueba posible hoy | **RIESGO ACEPTADO PENDIENTE DE CONFIRMAR (DR-05)** |
| SEC-07 | El agente no mueve dinero ni ejecuta reversos | Crew (`tests/`) | Alto | guardrails | `python -m unittest discover -s tests` | FUERA DEL ALCANCE (W5) |
| SEC-08 | HITL en reversos, disputas y excepciones | Crew | Alto | idem | idem | FUERA DEL ALCANCE (W5) |
| SEC-09 | Sin resultados inventados | este informe | — | todo «NO EJECUTADO» hasta tener salida real | evidencia | CUMPLE (no se afirma ninguna ejecución) |

Controles específicos:

- **IDOR:** con `walletId` como único identificador, enumerar IDs expone saldo e historial. Debe exigir IDs no secuenciales (UUID) o autenticación.
- **Mass assignment:** hay un caso que envía `status: "ACTIVA"` en el paso `datos` (W1-AC2-T3).
- **Mock de OTP:** `123456` solo debe aceptarse fuera de producción. Se propone una prueba con `NODE_ENV=production` (pendiente, no emitida).
- **Dependencias:** `npm audit` en `backend/` y `frontend/` (la persona).
- **UNIQUE de idempotencia:** corresponde a W4, fuera de alcance.

Los controles de la fila SEC-01, SEC-02 y SEC-03 seguirán pendientes hasta que exista código y la persona aporte salidas.