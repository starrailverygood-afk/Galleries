//翻頁速度自訂
const SPEED_LEVELS = [1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000]; // 毫秒

// 全域變數
let galleryDatabase = [];
let activeFilters = { character: [], tags: [] };
let fsAutoPlayInterval = null;
let fsProgressInterval = null;
let autoPlaySpeed = 10000; // 初始10秒
let isFsAutoPlaying = false;
let progressStartTime = 0;

// 直接嵌入你的 JSON 數據
const LOCAL_GALLERY_DATA = [
  {
    "id": "gallery-001",
    "name": "1",
    "folderPath": "1",
    "character": [
      "1"
    ],
    "tags": [],
    "fileCount": 272,
    "imageFiles": []
  },
  {
    "id": "gallery-002",
    "name": "甘雨-1-DIY",
    "folderPath": "甘雨-1-DIY",
    "character": [
      "甘雨"
    ],
    "tags": [
      "1",
      "DIY"
    ],
    "fileCount": 20,
    "imageFiles": []
  },
  {
    "id": "gallery-003",
    "name": "甘雨-2-咬",
    "folderPath": "甘雨-2-咬",
    "character": [
      "甘雨"
    ],
    "tags": [
      "2",
      "咬"
    ],
    "fileCount": 27,
    "imageFiles": []
  }
];
    "tags": [
      "正常"
    ],
    "fileCount": 20,
    "imageFiles": [
      "1431_01.jpg",
      "1432_02.jpg",
      "1433_03.jpg",
      "1434_04.jpg",
      "1435_05.jpg",
      "1436_06.jpg",
      "1437_07.jpg",
      "1438_08.jpg",
      "1439_09.jpg",
      "1440_10.jpg",
      "1441_11.jpg",
      "1442_12.jpg",
      "1443_13.jpg",
      "1444_14.jpg",
      "1445_15.jpg",
      "1446_16.jpg",
      "1447_17.jpg",
      "1448_18.jpg",
      "1449_19.jpg",
      "1450_20.jpg"
    ]
  },
  {
    "id": "gallery-004",
    "name": "刻晴-1-咬",
    "folderPath": "galleries/刻晴-1-咬",
    "character": [
      "刻晴"
    ],
    "tags": [
      "口交"
    ],
    "fileCount": 39,
    "imageFiles": [
      "0594_99278257_1.jpg",
      "0595_99278257_2.jpg",
      "0596_99278257_3.jpg",
      "0597_99278257_4.jpg",
      "0598_99278257_5.jpg",
      "0599_99278257_6.jpg",
      "0600_99278257_7.jpg",
      "0601_99278257_8.jpg",
      "0602_99278257_9.jpg",
      "0603_99278257_10.jpg",
      "0604_99278257_11.jpg",
      "0605_99278257_12.jpg",
      "0606_99278257_13.jpg",
      "0607_99278257_14.jpg",
      "0608_99278257_15.jpg",
      "0609_99278257_16.jpg",
      "0610_99278257_17.jpg",
      "0611_99278257_18.jpg",
      "0612_99278257_19.jpg",
      "0613_99278257_20.jpg",
      "0614_99301948_1.jpg",
      "0615_99301948_2.jpg",
      "0616_99301948_3.jpg",
      "0617_99301948_4.jpg",
      "0618_99301948_5.jpg",
      "0619_99301948_6.jpg",
      "0620_99301948_7.jpg",
      "0621_99301948_8.jpg",
      "0622_99301948_9.jpg",
      "0623_99301948_10.jpg",
      "0624_99301948_11.jpg",
      "0625_99301948_12.jpg",
      "0626_99301948_13.jpg",
      "0627_99301948_14.jpg",
      "0628_99301948_15.jpg",
      "0629_99301948_16.jpg",
      "0630_99301948_17.jpg",
      "0631_99301948_18.jpg",
      "0632_99301948_19.jpg"
    ]
  },
  {
    "id": "gallery-005",
    "name": "宵宮-1-正常",
    "folderPath": "galleries/宵宮-1-正常",
    "character": [
      "宵宮"
    ],
    "tags": [
      "正常"
    ],
    "fileCount": 15,
    "imageFiles": [
      "0039_01.jpg",
      "0040_02.jpg",
      "0041_03.jpg",
      "0042_04.jpg",
      "0043_05.jpg",
      "0044_06.jpg",
      "0045_07.jpg",
      "0046_08.jpg",
      "0047_09.jpg",
      "0048_10.jpg",
      "0049_11.jpg",
      "0050_12.jpg",
      "0051_13.jpg",
      "0052_14.jpg",
      "0053_15.jpg"
    ]
  },
  {
    "id": "gallery-006",
    "name": "希兒-1-咬",
    "folderPath": "galleries/希兒-1-咬",
    "character": [
      "希兒"
    ],
    "tags": [
      "口交"
    ],
    "fileCount": 15,
    "imageFiles": [
      "1416_01.jpg",
      "1417_02.jpg",
      "1418_03.jpg",
      "1419_04.jpg",
      "1420_05.jpg",
      "1421_06.jpg",
      "1422_07.jpg",
      "1423_08.jpg",
      "1424_09.jpg",
      "1425_10.jpg",
      "1426_11.jpg",
      "1427_12.jpg",
      "1428_13.jpg",
      "1429_14.jpg",
      "1430_15.jpg"
    ]
  },
  {
    "id": "gallery-007",
    "name": "珊瑚宮心海-1-正常",
    "folderPath": "galleries/珊瑚宮心海-1-正常",
    "character": [
      "珊瑚宮心海"
    ],
    "tags": [
      "正常"
    ],
    "fileCount": 21,
    "imageFiles": [
      "0001_01.jpg",
      "0002_02.jpg",
      "0003_03.jpg",
      "0004_04.jpg",
      "0005_05.jpg",
      "0006_06.jpg",
      "0007_07.jpg",
      "0008_08.jpg",
      "0009_09.jpg",
      "0010_10.jpg",
      "0011_11.jpg",
      "0012_12.jpg",
      "0013_13.jpg",
      "0014_14.jpg",
      "0015_15.jpg",
      "0016_16.jpg",
      "0017_17.jpg",
      "0018_18.jpg",
      "0019_19.jpg",
      "0020_20.jpg",
      "0021_21.jpg"
    ]
  },
  {
    "id": "gallery-008",
    "name": "珊瑚宮心海-2-咬",
    "folderPath": "galleries/珊瑚宮心海-2-咬",
    "character": [
      "珊瑚宮心海"
    ],
    "tags": [
      "口交"
    ],
    "fileCount": 27,
    "imageFiles": [
      "1451_01.jpg",
      "1452_02.jpg",
      "1453_03.jpg",
      "1454_04.jpg",
      "1455_05.jpg",
      "1456_06.jpg",
      "1457_07.jpg",
      "1458_08.jpg",
      "1459_09.jpg",
      "1460_10.jpg",
      "1461_11.jpg",
      "1462_12.jpg",
      "1463_13.jpg",
      "1464_14.jpg",
      "1465_15.jpg",
      "1466_16.jpg",
      "1467_17.jpg",
      "1468_18.jpg",
      "1469_19.jpg",
      "1470_20.jpg",
      "1471_21.jpg",
      "1472_22.jpg",
      "1473_23.jpg",
      "1474_24.jpg",
      "1475_25.jpg",
      "1476_26.jpg",
      "1477_27.jpg"
    ]
  },
  {
    "id": "gallery-001",
    "name": "甘雨-1-DIY",
    "folderPath": "galleries/甘雨-1-DIY",
    "character": [
      "甘雨"
    ],
    "tags": [
      "DIY"
    ],
    "fileCount": 20,
    "imageFiles": [
      "0000_1.jpg",
      "0000_10.jpg",
      "0000_11.jpg",
      "0000_12.jpg",
      "0000_13.jpg",
      "0000_14.jpg",
      "0000_15.jpg",
      "0000_16.jpg",
      "0000_17.jpg",
      "0000_18.jpg",
      "0000_19.jpg",
      "0000_2.jpg",
      "0000_20.jpg",
      "0000_3.jpg",
      "0000_4.jpg",
      "0000_5.jpg",
      "0000_6.jpg",
      "0000_7.jpg",
      "0000_8.jpg",
      "0000_9.jpg"
    ]
  },
  {
    "id": "gallery-002",
    "name": "甘雨-2-咬",
    "folderPath": "galleries/甘雨-2-咬",
    "character": [
      "甘雨"
    ],
    "tags": [
      "口交"
    ],
    "fileCount": 27,
    "imageFiles": [
      "0388_99015476_1.png",
      "0389_99015476_2.png",
      "0390_99015476_3.png",
      "0391_99015476_4.png",
      "0392_99015476_5.png",
      "0393_99015476_6.png",
      "0394_99015476_7.png",
      "0395_99015476_8.png",
      "0396_99015476_9.png",
      "0398_99015476_11.png",
      "0399_99015476_12.png",
      "0400_99015476_13.png",
      "0401_99015476_14.png",
      "0402_99015476_15.png",
      "0403_99015476_16.png",
      "0404_99015476_17.png",
      "0405_99015476_18.png",
      "0406_99015476_19.png",
      "0407_99015476_20.png",
      "0408_99015476_21.png",
      "0409_99015476_22.png",
      "0410_99015476_23.png",
      "0411_99015476_24.png",
      "0412_99015476_25.png",
      "0413_99015476_26.png",
      "0414_99015476_27.png",
      "0415_99015476_28.png"
    ]
  },
  {
    "id": "gallery-009",
    "name": "甘雨-3-丘丘人",
    "folderPath": "galleries/甘雨-3-丘丘人",
    "character": [
      "甘雨"
    ],
    "tags": [
      "強暴"
    ],
    "fileCount": 15,
    "imageFiles": [
      "0462_99069769_1.jpg",
      "0463_99069769_2.jpg",
      "0464_99069769_3.jpg",
      "0465_99069769_4.jpg",
      "0466_99069769_5.jpg",
      "0467_99069769_6.jpg",
      "0468_99069769_7.jpg",
      "0469_99069769_8.jpg",
      "0470_99069769_9.jpg",
      "0471_99069769_10.jpg",
      "0472_99069769_11.jpg",
      "0473_99069769_12.jpg",
      "0474_99069769_13.jpg",
      "0475_99069769_14.jpg",
      "0476_99069769_15.jpg"
    ]
  },
  {
    "id": "gallery-010",
    "name": "甘雨-4-史萊姆",
    "folderPath": "galleries/甘雨-4-史萊姆",
    "character": [
      "甘雨"
    ],
    "tags": [
      "強暴"
    ],
    "fileCount": 10,
    "imageFiles": [
      "1111_98084170_1.png",
      "1112_98084170_2.png",
      "1113_98084170_3.png",
      "1114_98084170_4.png",
      "1115_98084170_5.png",
      "1116_98084170_6.png",
      "1117_98084170_7.png",
      "1118_98084170_8.png",
      "1119_98084170_9.png",
      "1120_98084170_10.png"
    ]
  },
  {
    "id": "gallery-011",
    "name": "甘雨-5-丘丘人2",
    "folderPath": "galleries/甘雨-5-丘丘人2",
    "character": [
      "甘雨"
    ],
    "tags": [
      "強暴"
    ],
    "fileCount": 14,
    "imageFiles": [
      "1217_97599570_1.png",
      "1218_97599570_2.png",
      "1219_97599570_3.png",
      "1220_97599570_4.png",
      "1221_97599570_5.png",
      "1222_97599570_6.png",
      "1223_97599570_7.png",
      "1224_97599570_8.png",
      "1225_97599570_9.png",
      "1226_97599570_10.png",
      "1227_97599570_11.png",
      "1228_97599570_12.png",
      "1229_97599570_13.png",
      "1230_97599570_14.png"
    ]
  },
  {
    "id": "gallery-012",
    "name": "甘雨-6-從後面來",
    "folderPath": "galleries/甘雨-6-從後面來",
    "character": [
      "甘雨"
    ],
    "tags": [
      "後入"
    ],
    "fileCount": 22,
    "imageFiles": [
      "1478_01.jpg",
      "1479_02.jpg",
      "1480_03.jpg",
      "1481_04.jpg",
      "1482_05.jpg",
      "1483_06.jpg",
      "1484_07.jpg",
      "1485_08.jpg",
      "1486_09.jpg",
      "1487_10.jpg",
      "1488_11.jpg",
      "1489_12.jpg",
      "1490_13.jpg",
      "1491_14.jpg",
      "1492_15.jpg",
      "1493_16.jpg",
      "1494_17.jpg",
      "1495_18.jpg",
      "1496_19.jpg",
      "1497_20.jpg",
      "1498_21.jpg",
      "1499_22.jpg"
    ]
  },
  {
    "id": "gallery-013",
    "name": "知更鳥-1-酒店",
    "folderPath": "galleries/知更鳥-1-酒店",
    "character": [
      "知更鳥"
    ],
    "tags": [
      "乳交",
      "口交"
    ],
    "fileCount": 47,
    "imageFiles": [
      "Robin_Hotel_Part_2_1.png",
      "Robin_Hotel_Part_2_10.png",
      "Robin_Hotel_Part_2_11.png",
      "Robin_Hotel_Part_2_12.png",
      "Robin_Hotel_Part_2_13.png",
      "Robin_Hotel_Part_2_14.png",
      "Robin_Hotel_Part_2_15.png",
      "Robin_Hotel_Part_2_16.png",
      "Robin_Hotel_Part_2_17.png",
      "Robin_Hotel_Part_2_18.png",
      "Robin_Hotel_Part_2_19.png",
      "Robin_Hotel_Part_2_2.png",
      "Robin_Hotel_Part_2_20.png",
      "Robin_Hotel_Part_2_21.png",
      "Robin_Hotel_Part_2_22.png",
      "Robin_Hotel_Part_2_23.png",
      "Robin_Hotel_Part_2_24.png",
      "Robin_Hotel_Part_2_25.png",
      "Robin_Hotel_Part_2_26.png",
      "Robin_Hotel_Part_2_27.png",
      "Robin_Hotel_Part_2_28.png",
      "Robin_Hotel_Part_2_29.png",
      "Robin_Hotel_Part_2_3.png",
      "Robin_Hotel_Part_2_30.png",
      "Robin_Hotel_Part_2_31.png",
      "Robin_Hotel_Part_2_32.png",
      "Robin_Hotel_Part_2_33.png",
      "Robin_Hotel_Part_2_34.png",
      "Robin_Hotel_Part_2_35.png",
      "Robin_Hotel_Part_2_36.png",
      "Robin_Hotel_Part_2_37.png",
      "Robin_Hotel_Part_2_38.png",
      "Robin_Hotel_Part_2_39.png",
      "Robin_Hotel_Part_2_4.png",
      "Robin_Hotel_Part_2_40.png",
      "Robin_Hotel_Part_2_41.png",
      "Robin_Hotel_Part_2_42.png",
      "Robin_Hotel_Part_2_43.png",
      "Robin_Hotel_Part_2_44.png",
      "Robin_Hotel_Part_2_45.png",
      "Robin_Hotel_Part_2_46.png",
      "Robin_Hotel_Part_2_47.png",
      "Robin_Hotel_Part_2_5.png",
      "Robin_Hotel_Part_2_6.png",
      "Robin_Hotel_Part_2_7.png",
      "Robin_Hotel_Part_2_8.png",
      "Robin_Hotel_Part_2_9.png"
    ]
  },
  {
    "id": "gallery-014",
    "name": "神里綾華-1-正常",
    "folderPath": "galleries/神里綾華-1-正常",
    "character": [
      "神里凌華"
    ],
    "tags": [
      "正常"
    ],
    "fileCount": 15,
    "imageFiles": [
      "0206_98686007_1.png",
      "0207_98686007_2.png",
      "0208_98686007_3.png",
      "0209_98686007_4.png",
      "0210_98686007_5.png",
      "0211_98686007_6.png",
      "0212_98686007_7.png",
      "0213_98686007_8.png",
      "0214_98686007_9.png",
      "0215_98686007_10.png",
      "0216_98686007_11.png",
      "0217_98686007_12.png",
      "0218_98686007_13.png",
      "0219_98686007_14.png",
      "0220_98686007_15.png"
    ]
  },
  {
    "id": "gallery-015",
    "name": "神里綾華-2-咬",
    "folderPath": "galleries/神里綾華-2-咬",
    "character": [
      "神里凌華"
    ],
    "tags": [
      "口交"
    ],
    "fileCount": 12,
    "imageFiles": [
      "0849_98454620_1.png",
      "0850_98454620_2.png",
      "0851_98454620_3.png",
      "0852_98454620_4.png",
      "0853_98454620_5.png",
      "0854_98454620_6.png",
      "0855_98454620_7.png",
      "0856_98454620_8.png",
      "0857_98454620_9.png",
      "0866_98441577_9.png",
      "0867_98441577_10.png",
      "0868_98441577_11.png"
    ]
  }
];

