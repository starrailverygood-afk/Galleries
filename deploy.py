# deploy.py - 专门用于部署
#!/usr/bin/env python3
"""
专门用于GitHub Pages部署的脚本
"""

import subprocess
import json
from pathlib import Path

def deploy_to_github_pages():
    """部署到GitHub Pages"""
    print("🚀 部署到GitHub Pages...")
    
    # 检查是否有未提交的更改
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        capture_output=True,
        text=True
    )
    
    if result.stdout.strip():
        print("📝 有未提交的更改，正在提交...")
        subprocess.run(["git", "add", "."])
        subprocess.run(["git", "commit", "-m", "🚀 自动部署更新"])
    
    # 推送到GitHub
    print("📤 推送到GitHub...")
    subprocess.run(["git", "push", "origin", "main"])
    
    print("✅ 部署完成！")
    print("🌐 你的网站将在几分钟内更新")

if __name__ == "__main__":
    deploy_to_github_pages()