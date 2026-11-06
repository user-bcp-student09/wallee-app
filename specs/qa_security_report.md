# Informe final QA & Security: sprint W1 + W2 (post-ejecución)

Fecha: 2026-11-06. Rama de QA: `qa-security`. Comando configurado: `python tools/wallee.py test`. Estado de la ejecución: **FALLÓ** (código de salida 1, 24,9 s).

Este informe resume solo lo que demuestra la salida real recibida. No se regeneran ni modifican tests. No se afirma que commit, push o PR hayan ocurrido: esa publicación es un paso separado.

---

## 1. Qué demuestra la salida real

### 1.1 Totales reportados

| Medida | Valor |
|---|---|
| Suites | 2 totales: 1 fallida, 1 aprobada |
| Tests | 18 totales: 14 fallidos, 2 `todo`, 2 aprobados |
| Duración Jest | 8,124 s |

### 1.2 Limitaciones de la salida

- La salida llegó **truncada**: solo se ve el final. Aparece el nombre `e2e-spec.ts (7.315 s)` sin prefijo y el bloque `FAIL test/onboarding.e2e-spec.ts`.
- Los 14 fallos y los títulos visibles pertenecen a `test/onboarding.e2e-spec.ts`, el archivo previo de autor no identificado. Sus nombres («W1 onboarding — API de integración») no coinciden con los de mis archivos (`W1 Onboarding guiado (QA)`).
- La suite aprobada es probablemente `test/app.e2e-spec.ts` (health), pero la salida truncada no lo demuestra con certeza.
- **No hay evidencia de que mis archivos se ejecutaran.** Los totales de 18 tests y 2 `todo` son compatibles con una suite de 16 tests más 2 `todo`, y mis archivos emitidos tienen muchos más casos y 8 `todo`. Es posible que `w1-onboarding-qa.e2e-spec.ts`, `w2-pago-bajo-monto-qa.e2e-spec.ts` y `support/qa-helpers.ts` no estuvieran en el destino o que el patrón de Jest no los tomara. Es una hipótesis, no un hecho demostrado.
- No se aportó salida de cobertura: **cobertura (meta 85 %): NO EJECUTADO / no verificable**.
- No hubo ejecución de frontend, E2E por URL, `npm audit`, eslint-plugin-security, gitleaks ni `python -m unittest discover -s tests`.

### 1.3 Resultado por caso visible

Cada fallo muestra el mismo patrón: `Expected: 201, Received: 404` en el helper `crearOnboarding` (`onboarding.e2e-spec.ts:38`), al llamar a `POST /onboarding` con cuerpo `{}`.

| Caso (título en la salida) | Resultado demostrado | Causa que muestra la salida |
|---|---|---|
| W1-AC1-T2 [EP] inicio lista los pasos propuestos y marca datos como actual | EJECUTADO-FALLÓ | `POST /onboarding` → 404 |
| W1-AC1-T2 [ST] completar datos actualiza el paso actual | EJECUTADO-FALLÓ | ídem |
| W1-AC1-T3 [ST] paso fuera de orden devuelve 409 y no cambia el progreso | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T2 [EP/BVA] nombre vacío | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T2 [EP/BVA] celular ausente | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T2 [EP/BVA] celular de 8 dígitos | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T2 [EP/BVA] celular de 10 dígitos | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T2 [EP/BVA] celular de 9 dígitos que no empieza en 9 | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T3 [EP/BVA] documento de 7 dígitos | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T3 [EP/BVA] documento de 9 dígitos | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T3 [EP/BVA] documento alfanumérico | EJECUTADO-FALLÓ | ídem |
| W1-AC2-T3 [EP/ST] OTP incorrecto permite reintentar sin activar la wallet | EJECUTADO-FALLÓ | ídem |
| W1-AC3-T3 [ST] wallet incompleta permanece pendiente | EJECUTADO-FALLÓ | ídem |
| W1-AC3-T2 [ST] wallet se activa solo tras completar los tres pasos | EJECUTADO-FALLÓ | ídem |

Los 2 tests aprobados y los 2 `todo` no pueden identificarse por nombre con la salida recibida. Quedan **no identificables**.

---

## 2. Interpretación y honestidad

- Los 14 fallos son consistentes con la observación previa (OBS-01): el backend en disco solo tenía el módulo `health`, y la salida confirma que `POST /onboarding` responde 404. La ruta no existe o no está registrada en la app que crea el test.
- Esto **no es todavía un BUG-xx confirmado de lógica**, sino el T1 de W1 (AI Engineer 1) sin entregar o sin integrar en `AppModule`. Se reporta como bloqueo, no como defecto de comportamiento. Sigue vigente OBS-02: si la ruta existe pero el prefijo o la configuración global solo están en `main.ts`, el test sin puerto daría el mismo 404.
- Una suite fallida no significa que todos los AC fallaron ni que pasaron: ningún AC de W1 ni de W2 queda verificado como cumplido.
- Ningún caso de W2 aparece en la salida visible. Todos quedan **NO EJECUTADO**.

