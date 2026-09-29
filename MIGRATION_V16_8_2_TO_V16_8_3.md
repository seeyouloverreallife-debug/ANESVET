# Migration — V16.8.2 → V16.8.3

ไม่ต้องทำ data migration.

V16.8.3 เป็น CSS/PWA cache-bust hotfix:
- state schema unchanged
- IndexedDB database/version unchanged
- localStorage keys unchanged
- backup schema unchanged
- clinical decision logic unchanged

หลัง deploy ควร reload/update installed PWA หนึ่งรอบเพื่อให้ service worker ชุดใหม่ activate และโหลด `clinical-calm.css?v=16.8.3`.
