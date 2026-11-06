# Evidencia QA — W1 Onboarding guiado

Solo contiene salidas reales de comandos ejecutados en esta rama (`qa-security`, repositorio de la app). Lo que no se ejecutó figura como `NO EJECUTADO`.

## Ejecución 1 — 2026-11-06, backend

Comando: `python tools/wallee.py test backend` (`npm run test:cov`, `npm run test:e2e` y `npm run build`)

| Paso | Resultado real |
|---|---|
| `npm run test:cov` | `PASS src/health/health.controller.spec.ts`; `Tests: 1 passed, 1 total` |
| `npm run test:e2e` | `PASS test/app.e2e-spec.ts` y `FAIL test/onboarding.e2e-spec.ts`; `Test Suites: 1 failed, 1 passed, 2 total`; `Tests: 16 failed, 2 passed, 18 total` |
| `npm run build` | No se ejecutó: el comando se detuvo en el paso anterior |
| Código de salida | `1` |

Causa de las 16 fallas: todas terminan en `expect(received).toBe(expected)` con `Expected: 201` y `Received: 404` al llamar `POST /onboarding`. El backend de esta rama solo tiene `GET /health`: las rutas de onboarding aún no están implementadas (AI Engineer 1). Es un resultado esperado y no un defecto de las pruebas.

## Estado por AC

| HU | AC | Test ID | Comando | Resultado | Commit | PR |
|---|---|---|---|---|---|---|
| W1 | W1-AC1 | W1-AC1-T2, W1-AC1-T3 | `python tools/wallee.py test backend` | EJECUTADO-FALLÓ (404) | Pendiente | Pendiente |
| W1 | W1-AC2 | W1-AC2-T2, W1-AC2-T3 | `python tools/wallee.py test backend` | EJECUTADO-FALLÓ (404) | Pendiente | Pendiente |
| W1 | W1-AC3 | W1-AC3-T2, W1-AC3-T3 | `python tools/wallee.py test backend` | EJECUTADO-FALLÓ (404) | Pendiente | Pendiente |
| W1 | W1-AC3 (UI) | W1-AC3-T3 | `python tools/wallee.py test frontend` | NO EJECUTADO (falta el componente) | Pendiente | Pendiente |
| W1 | W1-AC4 | W1-AC4-T2 | `python tools/wallee.py test backend` | NO EJECUTADO (falta mecanismo para observar eventos) | Pendiente | Pendiente |
| W1 | Tarea 7.1 | Recorrido completo | `python tools/wallee.py test` | NO EJECUTADO | Pendiente | Pendiente |

Cobertura (meta 85 %): no medida con el código de W1, que aún no existe.

## Cómo repetir

Con las dependencias instaladas (`python tools/wallee.py setup`): `python tools/wallee.py test backend`. Cuando AI Engineer 1 entregue el código de W1, repetir el comando, pegar aquí la salida real y completar commit y PR.
