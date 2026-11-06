<!-- test/test-plan.md -->
# Plan de pruebas — Sprint 1 (W1 + W2)

Estado global: **NO EJECUTADO**. Fecha del borrador: 2026-11-06. Rama: `qa-security`. Comando: `python tools/wallee.py test backend` (cobertura mínima 85 %).
Este plan es de caja negra por API. Ninguna salida fue aportada todavía.

## 1. Casos W1

| ID | AC / RN | Técnica | Precondición | Entrada | Resultado esperado | Prior. | Estado |
|---|---|---|---|---|---|---|---|
| W1-AC1-T2 (a) | AC1, tarea 3.1 | EP | — | POST /onboarding | 201, 3 pasos (`datos`,`identidad`,`verificacion`), actual = `datos` | Alta | NO EJECUTADO |
| W1-AC1-T2 (b) | AC1 | ST | onboarding creado | GET /onboarding/:id | 200, actual = `datos` | Media | NO EJECUTADO |
| W1-AC1-T2 (c) | AC1 | ST | onboarding creado | PUT datos válidos | `datos` COMPLETADO, actual = `identidad` | Alta | NO EJECUTADO |
| W1-AC1-T3 | AC1 | EG | — | GET id inexistente | 404 `ONBOARDING_NOT_FOUND` | Media | NO EJECUTADO |
| W1-AC2-T2 (x7) | AC2, RN-09, RN-04 | EP/BVA | onboarding creado | nombre vacío/ausente; celular ausente, 8 díg., 10 díg., inicia en 8, texto | 400 `VALIDATION_ERROR` con campo; paso = `datos` | Alta | NO EJECUTADO |
| W1-AC2-T2 (BVA ok) | RN-04 | BVA | — | celular `900000000` | 200 (límite válido) | Alta | NO EJECUTADO |
| W1-AC2-T2 (x4) | AC2 (PROPUESTO) | EP/BVA | `datos` completo | documento de 7, 9, letras, ausente | 400 `VALIDATION_ERROR`; paso = `identidad` | Media | NO EJECUTADO |
| W1-AC2-T2 (OTP vacío) | AC2 | EP | hasta `identidad` | `codigo` vacío | 400; paso = `verificacion` | Media | NO EJECUTADO |
| W1-AC2-T2 (OTP malo) | AC2, tarea 2.2 | EP | hasta `identidad` | `000000`, luego `123456` | 400 y reintento posible; luego 200; wallet pendiente | Alta | NO EJECUTADO |
| W1-AC1-T3 (x2) | D3, tarea 3.3 | ST | onboarding nuevo | `verificacion` o `identidad` antes de `datos` | 409 `STEP_OUT_OF_ORDER`; progreso intacto | Alta | NO EJECUTADO |
| W1-AC3-T2 | AC3, RN-10, 4.1 | ST | — | 3 pasos válidos | onboarding COMPLETADO y wallet ACTIVA | Alta | NO EJECUTADO |
| W1-AC3-T3 | AC3, RN-10, 4.2 | ST | — | solo 2 pasos | wallet PENDIENTE_ONBOARDING en GET /wallets/:id | Alta | NO EJECUTADO |
| W1-AC3-T3 (404) | AC3 | EG | — | GET wallet inexistente | 404 con `code` | Baja | NO EJECUTADO |
| W1-AC2-T3 (x7) | SEC-04/05 | EG | — | nombre SQL/JS/unicode/espacios/enorme/null/numérico | <500 y sin stack trace | Alta | NO EJECUTADO |
| W1-AC2-T3 (extra) | SEC-05 | EG | — | campos extra `status=ACTIVA` | wallet sigue PENDIENTE | Alta | NO EJECUTADO |
| W1-AC2-T3 (enorme) | SEC-05 | EG | — | celular 9e30 | 400 `VALIDATION_ERROR` | Media | NO EJECUTADO |
| W1-AC2-T3 (paso desconocido) | SEC-04 | EG | — | PUT paso inexistente | 4xx sin stack | Media | NO EJECUTADO |
| W1-AC4-T2 | AC4, 5.1 | — | — | recorrido completo | 1 inicio, 3 paso, 1 cierre, en orden | Alta | **BLOQUEADO (DR-01)** `it.todo` |
| W1-AC4-T3 | AC4 | — | — | paso inválido | sin `onboarding_step_completed` | Media | **BLOQUEADO (DR-01)** |
| W1-6.1/6.2/6.3 | AC1, AC2, AC3 | EP | frontend | pruebas de componente | indicador, mensaje `400`, entrada de pagos solo ACTIVA | Media | PROPUESTO, sin archivo (DR-04) |
| W1-7.1 | integración | — | app levantada | recorrido completo por URL | wallet ACTIVA sin intervención | Media | NO EJECUTADO |

## 2. Casos W2

