#!/usr/bin/env python3
"""
圖庫掃描腳本 - 加強版
新增功能：儲存每個圖庫中的所有圖片名稱
"""

import os
import json
import sys
from pathlib import Path
from typing import Dict, List, Set

# 設定檔案路徑
GALLERIES_DIR = Path("galleries")
DATA_FILE = Path("scan_output/galleries.json")

def ensure_directories():
    """確保必要的目錄存在"""
    GALLERIES_DIR.mkdir(exist_ok=True)
    DATA_FILE.parent.mkdir(exist_ok=True)

def get_image_files(folder_path: Path) -> List[str]:
    """取得資料夾中的所有圖片檔案名稱"""
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
    image_files = []
    
    for file in folder_path.iterdir():
        if file.is_file() and file.suffix.lower() in image_extensions:
            image_files.append(file.name)
    
    return sorted(image_files)

def scan_gallery_folders() -> List[str]:
    """掃描 galleries/ 資料夾中的所有圖庫資料夾"""
    galleries = []
    
    if not GALLERIES_DIR.exists():
        print(f"錯誤: {GALLERIES_DIR} 資料夾不存在")
        return galleries
    
    for item in GALLERIES_DIR.iterdir():
        if item.is_dir():
            # 檢查資料夾中是否有圖片檔案
            has_images = any(
                file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
                for file in item.iterdir()
            )
            if has_images:
                galleries.append(item.name)
            else:
                print(f"警告: 資料夾 '{item.name}' 中沒有圖片檔案，已跳過")
    
    return sorted(galleries)

def count_images_in_folder(folder_name: str) -> int:
    """計算資料夾中的圖片數量"""
    folder_path = GALLERIES_DIR / folder_name
    if not folder_path.exists():
        return 0
    
    return len(get_image_files(folder_path))

def load_existing_data() -> Dict[str, Dict]:
    """載入現有的 JSON 資料"""
    if not DATA_FILE.exists():
        return {}
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 檢查資料格式
        if isinstance(data, dict):
            # 如果是舊格式的字典，轉換為新的字典格式
            galleries_dict = {}
            for gallery_name, gallery_data in data.items():
                if isinstance(gallery_data, dict):
                    galleries_dict[gallery_name] = gallery_data
            return galleries_dict
        elif isinstance(data, list):
            # 如果是列表格式，轉換為字典
            galleries_dict = {}
            for gallery in data:
                if isinstance(gallery, dict) and 'name' in gallery:
                    galleries_dict[gallery['name']] = gallery
            return galleries_dict
        else:
            print("警告: 資料格式不正確，將創建新的")
            return {}
            
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        print(f"警告: 無法讀取現有資料 ({e})，將創建新的")
        return {}

def get_user_input_for_gallery(gallery_name: str, existing_data: Dict[str, Dict], next_id_num: int) -> Dict:
    """為新圖庫獲取用戶輸入"""
    print(f"\n{'='*60}")
    print(f"設定新圖庫: {gallery_name}")
    print(f"{'='*60}")
    
    # 計算圖片數量並取得所有圖片名稱
    folder_path = GALLERIES_DIR / gallery_name
    image_files = get_image_files(folder_path)
    file_count = len(image_files)
    
    print(f" 偵測到 {file_count} 張圖片")
    
    # 顯示前幾張圖片名稱
    if image_files:
        print(" 圖片檔案:")
        for i, filename in enumerate(image_files[:5], 1):
            print(f"  {i}. {filename}")
        if len(image_files) > 5:
            print(f"  ... 還有 {len(image_files) - 5} 張圖片")
    
    # 獲取角色標籤
    while True:
        characters_input = input(" 請輸入角色標籤（多個用逗號分隔，必填）: ").strip()
        if characters_input:
            characters = [c.strip() for c in characters_input.split(',')]
            characters = [c for c in characters if c]  # 移除空值
            if characters:
                break
        print(" 錯誤: 角色標籤不能為空")
    
    # 獲取其他標籤
    tags_input = input("  請輸入其他標籤（多個用.分隔）: ").strip()
    tags = [t.strip() for t in tags_input.split('.')] if tags_input else []
    tags = [t for t in tags if t]  # 移除空值
    
    # 生成唯一 ID
    gallery_id = f"gallery-{next_id_num:03d}"
    
    return {
        "id": gallery_id,
        "name": gallery_name,
        "folderPath": f"galleries/{gallery_name}",
        "character": characters,
        "tags": tags,
        "fileCount": file_count,
        "imageFiles": image_files  # 新增：儲存所有圖片檔案名稱
    }

