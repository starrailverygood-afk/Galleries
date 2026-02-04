:: build.bat - Windows一键构建脚本
@echo off
chcp 65001 > nul
echo 🚀 图库自动构建脚本
echo.

REM 检查Python
python --version > nul 2>&1
if errorlevel 1 (
    echo 错误: Python未安装或不在PATH中
    pause
    exit /b 1
)

REM 运行构建脚本
python build.py %*

if errorlevel 1 (
    echo.
    echo ✗ 构建失败
    pause
    exit /b 1
)

echo.
echo 按任意键退出...
pause > nul