// 顏色列表用於生成佔位圖
const PLACEHOLDER_COLORS = [
    '#3b82f6', // 藍
    '#8b5cf6', // 紫
    '#10b981', // 綠
    '#f59e0b', // 黃
    '#ef4444', // 紅
    '#ec4899'  // 粉
];

// DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 隱藏載入動畫
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
    
    try {
        // 使用本地數據
        galleryDatabase = LOCAL_GALLERY_DATA;
        
        // 為每個圖庫設置封面圖片
        processGalleryCovers();
        
        // 初始化介面
        updateStats();
        updateTagFilters();
        renderGalleryList(galleryDatabase);
        
    } catch (error) {
        console.error('初始化失敗:', error);
        showError('初始化失敗: ' + error.message);
    }
});

// 為每個圖庫設置封面圖片 - 使用實際的圖片檔案
function processGalleryCovers() {
    for (const gallery of galleryDatabase) {
        // 設置顏色和縮寫
        gallery.color = getGalleryColor(gallery.id);
        gallery.initials = getGalleryInitials(gallery.name);
        
        // 如果有 imageFiles，使用第一張圖片作為封面
        if (gallery.imageFiles && gallery.imageFiles.length > 0) {
            // GitHub Pages 使用相對路徑
            gallery.coverImage = `galleries/${gallery.name}/${gallery.imageFiles[0]}`;
            
            // 為所有圖片檔案建立完整相對路徑
            gallery.fullImagePaths = gallery.imageFiles.map(file => 
                `galleries/${gallery.name}/${file}`
            );
        } else {
            // 如果沒有圖片，使用佔位圖
            gallery.coverImage = createPlaceholderSVG(gallery, 1);
        }
    }
}

