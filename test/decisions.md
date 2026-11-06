<!-- test/decisions.md -->
# Decisiones QA & Security — Sprint 1

| ID | Estado | Decisión / pendiente | Quién |
|---|---|---|---|
| DEC-04 / DEC-05 | Aprobadas por el PO | S/ 500, ventana 24 h, saldo, mapeo del mock, etiquetas exitoso/fallido/expirado, PA-01 a PA-10 | PO |
| QA-D1 | Asumida por QA | Si el spec y el informe del Architect difieren en el código de error de validación, se usa `VALIDATION_ERROR` (spec) | QA |
| QA-D2 | Asumida por QA | Rutas según el mapa (`backend/`, `frontend/`); `backend-nestjs/` de W1 se trata como discrepancia | QA |
| QA-D3 | Asumida por QA | Las pruebas de frontend y las unitarias se proponen sin archivo, por la restricción `output_target_dir=backend` | QA |
| DR-01 a DR-05 | PENDIENTE | Ver informe (§ Decisiones requeridas) | PO / Architect |

No hay decisión de alto esfuerzo ni dependencia nueva propuesta.