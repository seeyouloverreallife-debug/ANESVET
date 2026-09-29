# Migration — V16.13.0 → V16.14.0

- IndexedDB `DB_VERSION` คงที่ที่ 2
- ไม่มี store ใหม่
- ไม่มี localStorage key ใหม่
- alertEpisodes / complications schema เดิมถูกอ่านแบบ backward-compatible
- active case และ archived case เดิมใช้ review layer ใหม่ได้ทันที
- ไม่มีการเขียนข้อมูลย้อนหลังเพื่อสร้าง response linkage
