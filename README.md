# Wallee App

Aplicación web de Wallee: **React** (frontend) y **NestJS** (backend), con **Podman** para pruebas y despliegue.
El repo [wallee](https://github.com/user-bcp-student17/wallee) contiene el Crew de agentes; este repo contiene el producto.

## Estructura

```text
backend/    NestJS 10 + TypeScript (API en :3000)
frontend/   React 18 + Vite + TypeScript (dev en :5173)
tools/      wallee.py: ejecuta instalación, pruebas y despliegue
compose.yaml  despliegue local con Podman
AGENTS.md   instrucciones para agentes de IA
```

La base incluye un endpoint `GET /health` en el backend y una pantalla que muestra si el backend responde.
Sirve de punto de partida: agrega los módulos de cada HU en `backend/src/<feature>/` y `frontend/src/<feature>/`.

## Requisitos

- Node.js 20 o superior (recomendado 22) y npm.
- Python 3.11 o superior, solo para `tools/wallee.py`.
- Podman 4 o superior con un proveedor de `podman compose` (`podman-compose` o `docker-compose`).
  En Windows y macOS inicia la máquina con `podman machine start`.

## Desarrollo local

```sh
python tools/wallee.py setup        # npm ci en backend y frontend
python tools/wallee.py start backend    # http://localhost:3000
python tools/wallee.py start frontend   # http://localhost:5173
```

En desarrollo Vite redirige `/api` al backend (`http://localhost:3000`). Copia `backend/.env.example` a `backend/.env` si necesitas cambiar el puerto o los orígenes CORS.

## Pruebas

```sh
python tools/wallee.py test                 # local: pruebas, cobertura (85 %) y build
python tools/wallee.py test backend         # solo un componente
python tools/wallee.py podman-test          # en contenedores, con la misma cobertura
```

`podman-test` construye la etapa `test` de cada `Dockerfile` (`podman build --target test`); falla si las pruebas o el umbral de cobertura fallan.

## Despliegue con Podman

```sh
python tools/wallee.py up      # equivale a: podman compose up --build -d
python tools/wallee.py down    # equivale a: podman compose down
```

- Frontend (nginx sin privilegios): `http://localhost:8090`. Cambia el puerto con `FRONTEND_PORT`.
- Backend: `http://localhost:3000/health`.
- nginx reenvía `/api/` al backend dentro de la red de Compose.
- Los puertos se publican solo en `127.0.0.1`.

## Integración continua

`.github/workflows/ci.yml` ejecuta pruebas, cobertura y build de cada componente, y las pruebas en contenedores con Podman.
Cada PR sigue la plantilla de `.github/PULL_REQUEST_TEMPLATE.md` y requiere revisión humana.
