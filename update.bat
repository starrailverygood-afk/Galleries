@echo off
chcp 65001 >nul
echo 正在更新图库...
echo.
python deploy.py
echo.
pause