---

## 3. Estado de los casos propuestos por mí

| Grupo | Estado tras la ejecución |
|---|---|
| `w1-onboarding-qa.e2e-spec.ts` (W1-AC1 a AC3, 2.2, 3.1 a 3.3, 4.1, 4.2, EG hostiles) | NO EJECUTADO (no hay evidencia de que se haya corrido) |
| `w2-pago-bajo-monto-qa.e2e-spec.ts` (W2-AC1 a AC4, AC6) | NO EJECUTADO |
| W1-AC4-T2/T3 y W2-AC6-T2/T3 (`it.todo`, DR-01) | NO EJECUTADO, BLOQUEADOS por contrato de consulta de eventos |
| Frontend, E2E por URL (7.1), seguridad (`npm audit`, gitleaks, eslint-security), Crew | NO EJECUTADO |

---

## 4. Actualización del plan y la evidencia (resumen)

La evidencia de la ejecución ya está registrada en `test/evidence.md`; aquí solo se resume.

| HU | AC | Resultado real demostrado | Estado |
|---|---|---|---|
| W1 | AC1 | 3 casos del archivo previo EJECUTADO-FALLÓ (404 en `POST /onboarding`) | Rojo; mis casos NO EJECUTADO |
| W1 | AC2 | 8 casos del archivo previo EJECUTADO-FALLÓ (404) | Rojo |
| W1 | AC3 | 2 casos del archivo previo EJECUTADO-FALLÓ (404) | Rojo |
| W1 | AC4 | Sin caso ejecutado | BLOQUEADO (DR-01) |
| W2 | AC1 a AC4, AC6 | Sin caso ejecutado | NO EJECUTADO |

Commit y PR: no hay confirmación; se dejan en «—».

---

## 5. Hallazgos

| ID | HU/AC | Severidad | Dueño | Estado |
|---|---|---|---|---|
| BUG-01 (candidato, por confirmar) | W1-AC1/AC2/AC3 | Alta | AI Engineer 1 (con Architect) | Pasos: ejecutar `python tools/wallee.py test backend` y `POST /onboarding` con cuerpo `{}`. Esperado: `201` con `onboardingId`, `walletId`, tres pasos y `currentStep=datos` (spec W1, tarea 3.1). Obtenido: `404` (`onboarding.e2e-spec.ts:38`, 14 casos fallidos). Evidencia: salida del ejecutor de `main.py`. Aún no distingue entre módulo no implementado y módulo no registrado: hay que confirmar con el dueño. |
| OBS-02 | W1/W2 | Media | Architect | Sin cambios: la configuración global (prefijo, pipes, filtros) debería compartirse con los tests. |
| OBS-04 | QA | Media | QA / persona | La salida no demuestra que mis archivos se copiaron o se descubrieron. Verificar su presencia en `backend/test/` y el patrón de Jest. |

---

## 6. Estado por HU

| HU | Estado | Motivo |
|---|---|---|
| W1 | **PARCIAL, checkpoint ROJO** | Los casos ejecutados fallan por 404 en `POST /onboarding`; AC4 bloqueado; AC5/AC6 diferidos. |
| W2 | **PARCIAL, checkpoint ROJO/pendiente** | Sin ningún caso ejecutado; AC6 parcial por definición y bloqueado. |
| W3, W4, W5, W6 | FUERA DEL ALCANCE DEL SPRINT | — |

Reportar al AI Engineer 1 (BUG-01), al Architect (registro de módulos y configuración global) y al PO (estado de las HU). La hora límite de W1 era 11:15 y la de W2 11:45.

### Tareas de `tasks.md`

| Tarea | Estado |
|---|---|
| W1 2.2, 3.1, 3.2, 3.3, 4.1, 4.2 | Pendiente: la salida no demuestra verde; no se marcan |
| W1 5.1, W2 4.5 | Bloqueadas (DR-01) |
| W1 6.1 a 6.3, W2 5.1 a 5.4 | Pendiente (sin archivo, DR-04) |
| W1 7.1/7.2, W2 7.1/7.2 | Pendiente: sin recorrido ni matriz completa |
| W1 1.1, 1.2 (Architect) | No son de QA; no se marcan |

---

## 7. Checklist previo al Freeze