// 根據 ID 獲取顏色
function getGalleryColor(galleryId) {
    const idNum = parseInt(galleryId.replace('gallery-', '')) || 0;
    return PLACEHOLDER_COLORS[idNum % PLACEHOLDER_COLORS.length];
}

// 獲取圖庫名稱的縮寫（用於佔位圖）
function getGalleryInitials(name) {
    // 取前2-3個字符
    if (name.length <= 3) return name;
    
    // 如果是中文，取前2個字符
    const isChinese = /[\u4e00-\u9fff]/.test(name);
    if (isChinese) {
        return name.substring(0, 2);
    }
    
    // 如果是英文或混合，取單詞首字母
    const words = name.split(/[-_\s]+/);
    if (words.length >= 2) {
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
}

// 創建佔位圖 SVG
function createPlaceholderSVG(gallery, index = 1) {
    const svg = `<svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="${gallery.color || '#3b82f6'}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">
            ${gallery.initials || '圖'}
        </text>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// 生成佔位圖片 HTML（純 CSS）
function generatePlaceholderHTML(gallery) {
    const color = gallery.color || PLACEHOLDER_COLORS[0];
    const initials = gallery.initials || '圖';
    
    return `
        <div class="placeholder-cover" style="background-color: ${color}">
            <div class="placeholder-text">${initials}</div>
        </div>
    `;
}

// 更新統計資訊（保持不變）
function updateStats() {
    const totalGalleries = document.getElementById('totalGalleries');
    const totalImages = document.getElementById('totalImages');
    
    if (totalGalleries) {
        totalGalleries.textContent = galleryDatabase.length;
    }
    
    if (totalImages) {
        const total = galleryDatabase.reduce((sum, gallery) => sum + (gallery.fileCount || 0), 0);
        totalImages.textContent = total;
    }
}

// 更新標籤篩選器（保持不變）
function updateTagFilters() {
    // 收集所有角色標籤
    const allCharacters = new Set();
    galleryDatabase.forEach(gallery => {
        if (Array.isArray(gallery.character)) {
            gallery.character.forEach(char => allCharacters.add(char));
        } else if (gallery.character) {
            allCharacters.add(gallery.character);
        }
    });
    
    // 收集所有標籤
    const allTags = new Set();
    galleryDatabase.forEach(gallery => {
        if (Array.isArray(gallery.tags)) {
            gallery.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    // 更新角色標籤
    updateTagFilterSection('character-tags', allCharacters, 'character');
    
    // 更新其他標籤
    updateTagFilterSection('custom-tags', allTags, 'tags');
}

// 更新標籤篩選器部分（保持不變）
function updateTagFilterSection(containerId, tagSet, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // 按字母順序排序
    const sortedTags = Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'zh-TW'));
    
    sortedTags.forEach(tagText => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        if (activeFilters[type]?.includes(tagText)) {
            tagElement.classList.add('selected');
        }
        tagElement.textContent = tagText;
        tagElement.dataset.type = type;
        tagElement.dataset.value = tagText;
        
        tagElement.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateActiveFilters();
            filterGalleries();
        });
        
        container.appendChild(tagElement);
    });
}

// 更新活動篩選器（保持不變）
function updateActiveFilters() {
    activeFilters = { character: [], tags: [] };
    
    document.querySelectorAll('.tag.selected').forEach(tag => {
        const type = tag.dataset.type;
        const value = tag.dataset.value;
        if (type && value && activeFilters[type]) {
            activeFilters[type].push(value);
        }
    });
}

// 篩選圖庫（保持不變）
function filterGalleries() {
    if (!galleryDatabase.length) {
        renderEmptyState();
        return;
    }
    
    let filtered = [...galleryDatabase];
    
    // 應用角色篩選
    if (activeFilters.character.length > 0) {
        filtered = filtered.filter(gallery => {
            const galleryChars = Array.isArray(gallery.character) ? gallery.character : [gallery.character];
            return activeFilters.character.some(filterChar => 
                galleryChars.includes(filterChar)
            );
        });
    }
    
    // 應用標籤篩選
    if (activeFilters.tags.length > 0) {
        filtered = filtered.filter(gallery => {
            const galleryTags = Array.isArray(gallery.tags) ? gallery.tags : [];
            return activeFilters.tags.some(filterTag => 
                galleryTags.includes(filterTag)
            );
        });
    }
    
    renderGalleryList(filtered);
}

// 渲染圖庫列表（修改圖片顯示部分）
function renderGalleryList(galleries) {
    const container = document.getElementById('galleryView');
    if (!container) return;
    
    if (galleries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-images"></i>
                <h3>沒有找到圖庫</h3>
                <p>請嘗試選擇其他標籤或清除篩選條件</p>
                <button class="btn-clear" onclick="clearAllFilters()" style="margin-top: 20px;">
                    <i class="fas fa-times"></i> 清除篩選
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = galleries.map(gallery => `
        <div class="gallery-card" data-id="${gallery.id}" onclick="openGalleryViewer('${gallery.id}')">
            <div class="gallery-cover-container">
                <!-- 真實圖片，加載失敗時顯示佔位圖 -->
                <img src="${gallery.coverImage}" alt="${gallery.name}" class="gallery-cover" 
                     onerror="handleCoverImageError(this, '${gallery.id}')"
                     loading="lazy">
                
                <!-- CSS 佔位圖（默認隱藏） -->
                <div class="placeholder-cover" style="background-color: ${gallery.color}; display: none;">
                    <div class="placeholder-text">${gallery.initials}</div>
                </div>
            </div>
            
            <div class="gallery-info">
                <div class="gallery-title">
                    <span>${gallery.name}</span>
                    <span class="file-count">${gallery.fileCount || 0} 張</span>
                </div>
                
                <div class="gallery-tags">
                    ${(Array.isArray(gallery.character) ? gallery.character : [gallery.character])
                        .filter(char => char)
                        .map(char => `
                            <span class="tag" data-type="character">${char}</span>
                        `).join('')}
                    ${(Array.isArray(gallery.tags) ? gallery.tags : [])
                        .filter(tag => tag)
                        .map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 處理封面圖片加載錯誤
window.handleCoverImageError = function(imgElement, galleryId) {
    const gallery = galleryDatabase.find(g => g.id === galleryId);
    if (!gallery) return;
    
    // 隱藏圖片，顯示佔位圖
    imgElement.style.display = 'none';
    const placeholder = imgElement.nextElementSibling;
    if (placeholder) {
        placeholder.style.display = 'flex';
    }
};

// 清除所有篩選（保持不變）
window.clearAllFilters = function() {
    activeFilters = { character: [], tags: [] };
    document.querySelectorAll('.tag.selected').forEach(tag => {
        tag.classList.remove('selected');
    });
    renderGalleryList(galleryDatabase);
};

// 顯示錯誤訊息（保持不變）
function showError(message) {
    const container = document.getElementById('galleryView');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>
            <h3>錯誤</h3>
            <p>${message}</p>
        </div>
    `;
}

// 打開圖庫瀏覽器
window.openGalleryViewer = function(galleryId) {
    const gallery = galleryDatabase.find(g => g.id === galleryId);
    if (!gallery) return;
    
    // 創建瀏覽器彈窗
    const viewer = document.createElement('div');
    viewer.className = 'gallery-viewer';
    viewer.innerHTML = `
    <div class="viewer-overlay" onclick="closeGalleryViewer()"></div>
    <div class="viewer-content">
        <div class="viewer-header">
            <h2>${gallery.name}</h2>
            <button class="viewer-close" onclick="closeGalleryViewer()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="viewer-info">
            <div class="info-stats">
                <span><i class="fas fa-image"></i> ${gallery.fileCount} 張圖片</span>
                <span><i class="fas fa-user"></i> ${Array.isArray(gallery.character) ? gallery.character.join(', ') : gallery.character}</span>
            </div>
            <div class="info-tags">
                ${(Array.isArray(gallery.tags) ? gallery.tags : [])
                    .map(tag => `<span class="viewer-tag">${tag}</span>`)
                    .join('')}
            </div>
        </div>
        
        <div class="image-grid" id="imageGrid-${gallery.id}">
            <div class="loading-images">
                <i class="fas fa-spinner fa-spin"></i> 載入圖片中...
            </div>
        </div>
        
        <div class="viewer-controls">
        <div class="control-group">
            <button class="viewer-btn" onclick="prevImage()">
                <i class="fas fa-chevron-left"></i> 上一張
            </button>
            <span class="image-counter">
                <span id="currentImage">1</span> / <span id="totalImages">${gallery.fileCount}</span>
            </span>
            <button class="viewer-btn" onclick="nextImage()">
                下一張 <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>
    </div>
    
    <!-- 全屏圖片查看器 -->
    <div class="fullscreen-viewer" id="fullscreenViewer" style="display: none;">
        <div class="fs-header">
            <span id="fsImageTitle">圖片標題</span>
            <div class="fs-auto-controls">
                <button class="fs-auto-btn" onclick="fsChangeSpeed(-1)" title="減速">
                    <i class="fas fa-minus"></i>
                </button>
                <button class="fs-auto-btn" id="fsToggleAutoPlay" onclick="fsToggleAutoPlay()" title="暫停/開始">
                    <i class="fas fa-play" id="fsAutoPlayIcon"></i>
                </button>
                <button class="fs-auto-btn" onclick="fsChangeSpeed(1)" title="加速">
                    <i class="fas fa-plus"></i>
                </button>
                <span class="fs-speed-indicator" id="fsSpeedIndicator">3秒</span>
            </div>
            <button class="fs-close" onclick="closeFullscreen()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="fs-image-container">
            <img id="fsImage" src="" alt="">
            <button class="fs-nav fs-prev" onclick="fsPrevImage()">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="fs-nav fs-next" onclick="fsNextImage()">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <div class="fs-info">
            <span id="fsImageIndex">1 / ${gallery.fileCount}</span>
        </div>
    </div>
`;
    
    document.body.appendChild(viewer);
    
    // 載入圖片
    loadGalleryImages(gallery);
    
    // 設置當前圖庫
    window.currentGallery = gallery;
    window.currentImageIndex = 0;
    window.galleryImages = gallery.fullImagePaths || [];
};

// 載入圖庫中的圖片 - 使用實際的圖片檔案
async function loadGalleryImages(gallery) {
    const imageGrid = document.getElementById(`imageGrid-${gallery.id}`);
    if (!imageGrid) return;
    
    // 清空載入動畫
    imageGrid.innerHTML = '';
    
    try {
        // 使用實際的圖片檔案
        const imageFiles = gallery.fullImagePaths || [];
        
        if (imageFiles.length === 0) {
            // 如果沒有圖片，顯示佔位圖
            for (let i = 1; i <= gallery.fileCount; i++) {
                const placeholder = document.createElement('div');
                placeholder.className = 'grid-image-item placeholder';
                placeholder.innerHTML = `
                    <div class="placeholder-box" style="background-color: ${gallery.color}">
                        <div class="placeholder-text-small">${i}</div>
                    </div>
                `;
                imageGrid.appendChild(placeholder);
            }
            return;
        }
        
        // 顯示所有圖片
        imageFiles.forEach((imagePath, index) => {
            const imgItem = document.createElement('div');
            imgItem.className = 'grid-image-item';
            imgItem.innerHTML = `
                <img src="${imagePath}" 
                     alt="${gallery.name} - ${index + 1}" 
                     onclick="openImageFullscreen('${gallery.id}', ${index})"
                     loading="lazy"
                     onerror="handleGridImageError(this, '${gallery.id}', ${index})">
            `;
            imageGrid.appendChild(imgItem);
        });
        
    } catch (error) {
        console.error('載入圖片失敗:', error);
        imageGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-circle"></i>
                <p>無法載入圖片</p>
            </div>
        `;
    }
}

// 處理網格圖片加載錯誤
window.handleGridImageError = function(imgElement, galleryId, index) {
    const gallery = galleryDatabase.find(g => g.id === galleryId);
    if (!gallery) return;
    
    // 創建佔位圖
    const placeholder = createPlaceholderSVG(gallery, index + 1);
    imgElement.src = placeholder;
    imgElement.onerror = null; // 防止無限循環
};

// 打開圖片全屏瀏覽
window.openImageFullscreen = function(galleryId, imageIndex) {
    const gallery = galleryDatabase.find(g => g.id === galleryId);
    if (!gallery) return;
    
    // 使用實際的圖片路徑
    const images = gallery.fullImagePaths || [];
    
    window.fullscreenImages = images;
    window.currentFsIndex = imageIndex;
    window.currentGalleryId = galleryId;
    
    // 顯示全屏瀏覽器
    const fsViewer = document.getElementById('fullscreenViewer');
    if (fsViewer) {
        // 更新 HTML 結構，添加進度條
        fsViewer.innerHTML = `
        <div class="fs-progress-container">
            ${images.map((_, idx) => `
                <div class="fs-progress-bar" id="progressBar-${idx}">
                    <div class="fs-progress-fill" id="progressFill-${idx}"></div>
                </div>
            `).join('')}
        </div>
        <div class="fs-header">
            <button class="fs-close" onclick="closeFullscreen()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="fs-image-container">
            <img id="fsImage" src="" alt="">
            <div class="fs-controls-overlay">
                <button class="fs-control-btn fs-prev-btn" onclick="fsPrevImage()" title="上一張">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="fs-control-btn fs-next-btn" onclick="fsNextImage()" title="下一張">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="fs-auto-controls">
                    <!-- 減號按鈕：減速 -->
                    <button class="fs-auto-btn" onclick="fsChangeSpeed(-1)" title="減慢速度">
                        <i class="fas fa-minus"></i>
                    </button>
                    <!-- 播放按鈕：預設顯示播放圖標（▶️） -->
                    <button class="fs-auto-btn" id="fsToggleAutoPlay" onclick="fsToggleAutoPlay()" title="開始自動播放">
                        <i class="fas fa-play" id="fsAutoPlayIcon"></i>
                    </button>
                    <!-- 加號按鈕：加速 -->
                    <button class="fs-auto-btn" onclick="fsChangeSpeed(1)" title="加快速度">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="fs-info">
            <span id="fsImageIndex">${imageIndex + 1} / ${images.length}</span>
            <span class="fs-speed-info" id="fsSpeedInfo">3秒/張</span>
        </div>
    `;
        
        fsViewer.style.display = 'block';
        updateFullscreenImage();
        
        // 初始化自動播放
        setTimeout(() => {
            console.log('調用 initSpeedControls');
            initSpeedControls();
            updateFsSpeedDisplay();
        }, 100);
        
        console.log('自動播放預設關閉');
        updateFsSpeedDisplay();
        
        // 初始化進度條
        updateProgressBars();
    }
};

// 更新全屏圖片
function updateFullscreenImage() {
    if (!window.fullscreenImages || window.currentFsIndex === undefined) return;
    
    const fsImage = document.getElementById('fsImage');
    const fsImageTitle = document.getElementById('fsImageTitle');
    const fsImageIndex = document.getElementById('fsImageIndex');
    const gallery = galleryDatabase.find(g => g.id === window.currentGalleryId);
    
    if (fsImage && window.fullscreenImages[window.currentFsIndex]) {
        fsImage.src = window.fullscreenImages[window.currentFsIndex];
        fsImageTitle.textContent = `${gallery?.name || ''} - 圖片 ${window.currentFsIndex + 1}`;
        fsImageIndex.textContent = `${window.currentFsIndex + 1} / ${window.fullscreenImages.length}`;
        
        // 如果圖片加載失敗，使用佔位圖
        fsImage.onerror = function() {
            const placeholder = createPlaceholderSVG(gallery || {}, window.currentFsIndex + 1);
            this.src = placeholder;
            this.onerror = null;
        };
    }
}

// 全屏瀏覽器控制
window.fsPrevImage = function() {
    if (window.currentFsIndex > 0) {
        window.currentFsIndex--;
        updateFullscreenImage();
    }
};

window.fsNextImage = function() {
    if (window.fullscreenImages && window.currentFsIndex < window.fullscreenImages.length - 1) {
        window.currentFsIndex++;
        updateFullscreenImage();
    }
};

window.closeFullscreen = function() {
    const fsViewer = document.getElementById('fullscreenViewer');
    if (fsViewer) {
        fsViewer.style.display = 'none';
    }
};

// 關閉圖庫瀏覽器
window.closeGalleryViewer = function() {
    const viewer = document.querySelector('.gallery-viewer');
    if (viewer) {
        viewer.remove();
    }
    
    // 也關閉全屏瀏覽器
    closeFullscreen();
};

// 圖片導航
window.prevImage = function() {
    if (window.currentImageIndex > 0) {
        window.currentImageIndex--;
        updateImageCounter();
    }
};

window.nextImage = function() {
    if (window.currentGallery && window.currentImageIndex < window.currentGallery.fileCount - 1) {
        window.currentImageIndex++;
        updateImageCounter();
    }
};

function updateImageCounter() {
    const currentImage = document.getElementById('currentImage');
    if (currentImage) {
        currentImage.textContent = window.currentImageIndex + 1;
    }
}

// 點擊圖庫卡片
document.addEventListener('click', function(e) {
    const galleryCard = e.target.closest('.gallery-card');
    if (galleryCard) {
        const galleryId = galleryCard.dataset.id;
        const gallery = galleryDatabase.find(g => g.id === galleryId);
        if (gallery) {
            console.log('點擊圖庫:', gallery.name);
        }
    }
});

// 自動播放相關函數

// 切換自動播放狀態（圖庫瀏覽器）
window.toggleAutoPlay = function() {
    isAutoPlaying = !isAutoPlaying;
    const toggleBtn = document.getElementById('toggleAutoPlay');
    const icon = document.getElementById('autoPlayIcon');
    const text = document.getElementById('autoPlayText');
    
    if (isAutoPlaying) {
        icon.className = 'fas fa-pause';
        text.textContent = '暫停';
        startAutoPlay();
    } else {
        icon.className = 'fas fa-play';
        text.textContent = '開始';
        stopAutoPlay();
    }
};

// 開始自動播放
function startAutoPlay() {
    stopAutoPlay(); // 確保先停止之前的計時器
    
    autoPlayInterval = setInterval(() => {
        nextImage();
    }, autoPlaySpeed);
}

// 停止自動播放
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// 改變播放速度
window.changeAutoPlaySpeed = function(direction) {
    // 速度級別（毫秒）
    const speedLevels = [5000, 4000, 3000, 2000, 1000, 500];
    let currentIndex = speedLevels.indexOf(autoPlaySpeed);
    
    if (currentIndex === -1) {
        // 如果當前速度不在列表中，找到最接近的
        currentIndex = speedLevels.findIndex(speed => speed <= autoPlaySpeed);
        if (currentIndex === -1) currentIndex = speedLevels.length - 1;
    }
    
    // 調整速度
    if (direction === 1 && currentIndex > 0) {
        // 加速（減少間隔時間）
        currentIndex--;
    } else if (direction === -1 && currentIndex < speedLevels.length - 1) {
        // 減速（增加間隔時間）
        currentIndex++;
    }
    
    autoPlaySpeed = speedLevels[currentIndex];
    
    // 更新顯示
    updateSpeedDisplay();
    
    // 如果正在播放，重啟計時器
    if (isAutoPlaying) {
        startAutoPlay();
    }
};

// 更新速度顯示
function updateSpeedDisplay() {
    const indicator = document.getElementById('speedIndicator');
    const fsIndicator = document.getElementById('fsSpeedIndicator');
    
    // 轉換為秒
    const seconds = autoPlaySpeed / 1000;
    const displayText = `${seconds}秒`;
    
    if (indicator) indicator.textContent = displayText;
    if (fsIndicator) fsIndicator.textContent = displayText;
}

// 全屏模式的自動播放函數

// 切換全屏自動播放
window.fsToggleAutoPlay = function() {
    isFsAutoPlaying = !isFsAutoPlaying;
    const toggleBtn = document.getElementById('fsToggleAutoPlay');
    const icon = document.getElementById('fsAutoPlayIcon');
    
    if (isFsAutoPlaying) {
        icon.className = 'fas fa-pause';
        startFsAutoPlay();
    } else {
        icon.className = 'fas fa-play';
        stopFsAutoPlay();
    }
};

// 開始全屏自動播放
function startFsAutoPlay() {
    stopFsAutoPlay(); // 確保先停止之前的計時器
    
    autoPlayInterval = setInterval(() => {
        fsNextImage();
    }, autoPlaySpeed);
}

// 停止全屏自動播放
function stopFsAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}


// 修改圖片導航函數，確保在自動播放時循環
window.nextImage = function() {
    if (window.currentGallery) {
        if (window.currentImageIndex < window.currentGallery.fileCount - 1) {
            window.currentImageIndex++;
        } else {
            // 如果是最後一張，回到第一張
            window.currentImageIndex = 0;
        }
        updateImageCounter();
    }
};

window.fsNextImage = function() {
    if (window.fullscreenImages && window.currentFsIndex < window.fullscreenImages.length - 1) {
        window.currentFsIndex++;
    } else {
        // 如果是最後一張，回到第一張
        window.currentFsIndex = 0;
    }
    updateFullscreenImage();
};

// 修改關閉函數，確保停止計時器
window.closeGalleryViewer = function() {
    const viewer = document.querySelector('.gallery-viewer');
    if (viewer) {
        viewer.remove();
    }
    
    // 停止自動播放
    stopAutoPlay();
    stopFsAutoPlay();
    isAutoPlaying = false;
    isFsAutoPlaying = false;
    
    // 也關閉全屏瀏覽器
    closeFullscreen();
};

window.closeFullscreen = function() {
    const fsViewer = document.getElementById('fullscreenViewer');
    if (fsViewer) {
        fsViewer.style.display = 'none';
    }
    
    // 停止自動播放
    stopFsAutoPlay();
    isFsAutoPlaying = false;
};

// 在頁面卸載時停止計時器
window.addEventListener('beforeunload', function() {
    stopAutoPlay();
    stopFsAutoPlay();
});

// 開始全屏自動播放（帶進度條）
function startFsAutoPlay() {
    stopFsAutoPlay(); // 確保先停止之前的計時器
    stopProgressAnimation(); // 停止進度條動畫
    
    // 更新按鈕狀態
    const icon = document.getElementById('fsAutoPlayIcon');
    if (icon) icon.className = 'fas fa-pause';
    
    isFsAutoPlaying = true;
    
    // 啟動進度條動畫
    startProgressAnimation();
    
    // 設置切換到下一張圖片的計時器
    fsAutoPlayInterval = setTimeout(() => {
        fsNextImage();
    }, autoPlaySpeed);
}

// 停止全屏自動播放
function stopFsAutoPlay() {
    if (fsAutoPlayInterval) {
        clearTimeout(fsAutoPlayInterval);
        fsAutoPlayInterval = null;
    }
    stopProgressAnimation();
    
    const icon = document.getElementById('fsAutoPlayIcon');
    if (icon) icon.className = 'fas fa-play';
    
    isFsAutoPlaying = false;
}

// 切換全屏自動播放
window.fsToggleAutoPlay = function() {
    if (isFsAutoPlaying) {
        stopFsAutoPlay();
    } else {
        startFsAutoPlay();
    }
};

// 開始進度條動畫
function startProgressAnimation() {
    stopProgressAnimation(); // 確保先停止之前的動畫
    
    progressStartTime = Date.now();
    
    fsProgressInterval = requestAnimationFrame(animateProgressBar);
}

// 停止進度條動畫
function stopProgressAnimation() {
    if (fsProgressInterval) {
        cancelAnimationFrame(fsProgressInterval);
        fsProgressInterval = null;
    }
}

// 動畫進度條
function animateProgressBar() {
    if (!isFsAutoPlaying) return;
    
    const elapsed = Date.now() - progressStartTime;
    const progress = Math.min(elapsed / autoPlaySpeed, 1);
    
    const progressFill = document.getElementById(`progressFill-${window.currentFsIndex}`);
    if (progressFill) {
        progressFill.style.width = `${progress * 100}%`;
    }
    
    if (progress < 1) {
        fsProgressInterval = requestAnimationFrame(animateProgressBar);
    }
}

// 更新所有進度條狀態
function updateProgressBars() {
    const totalBars = window.fullscreenImages ? window.fullscreenImages.length : 0;
    
    for (let i = 0; i < totalBars; i++) {
        const progressFill = document.getElementById(`progressFill-${i}`);
        if (progressFill) {
            if (i < window.currentFsIndex) {
                // 已播放過的：完全填滿
                progressFill.style.width = '100%';
                progressFill.style.backgroundColor = '#ffffff';
            } else if (i === window.currentFsIndex) {
                // 當前播放的：開始動畫
                progressFill.style.width = '0%';
                progressFill.style.backgroundColor = '#ffffff';
            } else {
                // 尚未播放的：空白
                progressFill.style.width = '0%';
                progressFill.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }
        }
    }
}

// 改變播放速度
// 修改 fsChangeSpeed 函數
window.fsChangeSpeed = function(direction) {
    console.log('fsChangeSpeed 被調用, direction:', direction);
    
    // 修正：速度數組應該從快到慢排列，這樣索引越小速度越快
    const speedLevels = SPEED_LEVELS;
    console.log('當前速度:', autoPlaySpeed, 'ms');
    
    // 找到當前速度在列表中的位置
    let currentIndex = speedLevels.indexOf(autoPlaySpeed);
    
    if (currentIndex === -1) {
        // 如果當前速度不在列表中，找到最接近的
        for (let i = 0; i < speedLevels.length; i++) {
            if (speedLevels[i] <= autoPlaySpeed) {
                currentIndex = i;
                break;
            }
        }
        if (currentIndex === -1) currentIndex = speedLevels.length - 1;
    }
    
    console.log('當前速度索引:', currentIndex, '對應速度:', speedLevels[currentIndex]);
    
    // 方向邏輯（修正後）：
    // 數組現在是從快到慢：索引0最快(500ms)，索引5最慢(5000ms)
    // direction = 1（加號）應該加速 -> 索引變小（更快）
    // direction = -1（減號）應該減速 -> 索引變大（更慢）
    if (direction === 1) { // 點擊加號，要加速
        if (currentIndex > 0) {
            currentIndex--; // 移到更小的索引（更快）
            console.log('加速: 索引從', currentIndex + 1, '->', currentIndex);
        } else {
            console.log('已經是最快速度');
        }
    } else if (direction === -1) { // 點擊減號，要減速
        if (currentIndex < speedLevels.length - 1) {
            currentIndex++; // 移到更大的索引（更慢）
            console.log('減速: 索引從', currentIndex - 1, '->', currentIndex);
        } else {
            console.log('已經是最慢速度');
        }
    }
    
    // 更新速度
    const oldSpeed = autoPlaySpeed;
    autoPlaySpeed = speedLevels[currentIndex];
    
    const isAccelerating = direction === 1;
    console.log(`速度變更: ${oldSpeed}ms -> ${autoPlaySpeed}ms (${isAccelerating ? '加速' : '減速'})`);
    console.log('新的速度:', (autoPlaySpeed / 1000) + '秒/張');
    
    // 更新顯示
    updateFsSpeedDisplay();
    
    // 如果正在自動播放，重新開始
    if (isFsAutoPlaying) {
        console.log('重新啟動自動播放');
        startFsAutoPlay();
    }
};

// 確保 updateFsSpeedDisplay 函數正確更新顯示
function updateFsSpeedDisplay() {
    const speedInfo = document.getElementById('fsSpeedInfo');
    if (speedInfo) {
        const seconds = autoPlaySpeed / 1000;
        speedInfo.textContent = `${seconds}秒/張`;
        console.log('更新速度顯示:', speedInfo.textContent);
    }
    
    // 同時更新可能存在的其他速度指示器
    const fsSpeedIndicator = document.getElementById('fsSpeedIndicator');
    if (fsSpeedIndicator) {
        const seconds = autoPlaySpeed / 1000;
        fsSpeedIndicator.textContent = `${seconds}秒`;
    }
}

// 修改 initSpeedControls 函數，確保按鈕正確綁定
function initSpeedControls() {
    console.log('初始化速度控制');
    
    // 初始化速度顯示
    updateFsSpeedDisplay();
    
    // 移除舊的事件監聽器
    document.querySelectorAll('.fs-auto-btn').forEach(btn => {
        btn.onclick = null;
    });
    
    // 重新綁定按鈕事件
    document.querySelectorAll('.fs-auto-btn').forEach(btn => {
        if (btn.querySelector('.fa-plus')) {
            btn.onclick = function(e) {
                console.log('加號按鈕被點擊');
                fsChangeSpeed(1);
                e.stopPropagation();
            };
        } else if (btn.querySelector('.fa-minus')) {
            btn.onclick = function(e) {
                console.log('減號按鈕被點擊');
                fsChangeSpeed(-1);
                e.stopPropagation();
            };
        }
    });
    
    // 綁定自動播放切換按鈕
    const toggleBtn = document.getElementById('fsToggleAutoPlay');
    if (toggleBtn) {
        console.log('找到自動播放切換按鈕');
        toggleBtn.onclick = function(e) {
            console.log('自動播放切換按鈕被點擊');
            fsToggleAutoPlay();
            e.stopPropagation();
        };
    }
    
    console.log('速度控制初始化完成');
}

// 更新速度顯示（改進版本）
function updateFsSpeedDisplay() {
    const speedInfo = document.getElementById('fsSpeedInfo');
    if (speedInfo) {
        const seconds = autoPlaySpeed / 1000;
        speedInfo.textContent = `${seconds}秒/張`;
        speedInfo.title = `切換圖片間隔: ${seconds}秒`;
    }
    
    // 同時更新可能存在的其他速度指示器
    const fsSpeedIndicator = document.getElementById('fsSpeedIndicator');
    if (fsSpeedIndicator) {
        const seconds = autoPlaySpeed / 1000;
        fsSpeedIndicator.textContent = `${seconds}秒`;
    }
};

// 為了更好地調試，添加一個初始化函數
function initSpeedControls() {
    // 初始化速度顯示
    updateFsSpeedDisplay();
    
    // 綁定按鈕事件（確保正確綁定）
    document.querySelectorAll('.fs-auto-btn').forEach(btn => {
        btn.onclick = function(e) {
            const direction = this.querySelector('.fa-plus') ? 1 : -1;
            fsChangeSpeed(direction);
            e.stopPropagation();
        };
    });
    
    // 綁定自動播放切換按鈕
    const toggleBtn = document.getElementById('fsToggleAutoPlay');
    if (toggleBtn) {
        toggleBtn.onclick = fsToggleAutoPlay;
    }
}


// 修改 fsNextImage 和 fsPrevImage 函數
window.fsNextImage = function() {
    if (!window.fullscreenImages || window.fullscreenImages.length === 0) return;
    
    if (window.currentFsIndex < window.fullscreenImages.length - 1) {
        window.currentFsIndex++;
    } else {
        // 如果是最後一張，回到第一張
        window.currentFsIndex = 0;
    }
    
    updateFullscreenImage();
    
    // 更新進度條
    updateProgressBars();
    
    // 如果正在自動播放，重新開始計時器
    if (isFsAutoPlaying) {
        startFsAutoPlay();
    }
};

window.fsPrevImage = function() {
    if (!window.fullscreenImages || window.fullscreenImages.length === 0) return;
    
    if (window.currentFsIndex > 0) {
        window.currentFsIndex--;
    } else {
        // 如果是第一張，跳到最後一張
        window.currentFsIndex = window.fullscreenImages.length - 1;
    }
    
    updateFullscreenImage();
    
    // 更新進度條
    updateProgressBars();
    
    // 如果正在自動播放，重新開始計時器
    if (isFsAutoPlaying) {
        startFsAutoPlay();
    }
};

// 修改 updateFullscreenImage 函數
function updateFullscreenImage() {
    if (!window.fullscreenImages || window.currentFsIndex === undefined || window.currentFsIndex < 0) return;
    
    const fsImage = document.getElementById('fsImage');
    const fsImageIndex = document.getElementById('fsImageIndex');
    const gallery = galleryDatabase.find(g => g.id === window.currentGalleryId);
    
    if (fsImage && window.fullscreenImages[window.currentFsIndex]) {
        fsImage.src = window.fullscreenImages[window.currentFsIndex];
        fsImageIndex.textContent = `${window.currentFsIndex + 1} / ${window.fullscreenImages.length}`;
        
        // 更新速度顯示
        updateFsSpeedDisplay();
        
        // 如果圖片加載失敗，使用佔位圖
        fsImage.onerror = function() {
            const placeholder = createPlaceholderSVG(gallery || {}, window.currentFsIndex + 1);
            this.src = placeholder;
            this.onerror = null;
        };
    }
}

// 修改 closeFullscreen 函數
window.closeFullscreen = function() {
    const fsViewer = document.getElementById('fullscreenViewer');
    if (fsViewer) {
        fsViewer.style.display = 'none';
    }
    
    // 停止所有計時器和動畫
    stopFsAutoPlay();
    stopProgressAnimation();
    isFsAutoPlaying = false;
    
    // 清空進度條相關數據
    if (fsAutoPlayInterval) {
        clearTimeout(fsAutoPlayInterval);
        fsAutoPlayInterval = null;
    }
};

// 初始化完成
console.log('圖庫瀏覽器已載入 - 使用實際圖片檔案名稱');