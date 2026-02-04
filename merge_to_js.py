#!/usr/bin/env python3
"""
自動將 galleries.json 合併到 app.js 中
"""

import json
import re
import sys

def main():
    try:
        print("正在合併 galleries.json 到 app.js...")
        
        # 1. 讀取 galleries.json
        with open('galleries.json', 'r', encoding='utf-8') as f:
            galleries_data = json.load(f)
        
        print(f"✅ 讀取 galleries.json 成功，共 {len(galleries_data)} 個圖庫")
        
        # 2. 讀取 app.js
        with open('app.js', 'r', encoding='utf-8') as f:
            app_js_content = f.read()
        
        # 3. 將 galleries 轉換為 JS 格式的字符串
        galleries_js = json.dumps(galleries_data, ensure_ascii=False, indent=2)
        
        # 4. 替換 LOCAL_GALLERY_DATA
        # 尋找 LOCAL_GALLERY_DATA 定義的位置
        pattern = r'const LOCAL_GALLERY_DATA = \[[\s\S]*?\];'
        
        if re.search(pattern, app_js_content):
            # 替換現有的定義
            new_content = re.sub(
                pattern,
                f'const LOCAL_GALLERY_DATA = {galleries_js};',
                app_js_content,
                flags=re.DOTALL
            )
            print("✅ 找到並替換了 LOCAL_GALLERY_DATA")
        else:
            # 在開頭插入新的定義
            print("⚠️  未找到 LOCAL_GALLERY_DATA，將在開頭插入")
            insert_pos = app_js_content.find('// 顏色列表用於生成佔位圖')
            if insert_pos != -1:
                new_content = (
                    app_js_content[:insert_pos] +
                    f'const LOCAL_GALLERY_DATA = {galleries_js};\n\n' +
                    app_js_content[insert_pos:]
                )
            else:
                # 如果找不到插入點，在開頭插入
                new_content = f'const LOCAL_GALLERY_DATA = {galleries_js};\n\n{app_js_content}'
        
        # 5. 寫回 app.js
        with open('app.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ 成功合併 {len(galleries_data)} 個圖庫到 app.js")
        print(f"✅ 共 {sum(g['fileCount'] for g in galleries_data)} 張圖片")
        
        # 6. 顯示統計信息
        print("\n📊 圖庫統計:")
        for gallery in galleries_data[:5]:  # 只顯示前5個
            print(f"  • {gallery['name']}: {gallery['fileCount']} 張圖片")
        
        if len(galleries_data) > 5:
            print(f"  ... 還有 {len(galleries_data) - 5} 個圖庫")
        
    except FileNotFoundError as e:
        print(f"❌ 錯誤: 找不到檔案 {e.filename}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ 錯誤: galleries.json 格式不正確 - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 錯誤: {type(e).__name__}: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()