| Ítem | Estado |
|---|---|
| Tests con salida real | Ejecución parcial y fallida; sin verde |
| Cobertura (85 %) | No verificable |
| Evidencia | Registrada (ejecución fallida) |
| Matriz de trazabilidad (7.2) | Sin filas con test en verde |
| README, diagrama, instrucciones | Pendiente (Presenter) |
| Código en GitHub | Pendiente: no se afirma publicación |
| Trade-offs | Ver abajo |

### Aporte a README, sección 6 «Evidencia y pruebas»

- Pruebas API de caja negra con Jest y Supertest, datos sintéticos, técnicas EP/BVA/DT/ST/EG.
- Primera ejecución real: suite fallida (14 fallos, 2 aprobados, 2 `todo`); `POST /onboarding` respondió 404 en todos los fallos visibles.
- Ninguna HU está verificada como cumplida.

### Aporte a README, sección 7 «Trade-offs y deuda conocida»

- Sin verificación de W2 ni de los eventos (W1-AC4, W2-AC6) hasta definir el contrato de consulta.
- Sin pruebas de frontend, E2E por URL, autorización (SEC-06), dependencias ni cobertura.
- Mínimo de monto, código de wallet no activa y pago a uno mismo siguen sin definir.
- No se probó nada de W4/W5.

---

## 8. Revisión de seguridad (estado tras la ejecución)

| Control | Estado |
|---|---|
| SEC-01 a SEC-03 | NO EJECUTADO |
| SEC-04, SEC-05 | NO EJECUTADO: la salida visible no incluye los casos hostiles |
| SEC-06 | Riesgo pendiente (DR-05) |
| SEC-07, SEC-08 | Fuera del alcance (W5) |
| SEC-09 | Cumple: este informe cita solo lo que demuestra la salida |

---

## 9. Decisiones requeridas (vigentes)

DECISIÓN REQUERIDA — Categoría: alto impacto | Contexto: W1-AC4 / W2-AC6 | Opciones: A) Exponer endpoints de eventos B) Pruebas unitarias del servicio de eventos C) Consulta directa a la tabla | Recomendación: A | Impacto: AC4 y AC6 sin prueba | Pregunta a: Architect y AI Engineer 1

DECISIÓN REQUERIDA — Categoría: ambigüedad | Contexto: RN-10, código HTTP y de motivo de wallet no activa | Opciones: A) 403 `WALLET_NOT_ACTIVE` B) 409 C) 422 | Recomendación: A | Impacto: el test solo exige 4xx | Pregunta a: Product Owner humano / Architect

DECISIÓN REQUERIDA — Categoría: ambigüedad | Contexto: W2-AC4-T3, pago a uno mismo | Opciones: A) Rechazar con `DESTINATION_INVALID` B) Permitir C) Fuera de alcance | Recomendación: A | Impacto: caso `it.todo` | Pregunta a: Product Owner humano

DECISIÓN REQUERIDA — Categoría: alcance/ruta | Contexto: pruebas de frontend y unitarias fuera de `output_target_dir=backend` | Opciones: A) Ampliar el destino B) Las escriben los AI Engineers C) Quedan propuestas | Recomendación: A | Impacto: sin cobertura de frontend ni de unidades | Pregunta a: Architect

DECISIÓN REQUERIDA — Categoría: crítica | Contexto: SEC-06, el pagador se identifica solo por `walletId` | Opciones: A) Aceptar riesgo B) IDs no secuenciales y comprobación de pertenencia C) Autenticación mínima | Recomendación: B como mínimo | Impacto: acceso a saldo y pago con wallet ajena | Pregunta a: Product Owner humano (escala al Architect)

DECISIÓN REQUERIDA — Categoría: alcance/ruta | Contexto: la salida no demuestra que se ejecutaron mis archivos de QA | Opciones: A) La persona verifica que `w1-onboarding-qa.e2e-spec.ts`, `w2-pago-bajo-monto-qa.e2e-spec.ts` y `support/qa-helpers.ts` existen en `backend/test/` y reejecuta con salida completa B) Mantenerlos NO EJECUTADO | Recomendación: A | Impacto: sin esto no hay evidencia de W2 ni de la mayoría de W1 | Pregunta a: persona del equipo / Architect

---

## 10. Siguiente paso

1. El AI Engineer 1 confirma BUG-01: implementar o registrar `POST /onboarding` en `AppModule` (o exponer la configuración global).
2. La persona verifica la presencia de mis archivos en `backend/test/` y vuelve a ejecutar `python tools/wallee.py test backend`, aportando la salida completa (sin truncar) para actualizar el informe.
3. Hasta entonces, solo se consideran verificados los 14 fallos del archivo previo; todo lo demás permanece NO EJECUTADO.