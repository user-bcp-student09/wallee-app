#!/usr/bin/env python3
"""Ejecuta instalación, desarrollo, pruebas y despliegue desde la raíz del monorepo."""
import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS = ("backend", "frontend")


def run(command, cwd=ROOT):
    print(f"[{Path(cwd).name}] {' '.join(map(str, command))}", flush=True)
    return subprocess.run(list(map(str, command)), cwd=cwd).returncode


def require(tool, hint):
    path = shutil.which(tool)
    if not path:
        print(f"Falta {tool}. {hint}", file=sys.stderr)
        raise SystemExit(1)
    return path


def run_all(commands, cwd):
    for command in commands:
        result = run(command, cwd)
        if result:
            return result
    return 0


def npm_task(action, component):
    npm = require("npm", "Instala Node.js 20 o superior (recomendado 22).")
    folder = ROOT / component
    install = "ci" if (folder / "package-lock.json").exists() else "install"
    if action == "setup":
        return run([npm, install], folder)
    if action == "start":
        return run([npm, "run", "start:dev" if component == "backend" else "dev"], folder)
    tests = {
        "backend": [[npm, "run", "test:cov"], [npm, "run", "test:e2e"], [npm, "run", "build"]],
        "frontend": [[npm, "run", "test:coverage"], [npm, "run", "build"]],
    }
    return run_all(tests[component], folder)


def podman_test(components):
    podman = require("podman", "Instala Podman 4 o superior.")
    commands = [
        [podman, "build", "--target", "test", "-t", f"wallee-{component}:test", component]
        for component in components
    ]
    return run_all(commands, ROOT)


def podman_compose(*args):
    podman = require("podman", "Instala Podman 4 o superior.")
    return run([podman, "compose", *args])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "action",
        choices=["setup", "start", "test", "podman-test", "up", "down"],
        help="setup/start/test usan npm local; podman-test, up y down usan Podman",
    )
    parser.add_argument("component", choices=COMPONENTS, nargs="?")
    args = parser.parse_args()
    components = (args.component,) if args.component else COMPONENTS

    if args.action == "up":
        return podman_compose("up", "--build", "-d")
    if args.action == "down":
        return podman_compose("down")
    if args.action == "podman-test":
        return podman_test(components)
    if args.action == "start" and not args.component:
        parser.error("Indica backend o frontend. Para ambos en contenedores usa: up")
    for name in components:
        result = npm_task(args.action, name)
        if result:
            return result
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
