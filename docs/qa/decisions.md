# Decisiones QA — W1 Onboarding guiado

## Decisiones requeridas (pendientes)

| ID | Categoría | Contexto | Opciones | Recomendación | Pregunta a | Estado |
|---|---|---|---|---|---|---|
| DQ-01 | Ambigüedad | W1-AC4 y tarea 5.1: el contrato de API no dice cómo observar los eventos `onboarding_started`, `onboarding_step_completed` y `onboarding_completed` | A) Definir una consulta de eventos para pruebas. B) Verificar la persistencia con un mecanismo de integración de prueba acordado. C) Dejar W1-AC4 sin prueba automatizada en este sprint | B si existe un mecanismo verificable; si no, A | Architect (y PO si cambia el criterio comprometido) | Pendiente. Mientras tanto W1-AC4-T2 queda NO EJECUTADO |
| DQ-02 | Alto impacto | SEC-06: `GET /wallets/:id` y `GET /onboarding/:id` no tienen autorización por propietario (Non-Goals de `design.md`) | A) Mantener la autenticación fuera de alcance y limitar el demo a un entorno aislado con datos sintéticos. B) Ampliar el alcance para restringir cada recurso a su propietario | A solo para una demo local aislada | Product Owner y Architect | Pendiente |

## Supuestos PROPUESTO por confirmar

- Tres pasos: `datos`, `identidad` y `verificacion` (D2).
- Documento de 8 dígitos (D6) y OTP `123456` solo fuera de producción (D7).
- La forma exacta del arreglo de pasos de `GET /onboarding/:id` (el test acepta `key` o `stepKey`) y de los errores (`code`, `VALIDATION_ERROR`).

## Registro de decisiones tomadas

| ID | Fecha | Decisión | Quién |
|---|---|---|---|
| DQ-00 | 2026-11-06 | Escribir las pruebas primero, a partir de los Scenario de OpenSpec, antes de que exista el código de W1. Quedan en rojo hasta que AI Engineer 1 implemente los endpoints | QA & Security |
