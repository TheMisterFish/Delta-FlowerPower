#!/bin/sh
apt-get update -y
apt-get install -y wget
wine python --version
wine python -m pip --version
wine python -m pip install -r /app/public/backend/requirements.txt
wine python -m pip list