def update_galleries_data(existing: Dict[str, Dict], current_folders: List[str]) -> List[Dict]:
    """更新圖庫資料，偵測新增/刪除"""
    updated_data = []
    
    # 處理已刪除的圖庫
    deleted_galleries = set(existing.keys()) - set(current_folders)
    if deleted_galleries:
        print(f"\n  發現已刪除的圖庫 ({len(deleted_galleries)} 個):")
        for gallery in sorted(deleted_galleries):
            print(f"  • {gallery}")
    
    # 計算現有的最大 ID 數字
    existing_ids = []
    for gallery in existing.values():
        if 'id' in gallery:
            # 提取數字部分
            try:
                if gallery['id'].startswith('gallery-'):
                    num_part = gallery['id'].split('-')[1]
                    if num_part.isdigit():
                        existing_ids.append(int(num_part))
            except (IndexError, ValueError):
                pass
    
    # 找出下一個可用的 ID 數字
    next_id_num = max(existing_ids, default=0) + 1
    
    # 處理現有的圖庫
    for folder_name in current_folders:
        if folder_name in existing:
            # 現有圖庫：更新圖片數量和圖片檔案列表
            gallery_data = existing[folder_name].copy()
            # 確保有必要的欄位
            if 'id' not in gallery_data:
                gallery_data['id'] = f"gallery-{next_id_num:03d}"
                next_id_num += 1
            if 'folderPath' not in gallery_data:
                gallery_data['folderPath'] = f"galleries/{folder_name}"
            
            # 重新掃描圖片檔案
            folder_path = GALLERIES_DIR / folder_name
            new_image_files = get_image_files(folder_path)
            old_file_count = gallery_data.get('fileCount', 0)
            new_file_count = len(new_image_files)
            
            # 更新圖片數量和檔案列表
            gallery_data['fileCount'] = new_file_count
            gallery_data['imageFiles'] = new_image_files  # 更新圖片檔案列表
            
            # 檢查是否有檔案變動
            old_image_files = gallery_data.get('imageFiles', [])
            if set(old_image_files) != set(new_image_files):
                added = set(new_image_files) - set(old_image_files)
                removed = set(old_image_files) - set(new_image_files)
                
                if added:
                    print(f" {folder_name}: 新增 {len(added)} 張圖片")
                if removed:
                    print(f" {folder_name}: 移除 {len(removed)} 張圖片")
            elif old_file_count != new_file_count:
                print(f" {folder_name}: 圖片數量更新 ({old_file_count} → {new_file_count})")
            
            updated_data.append(gallery_data)
        else:
            # 新圖庫：獲取用戶輸入
            gallery_data = get_user_input_for_gallery(folder_name, existing, next_id_num)
            updated_data.append(gallery_data)
            next_id_num += 1
    
    return updated_data

def save_data(data: List[Dict]):
    """儲存資料到 JSON 檔案"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n 資料已儲存到 {DATA_FILE}")
    print(f" 總共 {len(data)} 個圖庫")

def print_summary(data: List[Dict], current_folders: List[str], existing: Dict[str, Dict]):
    """顯示掃描結果摘要"""
    new_count = len(set(current_folders) - set(existing.keys()))
    deleted_count = len(set(existing.keys()) - set(current_folders))
    unchanged_count = len(set(current_folders) & set(existing.keys()))
    
    print(f"\n{'='*60}")
    print("掃描結果摘要")
    print(f"{'='*60}")
    print(f"• 總圖庫數量: {len(data)} 個")
    print(f"• 新增圖庫: {new_count} 個")
    print(f"• 已刪除圖庫: {deleted_count} 個")
    print(f"• 未變更圖庫: {unchanged_count} 個")
    
    # 計算總圖片數
    total_images = sum(g['fileCount'] for g in data)
    print(f"• 總圖片數量: {total_images} 張")
    
    # 顯示標籤統計
    all_characters = set()
    all_tags = set()
    for gallery in data:
        all_characters.update(gallery['character'])
        all_tags.update(gallery['tags'])
    
    print(f"\n  標籤統計:")
    print(f"  • 角色標籤: {len(all_characters)} 個")
    print(f"  • 其他標籤: {len(all_tags)} 個")
    
    if all_characters:
        print(f"    角色列表: {', '.join(sorted(all_characters))}")
    
    if all_tags:
        # 只顯示前10個標籤
        tags_list = sorted(all_tags)
        if len(tags_list) > 10:
            print(f"    標籤列表: {', '.join(tags_list[:10])}... (共{len(tags_list)}個)")
        else:
            print(f"    標籤列表: {', '.join(tags_list)}")

def main():
    """主函數"""
    print("  圖庫掃描腳本 (加強版)")
    print(" 功能: 掃描圖庫並儲存所有圖片檔案名稱")
    print(f" 掃描目錄: {GALLERIES_DIR.absolute()}")
    
    # 確保目錄存在
    ensure_directories()
    
    # 掃描現有資料夾
    print(f"\n 正在掃描 {GALLERIES_DIR}/ 資料夾...")
    current_folders = scan_gallery_folders()
    
    if not current_folders:
        print(" 錯誤: 沒有找到任何圖庫資料夾")
        print(f"請將圖庫資料夾放置在 {GALLERIES_DIR.absolute()}/")
        sys.exit(1)
    
    print(f" 找到 {len(current_folders)} 個圖庫資料夾:")
    for i, folder in enumerate(current_folders, 1):
        count = count_images_in_folder(folder)
        print(f"  {i:2d}. {folder} ({count} 張圖片)")
    
    # 載入現有資料
    existing_data = load_existing_data()
    if existing_data:
        print(f"\n 載入現有資料: {len(existing_data)} 個圖庫記錄")
    
    # 更新資料
    updated_data = update_galleries_data(existing_data, current_folders)
    
    # 顯示摘要
    print_summary(updated_data, current_folders, existing_data)
    
    # 確認儲存
    print(f"\n 是否要儲存更新到 {DATA_FILE}?")
    print("  注意: 這將覆寫現有的檔案")
    response = input(" 輸入 'y' 確認，其他任意鍵取消: ").strip().lower()
    
    if response == 'y':
        save_data(updated_data)
        print("\n 完成")
        print(" 每個圖庫的圖片檔案名稱已儲存在 'imageFiles' 欄位中")
    else:
        print("\n 已取消，資料未儲存")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  掃描已取消")
        sys.exit(0)
    except Exception as e:
        print(f"\n 錯誤: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)