import os
import socket
import subprocess
import time
import urllib.error
import urllib.request
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

import pytest


def _wait_for_http(url: str, timeout: float = 20.0) -> None:
    deadline = time.time() + timeout
    last_error: Exception | None = None

    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=1.0) as response:
                if response.status == 200:
                    return
        except (urllib.error.URLError, ConnectionError, TimeoutError) as exc:
            last_error = exc
            time.sleep(0.25)

    raise RuntimeError(f"service at {url} did not become ready: {last_error}")


def _find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def build_server_env(port: int, database_path: str) -> dict[str, str]:
    env = os.environ.copy()
    env["HOST"] = "127.0.0.1"
    env["PORT"] = str(port)
    env["DATABASE_PATH"] = database_path
    return env


@contextmanager
def run_server(env: dict[str, str]) -> Iterator[str]:
    process = subprocess.Popen(
        ["node", "dist/server.js"],
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    server_url = f"http://127.0.0.1:{env['PORT']}"

    try:
        _wait_for_http(f"{server_url}/health")
        yield server_url
    finally:
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()


@pytest.fixture(scope="session")
def server_url(tmp_path_factory: pytest.TempPathFactory) -> Iterator[str]:
    port = _find_free_port()
    database_path = Path(tmp_path_factory.mktemp("crm-data")) / "crm.sqlite"
    env = build_server_env(port, str(database_path))

    subprocess.run(["npm", "run", "build"], check=True, env=env)

    with run_server(env) as url:
        yield url
