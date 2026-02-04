@echo off
chcp 65001 > nul
echo 🔄 更新圖庫數據
echo =====================

echo 📋 步驟 1: 掃描圖庫...
python scan_galleries.py
if errorlevel 1 (
    echo ❌ 掃描失敗
    pause
    exit /b 1
)

echo 🔄 步驟 2: 合併到 app.js...
python merge_to_js.py
if errorlevel 1 (
    echo ❌ 合併失敗
    pause
    exit /b 1
)

echo 🎉 更新完成！
echo 📊 現在可以直接打開 index.html 查看
pause