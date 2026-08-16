@echo off
chcp 65001 >nul
cd /d %~dp0
title 博客本地预览 - 关闭本窗口即停止
echo.
echo   正在启动博客预览，浏览器将自动打开 http://localhost:4000
echo   预览中：改完文件保存，浏览器刷新即可看到效果
echo   停止预览：直接关闭本窗口
echo.
start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:4000"
call npx hexo server -p 4000
pause