| ID | AC / RN | Técnica | Precondición | Entrada | Resultado esperado | Prior. | Estado |
|---|---|---|---|---|---|---|---|
| W2-AC2-T2 (x5) | AC2, RN-05, RN-08 | EP/BVA | wallet ACTIVA | destino terminado en 0,1,3,4,9 | fallido, expirado, exitoso x3 | Alta | NO EJECUTADO |
| W2-AC2-T2 (PENDING) | RN-07 | EP | wallet ACTIVA | dígito 2 | sin resultado terminal ni en el POST ni en GET | Alta | NO EJECUTADO |
| W2-AC2-T2 (callback) | RN-06, 4.3 | ST | PENDING | callback APPROVED | exitoso | Alta | NO EJECUTADO |
| W2-AC2-T3 | RN-06 | ST | intento terminal | 2.º callback DECLINED | resultado y saldo sin cambio | Alta | NO EJECUTADO |
| W2-AC4-T3 (500) | RN-01 | BVA | saldo ≥ 500 (fixture) | 499.99 / 500.00 / 500.01 | 201 / 201 / 422 `AMOUNT_OVER_LIMIT` sin transacción | Alta | NO EJECUTADO |
| W2-AC4-T3 (monto x8) | RN-01 | EP/EG | wallet ACTIVA | 0, -10, "abc", 10.123, 1e15, null, SQL, "" | 4xx con `code`; saldo e historial intactos | Alta | NO EJECUTADO |
| W2-AC4-T3 (0.01) | — | BVA | — | 0.01 | solo <500 (mínimo PENDIENTE DE CONFIRMAR) | Baja | NO EJECUTADO |
| W2-AC4-T3 (destino x6+1) | RN-04 | EP/BVA | wallet ACTIVA | 8/10 díg., inicia en 8, texto, vacío, SQL, alias inexistente | 400 `DESTINATION_INVALID` | Alta | NO EJECUTADO |
| W2-AC1-T2 (dir) | AC1, 4.1 | EP | — | GET /directory/91234567 | 400 `DESTINATION_INVALID` | Media | NO EJECUTADO |
| W2-AC1-T2 (dir ok) | AC1 | EP | fixture | celular/alias válidos | 200 con nombre | Media | BLOQUEADO por tarea 1.2 (`it.todo`) |
| W2-AC4-T3 (saldo x3) | RN-18 | BVA | saldo reducido a 100 | monto = saldo+0.01 / saldo / saldo-0.01 | 422 `INSUFFICIENT_FUNDS` / 201 saldo 0 / 201 saldo 0.01 | Alta | NO EJECUTADO |
| W2-AC4-T3 (RN-10) | RN-10 | DT | wallet PENDIENTE | cualquier pago | 4xx, sin transacción | Alta | NO EJECUTADO |
| W2-AC4-T3 (uno mismo) | discovery | DT | — | destino = celular del pagador | rechazo | Media | BLOQUEADO (DR-03) |
| W2-AC3-T2 (x2) | AC3, RN-11 | EP | wallet ACTIVA | pago exitoso x1 y x2 | referencia en respuesta y en historial; referencias distintas | Alta | NO EJECUTADO |
| W2-AC4-T2 (x2) | AC4, RN-12 | EP | wallet ACTIVA | dígitos 0 y 1 | saldo sin cambio | Alta | NO EJECUTADO |
| W2-AC4-T2 (reintento) | RN-12 | ST | wallet ACTIVA | fallido y luego exitoso (50) | saldo = inicial − 50 (una vez) | Alta | NO EJECUTADO |
| W2-AC6-T2 / T3 | AC6 (PARCIAL) | — | — | pago exitoso / no exitoso | 1 / 0 `payment_succeeded` | Media | **BLOQUEADO (DR-01)** |
| W2-5.1 a 5.4 | AC1 a AC4 | EP | frontend | pruebas de componente | confirmación, resultados, errores 422, entrada de pago solo ACTIVA | Media | PROPUESTO, sin archivo (DR-04) |
| W2-7.1 | integración | — | app levantada | 3 escenarios + PENDING con callback | sin intervención manual | Media | NO EJECUTADO |

## 3. Matriz de trazabilidad (AC/RN ↔ caso)

| AC / RN | Casos |
|---|---|
| W1-AC1 | W1-AC1-T2 (a,b,c), W1-AC1-T3 (x3) |
| W1-AC2, RN-09, RN-04 | W1-AC2-T2 (todos), W1-AC2-T3 (hostiles) |
| W1-AC3, RN-10 | W1-AC3-T2, W1-AC3-T3 |
| W1-AC4 | W1-AC4-T2/T3 (bloqueado) |
| W2-AC1 | W2-AC1-T2 (directory) |
| W2-AC2, RN-05 a RN-08 | W2-AC2-T2, W2-AC2-T3 |
| W2-AC3, RN-11 | W2-AC3-T2 |
| W2-AC4, RN-12 | W2-AC4-T2 |
| W2-AC4-T3, RN-01, RN-04, RN-10, RN-18 | W2-AC4-T3 (500, montos, destino, saldo, wallet) |
| W2-AC6 (PARCIAL) | W2-AC6-T2/T3 (bloqueado) |

## 4. Cobertura (PROPUESTA vs EJECUTADA)

| Medida | Propuesta | Ejecutada |
|---|---|---|
| Casos de API generados (`it`) | ≈ 62 | 0 |
| `it.todo` bloqueados | 8 | 0 |
| Particiones/límites clave: monto 499.99/500/500.01, celular 8/9/10, saldo ±0.01, dígitos 0..9 del mock | cubiertos en el diseño | 0 |
| Cobertura de código (meta 85 %) | — | NO EJECUTADO |

## 5. Tareas de `tasks.md` y estado

| Tarea | Estado QA |
|---|---|
| W1 2.2, 3.1, 3.2, 3.3, 4.1, 4.2 | Pruebas propuestas; **pendiente** de código T1 |
| W1 5.1 | Bloqueada por DR-01 |
| W1 6.1 a 6.3 | Pendiente (sin archivo, DR-04) |
| W1 7.1, 7.2 | Pendiente |
| W2 3.1, 3.2, 4.1 a 4.4 | Pruebas propuestas; **pendiente** de código T1 |
| W2 4.5 | Bloqueada por DR-01 |
| W2 5.1 a 5.4 | Pendiente (sin archivo, DR-04) |
| W2 7.1, 7.2 | Pendiente |
| W1 1.1, 1.2 (Architect) | No son de QA; no se marcan |