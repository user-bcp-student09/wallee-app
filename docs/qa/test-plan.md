# Plan de pruebas QA — W1 Onboarding guiado

- Cambio OpenSpec: `w1-onboarding-guiado` (repositorio `wallee`, `openspec/changes/w1-onboarding-guiado`).
- Rama: `qa-security`. Archivo de pruebas: `backend/test/onboarding.e2e-spec.ts` (Jest + Supertest).
- Generado con el agente QA & Security de `wallee` y revisado por la persona. El resultado esperado sale del spec, no del código.
- Estados: `EJECUTADO-OK` y `EJECUTADO-FALLÓ` solo con salida real (ver [evidence.md](evidence.md)); si no, `NO EJECUTADO`.
- Los pasos (`datos`, `identidad`, `verificacion`), el documento de 8 dígitos y el OTP `123456` son PROPUESTO (diseño D2, D6 y D7): **PENDIENTE DE CONFIRMAR** por el PO.

## Casos

| ID | AC / requisito / RN | Técnica | Entrada sintética | Resultado esperado | Prioridad | Estado |
|---|---|---|---|---|---|---|
| W1-AC1-T2 | W1-AC1, secuencia visible | EP / ST | `POST /onboarding`, luego `GET /onboarding/:id` | 3 pasos en orden y `datos` como paso actual | Alta | EJECUTADO-FALLÓ (404, endpoint sin implementar) |
| W1-AC1-T2 | W1-AC1, avance | ST | Completar `datos` con nombre y celular válidos | `identidad` pasa a ser el paso actual | Alta | EJECUTADO-FALLÓ (404) |
| W1-AC1-T3 | W1-AC1, tarea 3.3 | ST | Enviar `verificacion` antes de `datos` e `identidad` | `409 STEP_OUT_OF_ORDER`, sin avance | Alta | EJECUTADO-FALLÓ (404) |
| W1-AC2-T2 | W1-AC2, RN-09 | EP | Nombre vacío con celular válido | `400 VALIDATION_ERROR` indicando `name`; el paso no cambia | Alta | EJECUTADO-FALLÓ (404) |
| W1-AC2-T3 | W1-AC2, RN-04 | BVA | Celular de 8 dígitos, de 10 dígitos y de 9 dígitos con prefijo 8 | `400 VALIDATION_ERROR` indicando `phone`; sin avance | Alta | EJECUTADO-FALLÓ (404) |
| W1-AC2-T2 | W1-AC2, documento (D6, PROPUESTO) | BVA | Documento de 7 y de 9 dígitos | `400 VALIDATION_ERROR` indicando `document`; `identidad` sigue siendo el paso actual | Media | EJECUTADO-FALLÓ (404) |
| W1-AC2-T2 | W1-AC2, OTP incorrecto (D7) | EP | OTP `000000` | `400 VALIDATION_ERROR` indicando `code`; se puede reintentar | Alta | EJECUTADO-FALLÓ (404) |
| W1-AC2-T3 | W1-AC2, SEC-05 | EG | Celular con SQL, JavaScript, unicode con espacios y 10 000 caracteres | `400 VALIDATION_ERROR` indicando `phone`; sin avance | Alta | EJECUTADO-FALLÓ (404) |
| W1-AC3-T2 | W1-AC3, RN-10 | ST | Completar los tres pasos con OTP `123456` | `GET /wallets/:id` devuelve `ACTIVA` | Alta | EJECUTADO-FALLÓ (404) |
| W1-AC3-T3 | W1-AC3, RN-10 | ST | Consultar la wallet sin completar el onboarding | `PENDIENTE_ONBOARDING` | Alta | EJECUTADO-FALLÓ (404) |
| W1-AC3-T3 | W1-AC3, punto de entrada de pagos | EP / UI | Wallet `PENDIENTE_ONBOARDING` en el asistente React | El punto de entrada de pagos no se muestra | Alta | NO EJECUTADO (falta el componente; sin MCP de navegador) |
| W1-AC4-T2 | W1-AC4, tarea 5.1 | ST | Recorrido completo | `onboarding_started`, tres `onboarding_step_completed` y `onboarding_completed`, en ese orden | Alta | NO EJECUTADO (falta un mecanismo para observar los eventos, ver [decisions.md](decisions.md)) |
| Tarea 7.1 | Recorrido completo sin intervención manual | E2E | Alta con datos sintéticos hasta wallet `ACTIVA` | Se completa sin intervención | Alta | NO EJECUTADO |

## Matriz de trazabilidad AC ↔ casos

| AC | Casos | Cobertura |
|---|---|---|
| W1-AC1 | W1-AC1-T2, W1-AC1-T3 | API escrita; ejecutada en rojo |
| W1-AC2 | W1-AC2-T2, W1-AC2-T3 | API escrita (EP, BVA y EG); ejecutada en rojo |
| W1-AC3 | W1-AC3-T2, W1-AC3-T3 | API escrita; UI pendiente |
| W1-AC4 | W1-AC4-T2 | Sin prueba: falta el mecanismo de observación de eventos |

Fuera de alcance de este cambio: W1-AC5 y W1-AC6 (KPI), pago, saldo y reglas de monto (W2). W1 se mantiene **PARCIAL**.
