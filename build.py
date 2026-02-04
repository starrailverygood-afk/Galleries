# build.py - 自动化构建脚本
#!/usr/bin/env python3
"""
自动化构建脚本 - 一键完成所有部署工作
"""

import os
import json
import subprocess
import sys
from pathlib import Path
import shutil
import hashlib

# 配置路径
GALLERIES_DIR = Path("galleries")
SCAN_OUTPUT_DIR = Path("scan_output")
GALLERIES_JSON = SCAN_OUTPUT_DIR / "galleries.json"
APP_JS = Path("app.js")
INDEX_HTML = Path("index.html")
STYLE_CSS = Path("style.css")

def check_git_installed():
    """检查Git是否安装"""
    try:
        subprocess.run(["git", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("错误: Git未安装或不在PATH中")
        return False

def get_gallery_data():
    """从galleries.json获取图库数据"""
    if not GALLERIES_JSON.exists():
        print("错误: galleries.json不存在，请先运行scan.bat")
        return None
    
    try:
        with open(GALLERIES_JSON, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取galleries.json失败: {e}")
        return None

def update_app_js(gallery_data):
    """更新app.js中的LOCAL_GALLERY_DATA"""
    if not APP_JS.exists():
        print("错误: app.js不存在")
        return False
    
    try:
        # 读取app.js内容
        with open(APP_JS, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 查找并替换LOCAL_GALLERY_DATA部分
        start_marker = "const LOCAL_GALLERY_DATA = ["
        end_marker = "];"
        
        start_index = content.find(start_marker)
        if start_index == -1:
            print("错误: 在app.js中找不到LOCAL_GALLERY_DATA")
            return False
        
        # 查找结束位置
        bracket_count = 1
        search_index = start_index + len(start_marker)
        end_index = -1
        
        for i in range(search_index, min(search_index + 100000, len(content))):
            if content[i] == '[':
                bracket_count += 1
            elif content[i] == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    end_index = i + 1  # 包含']'
                    break
        
        if end_index == -1:
            print("错误: 无法找到LOCAL_GALLERY_DATA的结束位置")
            return False
        
        # 创建新的数据部分
        new_data_json = json.dumps(gallery_data, ensure_ascii=False, indent=2)
        new_data = f"{start_marker}{new_data_json}{end_marker}"
        
        # 替换内容
        updated_content = content[:start_index] + new_data + content[end_index:]
        
        # 写回文件
        with open(APP_JS, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print("✓ 已更新app.js中的LOCAL_GALLERY_DATA")
        return True
        
    except Exception as e:
        print(f"更新app.js失败: {e}")
        return False

def compress_gallery_data(gallery_data):
    """压缩图库数据，移除不必要的空格"""
    compressed = []
    for gallery in gallery_data:
        compressed_gallery = {
            "id": gallery["id"],
            "name": gallery["name"],
            "folderPath": gallery["folderPath"],
            "character": gallery["character"],
            "tags": gallery["tags"],
            "fileCount": gallery["fileCount"],
            "imageFiles": gallery["imageFiles"]
        }
        compressed.append(compressed_gallery)
    return compressed

def run_git_command(args, cwd="."):
    """运行Git命令"""
    try:
        result = subprocess.run(
            ["git"] + args,
            cwd=cwd,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        if result.returncode != 0:
            print(f"Git错误: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"执行Git命令失败: {e}")
        return False

def commit_and_push(message):
    """提交并推送到GitHub"""
    print("\n📤 开始提交到GitHub...")
    
    # 添加所有文件
    if not run_git_command(["add", "."]):
        return False
    
    # 提交
    if not run_git_command(["commit", "-m", message]):
        print("警告: 提交可能失败，可能是没有变化")
    
    # 推送
    print("正在推送到GitHub...")
    if run_git_command(["push"]):
        print("✓ 推送成功")
        return True
    else:
        print("✗ 推送失败")
        return False

def create_build_report(gallery_data, images_count):
    """创建构建报告"""
    report = []
    report.append("=" * 60)
    report.append("🏗️ 构建报告")
    report.append("=" * 60)
    report.append(f"📁 图库数量: {len(gallery_data)}")
    report.append(f"🖼️ 总图片数: {images_count}")
    
    # 统计角色和标签
    characters = set()
    tags = set()
    for gallery in gallery_data:
        characters.update(gallery["character"])
        tags.update(gallery["tags"])
    
    report.append(f"👤 角色数量: {len(characters)}")
    report.append(f"🏷️ 标签数量: {len(tags)}")
    report.append("=" * 60)
    
    return "\n".join(report)

def main():
    """主函数"""
    print("🚀 自动化构建脚本")
    print("=" * 60)
    
    # 检查Git
    if not check_git_installed():
        return 1
    
    # 1. 运行扫描脚本（如果需要）
    if not GALLERIES_JSON.exists() or len(sys.argv) > 1 and sys.argv[1] == "--scan":
        print("🔍 运行图库扫描...")
        try:
            subprocess.run(["python", "scan_galleries.py"], check=True)
            print("✓ 扫描完成")
        except Exception as e:
            print(f"✗ 扫描失败: {e}")
            return 1
    
    # 2. 获取图库数据
    print("📊 读取图库数据...")
    gallery_data = get_gallery_data()
    if not gallery_data:
        return 1
    
    # 3. 压缩数据（减小JS文件大小）
    print("📦 压缩图库数据...")
    compressed_data = compress_gallery_data(gallery_data)
    
    # 4. 更新app.js
    print("📝 更新app.js...")
    if not update_app_js(compressed_data):
        return 1
    
    # 5. 统计图片数量
    total_images = sum(g["fileCount"] for g in compressed_data)
    
    # 6. 显示报告
    report = create_build_report(compressed_data, total_images)
    print(report)
    
    # 7. 询问是否提交
    print("\n📤 是否要提交并推送到GitHub?")
    print("  输入 'y' 确认提交")
    print("  输入 'n' 仅更新本地文件")
    print("  输入 's' 查看Git状态")
    
    choice = input("\n请选择 (y/n/s): ").strip().lower()
    
    if choice == 'y':
        # 获取提交信息
        commit_msg = input("输入提交信息 (留空使用默认): ").strip()
        if not commit_msg:
            commit_msg = f"📦 更新图库数据: {len(compressed_data)}个图库，{total_images}张图片"
        
        # 提交并推送
        if commit_and_push(commit_msg):
            print("\n✅ 构建完成!")
            print(f"🔗 网站应该很快就会更新")
        else:
            print("\n⚠️ 构建完成，但Git操作可能有问题")
    
    elif choice == 's':
        # 显示Git状态
        subprocess.run(["git", "status"])
        print("\n⚠️ 请手动运行 git add . && git commit && git push")
    
    else:
        print("\n✅ 本地文件已更新，请稍后手动提交")
        print("  运行命令: git add . && git commit -m '更新' && git push")
    
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n✗ 用户中断")
        sys.exit(1)