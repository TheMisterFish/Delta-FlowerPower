#!/bin/sh
apt-get update -y
apt-get install -y wget
wine python --version
wine python -m pip --version
wine python -m pip install --upgrade setuptools
wine python -m pip install typed_ast‑1.1.0‑cp36‑cp36m‑win_amd64.whl
wine python -m pip install -r /app/public/backend/requirements.txt
wine python -m pip list