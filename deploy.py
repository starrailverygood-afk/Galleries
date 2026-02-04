# deploy_fixed.py - 修复版
import os
import json
import subprocess
import sys
from datetime import datetime

def run_scan_script():
    """直接运行扫描脚本并捕获输出"""
    print("📁 正在扫描 galleries 文件夹...")
    
    try:
        # 直接导入并运行扫描脚本
        print("导入扫描脚本模块...")
        
        # 先备份当前目录
        original_dir = os.getcwd()
        
        # 确保我们在正确目录
        if not os.path.exists('galleries'):
            print("❌ 错误：找不到 galleries 文件夹")
            print(f"当前目录: {os.getcwd()}")
            print(f"目录内容: {os.listdir('.')}")
            return None
        
        # 方法1：尝试直接导入
        try:
            import importlib
            import scan_galleries
            
            # 检查模块有哪些函数
            print("扫描脚本中的函数:", [x for x in dir(scan_galleries) if not x.startswith('_')])
            
            # 如果有 main 函数就调用
            if hasattr(scan_galleries, 'main'):
                print("调用 scan_galleries.main()...")
                scan_galleries.main()
            elif hasattr(scan_galleries, 'scan_galleries'):
                print("调用 scan_galleries.scan_galleries()...")
                galleries = scan_galleries.scan_galleries('./galleries')
                return galleries
                
        except Exception as import_error:
            print(f"导入失败: {import_error}")
            
        # 方法2：用子进程运行
        print("尝试通过子进程运行扫描脚本...")
        result = subprocess.run(
            [sys.executable, 'scan_galleries.py'], 
            capture_output=True, 
            text=True, 
            cwd=original_dir
        )
        
        print(f"子进程返回码: {result.returncode}")
        if result.stdout:
            print("输出:", result.stdout[:500])  # 只显示前500字符
        if result.stderr:
            print("错误:", result.stderr[:500])
        
        if result.returncode != 0:
            print("❌ 扫描脚本运行失败")
            return None
            
        print("✅ 扫描脚本执行完成")
        
        # 检查生成了什么文件
        print("检查生成的文件...")
        for file in os.listdir('.'):
            if 'gallery' in file.lower() or 'data' in file.lower():
                print(f"  找到: {file}")
        
        return True
        
    except Exception as e:
        print(f"❌ 扫描过程中出错: {e}")
        import traceback
        traceback.print_exc()
        return None

def update_appjs():
    """更新 app.js 文件"""
    print("🔄 正在更新 app.js...")
    
    # 先查找生成的数据文件
    data_files = []
    for file in os.listdir('.'):
        if 'gallery' in file.lower() and file.endswith(('.js', '.json')):
            data_files.append(file)
    
    if not data_files:
        print("❌ 未找到图库数据文件")
        return False
    
    print(f"找到数据文件: {data_files}")
    
    # 使用第一个找到的数据文件
    data_file = data_files[0]
    
    try:
        if data_file.endswith('.json'):
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                galleries = data.get('galleries', [])
        else:  # .js 文件
            with open(data_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 尝试提取 JSON 数据
            if 'GALLERY_DATA' in content:
                # 查找数组开始和结束
                start = content.find('[')
                end = content.rfind(']') + 1
                if start >= 0 and end > start:
                    json_str = content[start:end]
                    galleries = json.loads(json_str)
                else:
                    print("❌ 无法解析 JS 文件中的数组")
                    return False
            else:
                print("❌ JS 文件中没有 GALLERY_DATA 变量")
                return False
                
    except Exception as e:
        print(f"❌ 读取数据文件失败: {e}")
        return False
    
    print(f"✅ 成功读取 {len(galleries)} 个图库")
    
    # 转换数据格式
    js_data = []
    for gallery in galleries:
        js_gallery = {
            "id": gallery.get("id", f"gallery-{len(js_data)+1:03d}"),
            "name": gallery.get("name", "未命名"),
            "folderPath": gallery.get("folderPath", ""),
            "character": gallery.get("character", []),
            "tags": gallery.get("tags", []),
            "fileCount": gallery.get("fileCount", 0),
            "imageFiles": gallery.get("imageFiles", [])
        }
        js_data.append(js_gallery)
    
    # 读取 app.js 或创建模板
    if not os.path.exists('app.js'):
        print("❌ 找不到 app.js")
        return False
    
    # 备份原文件
    if not os.path.exists('app_template.js'):
        import shutil
        shutil.copy2('app.js', 'app_template.js')
        print("✅ 已创建 app_template.js 备份")
    
    # 读取原文件
    with open('app.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找 LOCAL_GALLERY_DATA 定义
    if 'const LOCAL_GALLERY_DATA = ' in content:
        lines = content.split('\n')
        new_lines = []
        in_array = False
        array_start = -1
        
        for i, line in enumerate(lines):
            if 'const LOCAL_GALLERY_DATA = ' in line and '[' in line:
                # 找到定义行
                indent = line[:len(line) - len(line.lstrip())]
                new_lines.append(f'{indent}const LOCAL_GALLERY_DATA = {json.dumps(js_data, ensure_ascii=False, indent=2)};')
                
                # 检查是否是多行数组
                if ']' not in line:
                    in_array = True
                continue
            elif in_array:
                if ']' in line:
                    in_array = False
                continue
            else:
                new_lines.append(line)
        
        new_content = '\n'.join(new_lines)
        
        # 写入新文件
        with open('app.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ 已更新 app.js")
        return True
    else:
        print("❌ 在 app.js 中找不到 LOCAL_GALLERY_DATA 定义")
        return False

def git_push():
    """推送到 GitHub"""
    print("⬆️  正在推送到 GitHub...")
    
    try:
        # 添加文件
        subprocess.run(['git', 'add', '.'], check=True, capture_output=True)
        
        # 提交
        commit_msg = f'自动更新: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'
        subprocess.run(['git', 'commit', '-m', commit_msg], check=True, capture_output=True)
        
        # 推送
        result = subprocess.run(['git', 'push'], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ 推送成功！")
            print(f"🌐 网站地址: https://starrailverygood-afk.github.io/Galleries/")
            return True
        else:
            print(f"❌ 推送失败: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Git 操作失败: {e}")
        return False

def main():
    print("=" * 60)
    print("                图库部署工具（修复版）")
    print("=" * 60)
    
    # 检查环境
    if not os.path.exists('galleries'):
        print("❌ 错误: 当前目录下没有 galleries 文件夹")
        print(f"当前目录: {os.getcwd()}")
        print("目录内容:")
        for item in os.listdir('.'):
            print(f"  - {item}")
        return
    
    print("✅ 找到 galleries 文件夹")
    
    # 运行扫描
    result = run_scan_script()
    if result is None:
        print("❌ 扫描失败，停止执行")
        return
    
    # 更新 app.js
    if not update_appjs():
        print("❌ 更新 app.js 失败，停止执行")
        return
    
    # 推送到 GitHub
    git_push()
    
    print("\n" + "=" * 60)
    print("🎉 操作完成！")
    print("=" * 60)

if __name__ == '__main__':
    main()