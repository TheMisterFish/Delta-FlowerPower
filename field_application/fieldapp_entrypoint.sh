#!/bin/sh
apt-get update -y
apt-get install -y wget
wine python --version
wine python -m pip --version