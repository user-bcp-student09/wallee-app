# Instrucciones de Wallee

Monorepo con `backend/` (NestJS) y `frontend/` (React + Vite). Trabaja desde la raíz, aplica solo la sección del componente elegido y no modifiques el otro sin ampliar el alcance acordado.

Ejecuta pruebas con `python tools/wallee.py test [backend|frontend]` y en contenedores con `python tools/wallee.py podman-test`. Registra los comandos y resultados reales; no inventes ejecuciones. La revisión humana precede a la integración.

## Contrato para agentes

1. Cada cambio referencia el ID de la HU y el criterio de aceptación.
2. Conserva los endpoints y formatos que usa el frontend; documenta cualquier cambio de contrato.
3. Escribe pruebas junto con el código. Meta de cobertura del código modificado: 85% o superior.
4. No agregues secretos reales; usa variables de entorno y `.env.example`.
5. Lo externo (identidad, pagos, QR, callbacks) se simula con mocks y no se presenta como integración real.
6. Las imágenes de contenedor usan nombre completo (`docker.io/library/...`) y los servicios corren sin privilegios.

## backend

- NestJS con TypeScript, un módulo por funcionalidad en `src/<feature>/`.
- Valida entradas con DTOs y `class-validator`; responde errores con el código HTTP adecuado y un código de motivo estable.
- Pruebas unitarias `*.spec.ts` junto al código y de integración `*.e2e-spec.ts` en `test/`.

## frontend

- React con TypeScript, consumo de la API en `src/api/` y componentes en `src/<feature>/`.
- Contempla estados de carga, vacío y error, y accesibilidad. El cliente no reemplaza la validación del servidor.
- Pruebas con Vitest y Testing Library junto al código.
