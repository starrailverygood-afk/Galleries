@echo off
chcp 65001 > nul
echo 🚀 安全版一鍵部署
echo =====================

echo 🔄 步驟 0: 檢查 Git 狀態...
git status
if errorlevel 1 (
    echo ⚠️  Git 狀態異常
    pause
    exit /b 1
)

echo 📋 步驟 1: 掃描圖庫...
python scan_galleries.py
if errorlevel 1 (
    echo ❌ 掃描失敗
    pause
    exit /b 1
)

echo 🔄 步驟 2: 合併數據到 app.js...
python merge_to_js.py
if errorlevel 1 (
    echo ❌ 合併失敗
    pause
    exit /b 1
)

echo 📦 步驟 3: 提交到 Git...
git add .
echo 變更內容:
git status --short

set /p commit_msg="請輸入提交訊息 (預設: 更新圖庫): "
if "%commit_msg%"=="" set commit_msg=更新圖庫

git commit -m "%commit_msg%"

echo ☁️  步驟 4: 推送到 GitHub...
git push origin main

if errorlevel 1 (
    echo ❌ 推送失敗
    echo 請手動執行: git pull origin main 先同步
    pause
    exit /b 1
)

echo 🎉 部署完成！
pause