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


def handle_git_conflict():
    """处理Git冲突"""
    print("\n🔧 检测到Git冲突，正在处理...")
    
    try:
        # 1. 暂存当前更改
        print("1. 暂存当前更改...")
        subprocess.run(["git", "stash"], check=True)
        
        # 2. 拉取最新代码
        print("2. 拉取最新代码...")
        subprocess.run(["git", "pull", "origin", "main"], check=True)
        
        # 3. 恢复暂存的更改
        print("3. 恢复暂存的更改...")
        result = subprocess.run(["git", "stash", "pop"], capture_output=True, text=True)
        
        # 检查是否有冲突
        if "CONFLICT" in result.stdout or "conflict" in result.stdout.lower():
            print("⚠️ 检测到文件冲突，需要手动解决")
            print("冲突文件:")
            subprocess.run(["git", "status"])
            
            print("\n❌ 请手动解决冲突后重新运行脚本")
            print("或运行: git add . && git commit -m '解决冲突' && git push")
            return False
        
        return True
        
    except Exception as e:
        print(f"处理Git冲突失败: {e}")
        return False

def smart_git_push(message):
    """智能Git推送，自动处理冲突"""
    print(f"\n📤 开始提交到GitHub...")
    
    try:
        # 1. 添加所有文件
        print("1. 添加文件...")
        subprocess.run(["git", "add", "."], check=True)
        
        # 2. 检查是否有变化
        status_result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True
        )
        
        if not status_result.stdout.strip():
            print("没有变化需要提交")
            return True
        
        # 3. 提交
        print("2. 提交更改...")
        subprocess.run(["git", "commit", "-m", message], check=True)
        
        # 4. 尝试推送
        print("3. 尝试推送...")
        push_result = subprocess.run(
            ["git", "push", "origin", "main"],
            capture_output=True,
            text=True
        )
        
        if push_result.returncode == 0:
            print("✓ 推送成功")
            return True
        else:
            # 如果有冲突，先拉取再推送
            if "rejected" in push_result.stderr and "fetch first" in push_result.stderr:
                print("检测到远程有更新，正在拉取并合并...")
                
                # 先拉取
                pull_result = subprocess.run(
                    ["git", "pull", "--rebase", "origin", "main"],
                    capture_output=True,
                    text=True
                )
                
                if pull_result.returncode == 0:
                    print("✓ 拉取成功，重新推送...")
                    # 再次推送
                    push_result2 = subprocess.run(
                        ["git", "push", "origin", "main"],
                        capture_output=True,
                        text=True
                    )
                    if push_result2.returncode == 0:
                        print("✓ 推送成功")
                        return True
                    else:
                        print(f"❌ 推送失败: {push_result2.stderr}")
                        return False
                else:
                    print(f"❌ 拉取失败: {pull_result.stderr}")
                    print("\n尝试使用合并方式...")
                    
                    # 重置并尝试合并方式
                    subprocess.run(["git", "reset", "--hard", "HEAD"], check=True)
                    subprocess.run(["git", "pull", "origin", "main", "--no-rebase"], check=True)
                    
                    # 重新添加和提交
                    subprocess.run(["git", "add", "."], check=True)
                    subprocess.run(["git", "commit", "-m", f"{message} (合并后)"], check=True)
                    
                    # 再次推送
                    push_result3 = subprocess.run(
                        ["git", "push", "origin", "main"],
                        capture_output=True,
                        text=True
                    )
                    
                    if push_result3.returncode == 0:
                        print("✓ 推送成功")
                        return True
                    else:
                        print(f"❌ 最终推送失败: {push_result3.stderr}")
                        return False
            else:
                print(f"❌ 推送失败: {push_result.stderr}")
                return False
                
    except Exception as e:
        print(f"❌ Git操作失败: {e}")
        return False

def simple_git_push():
    """简化版Git推送，让用户手动处理"""
    print("\n📤 Git推送遇到问题")
    print("=" * 60)
    print("请手动运行以下命令:")
    print()
    print("1. 添加所有文件:")
    print("   git add .")
    print()
    print("2. 提交更改:")
    print('   git commit -m "更新图库"')
    print()
    print("3. 拉取远程更新（如果有冲突需要解决）:")
    print("   git pull origin main")
    print()
    print("4. 推送更改:")
    print("   git push origin main")
    print()
    print("=" * 60)
    return False

def auto_resolve_conflicts():
    """自动解决冲突的简单方法"""
    print("\n🤖 尝试自动解决Git冲突...")
    
    try:
        # 保存当前状态
        temp_branch = f"temp-{int(os.times().elapsed)}"
        
        # 创建临时分支保存当前工作
        subprocess.run(["git", "checkout", "-b", temp_branch], check=True)
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", "临时保存"], check=True)
        
        # 切回main并拉取
        subprocess.run(["git", "checkout", "main"], check=True)
        subprocess.run(["git", "pull", "origin", "main"], check=True)
        
        # 合并临时分支
        merge_result = subprocess.run(
            ["git", "merge", temp_branch, "--no-ff", "-m", "自动合并更新"],
            capture_output=True,
            text=True
        )
        
        if merge_result.returncode != 0:
            print("⚠️ 自动合并失败，可能有冲突需要手动解决")
            print("运行以下命令解决冲突:")
            print("1. 解决冲突后: git add .")
            print("2. 完成合并: git merge --continue")
            print("3. 删除临时分支: git branch -d", temp_branch)
            print("4. 推送: git push origin main")
            return False
        
        # 删除临时分支
        subprocess.run(["git", "branch", "-d", temp_branch], check=True)
        
        # 推送
        push_result = subprocess.run(
            ["git", "push", "origin", "main"],
            capture_output=True,
            text=True
        )
        
        if push_result.returncode == 0:
            print("✓ 自动解决冲突并推送成功")
            return True
        else:
            print(f"❌ 推送失败: {push_result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ 自动解决冲突失败: {e}")
        return False

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
    print("  输入 'a' 尝试自动解决Git冲突")
    print("  输入 'm' 手动处理Git操作")
    
    choice = input("\n请选择 (y/n/a/m): ").strip().lower()
    
    if choice == 'y':
        # 获取提交信息
        commit_msg = input("输入提交信息 (留空使用默认): ").strip()
        if not commit_msg:
            commit_msg = f"📦 更新图库数据: {len(compressed_data)}个图库，{total_images}张图片"
        
        # 提交并推送
        if smart_git_push(commit_msg):
            print("\n✅ 构建完成!")
            print(f"🔗 网站应该很快就会更新")
        else:
            print("\n⚠️ Git操作遇到问题")
            print("请尝试手动推送或选择自动解决冲突选项")
    
    elif choice == 'a':
        # 自动解决冲突
        if auto_resolve_conflicts():
            print("\n✅ 构建完成!")
        else:
            print("\n❌ 自动解决冲突失败，请手动处理")
    
    elif choice == 'm':
        # 显示手动操作指南
        simple_git_push()
    
    else:
        print("\n✅ 本地文件已更新")
        print("请稍后手动提交:")
        print("  git add . && git commit -m '更新' && git push")
    
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n✗ 用户中断")
        sys.exit(1)