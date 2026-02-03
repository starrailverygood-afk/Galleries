@echo off
chcp 65001 > nul
echo 正在執行圖庫掃描...
echo.

python scan_galleries.py

echo.
echo 按任意鍵繼續...
pause > nul