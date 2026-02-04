# git_helper.py - Git操作助手
#!/usr/bin/env python3
"""
Git操作助手 - 专门处理Git推送问题
"""

import subprocess
import sys

def run_git_command(cmd):
    """运行Git命令并返回结果"""
    try:
        result = subprocess.run(
            ["git"] + cmd,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def force_push():
    """强制推送（危险，仅用于备份）"""
    print("⚠️ 警告: 强制推送会覆盖远程仓库!")
    confirm = input("确定要继续吗? (输入 'yes' 确认): ")
    
    if confirm.lower() == 'yes':
        success, out, err = run_git_command(["push", "origin", "main", "--force"])
        if success:
            print("✓ 强制推送成功")
            return True
        else:
            print(f"❌ 强制推送失败: {err}")
            return False
    else:
        print("取消强制推送")
        return False

def reset_and_push():
    """重置并重新提交"""
    print("\n🔄 重置并重新提交...")
    
    # 1. 获取远程状态
    print("1. 获取远程状态...")
    success, out, err = run_git_command(["fetch", "origin"])
    if not success:
        print(f"❌ 获取失败: {err}")
        return False
    
    # 2. 重置到远程
    print("2. 重置到远程状态...")
    success, out, err = run_git_command(["reset", "--hard", "origin/main"])
    if not success:
        print(f"❌ 重置失败: {err}")
        return False
    
    print("✓ 已重置到远程状态")
    print("请重新运行 build.py")
    return True

def main():
    """主函数"""
    print("🛠️ Git操作助手")
    print("=" * 60)
    print("1. 强制推送 (危险!)")
    print("2. 重置到远程并重新开始")
    print("3. 显示Git状态")
    print("4. 手动操作指南")
    print("=" * 60)
    
    choice = input("请选择 (1-4): ").strip()
    
    if choice == "1":
        force_push()
    elif choice == "2":
        reset_and_push()
    elif choice == "3":
        run_git_command(["status"])
    elif choice == "4":
        print("\n📖 手动操作指南:")
        print("=" * 60)
        print("1. 保存当前工作:")
        print("   git stash")
        print()
        print("2. 拉取最新代码:")
        print("   git pull origin main")
        print()
        print("3. 恢复工作:")
        print("   git stash pop")
        print()
        print("4. 如果有冲突，解决冲突后:")
        print("   git add .")
        print("   git commit -m '解决冲突'")
        print()
        print("5. 推送:")
        print("   git push origin main")
        print("=" * 60)
    else:
        print("无效选择")

if __name__ == "__main__":
    main()