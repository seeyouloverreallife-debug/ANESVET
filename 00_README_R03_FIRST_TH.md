# ANESVET V17.2.7 — R03 (ASA Tap Trace)

**อ่านก่อนอัปเดต:** รอบนี้เป็นการแก้ความผิดพลาดของระบบวินิจฉัยการกดปุ่ม ASA ไม่ใช่การรับรองว่าอาการปุ่มไม่ตอบสนองบน Android/iPad หายแล้ว

## การติดตั้ง/ทดลอง
1. สำรองข้อมูลและ export active case ตามขั้นตอนเดิมก่อนเปลี่ยนรุ่น; ใช้ test device หรือเคสทดสอบก่อน
2. แตก ZIP แล้วอัปโหลด **ไฟล์ทั้งหมดภายในโฟลเดอร์หลัก** ไปที่ root ของ GitHub Pages repository ให้ `index.html` อยู่ที่ root.
3. เปิดใหม่ ตรวจ title บนเว็บ **ANESVET V17.2.7**; หากเห็น V17.2.6 แสดงว่ารุ่นที่เปิดยังไม่อัปเดต
4. ดูขั้นตอนทดสอบใน `DEVICE_R03_TEST_STEPS_TH.md` และรายงาน R03 ใน `BUGFIX_CHECKPOINT_R03_TH.md`.

**ห้ามล้างข้อมูล / Clear Site Data / Reset / Uninstall PWA บนอุปกรณ์ที่มี active case อยู่** เพราะอาจสูญเสียข้อมูลที่ยังไม่ได้ส่งออก.

หมายเหตุ: `CHECKSUM_SHA256.txt` และไฟล์ versioned checksum เก่าเป็นหลักฐาน release ในอดีต ไม่ใช่รายการ checksum ของ R03; สำหรับ R03 ดู `R03_SHA256_MANIFEST.txt`.
