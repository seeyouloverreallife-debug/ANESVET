# ANESVET V17.2.25 — R21 Critical Boot Bridges

**ฐาน:** V17.2.24-R20; เป็น Hotfix ต่อเนื่องจาก source เดิม ไม่เริ่มโปรแกรมใหม่

## เหตุจากมือถือ Android ที่ยืนยันได้
- `app.js?v=17.2.24` รายงาน `closeRecoveryMoreDialog is not defined` ที่ Startup / Navigation; `ready:false`.
- Device Diagnostic แสดง `17.2.14` เพราะค่าส่วนหัว Diagnostic ถูก hardcode แม้ app.js เป็น 17.2.24.
- Static call audit พบเพิ่มเติม `closeOrMoreDialog` และ `recoveryTransferLatest` ยังไม่ประกาศใน app.js แต่ฟังก์ชันจริงอยู่ใน controller ต่างหาก.

## การแก้ไข
- เปิด API ชื่อ `closeMoreDialog`, `transferLatest` จาก Recovery Controller และ `closeOrMoreDialog` จาก OR LIVE Controller.
- เพิ่ม bridge ชื่อเดิมทั้งสามใน `app.js` เรียก controller API จริง. ไม่มี empty stub, ไม่เปลี่ยนข้อมูลเคส.
- ปรับ Version/App cache/Device Diagnostic เป็น 17.2.25 (Service Worker, manifest, HTML, app.js).
- **ไม่เปลี่ยน** dose formulas, clinical thresholds, clinical record schema, case storage keys.

## ผลการทดสอบ
- R21 focused 20/20 checks PASS (รวม real navigation function with controller-owned close).
- 26/26 regression suites PASS, 162/162 JS files syntax PASS, 0 duplicate HTML IDs, 0 missing cache assets.
- Audit direct call references ใน app.js ไม่เหลือ controller-private name ที่ unresolved จากรายการที่ตรวจพบ; ยังไม่ใช่การรับประกัน Browser Runtime.
- Chrome/Chromium ในสภาพแวดล้อมพัฒนาเปิด localhost ไม่สำเร็จ: `ERR_BLOCKED_BY_ADMINISTRATOR`. Android/iPad E2E ยังไม่ได้ยืนยัน.

## นำขึ้น GitHub Pages
1. สำรองข้อมูลเคสก่อนถ้าแอปเดิมยังเข้าถึงข้อมูลได้ อย่าลบแอปหรือ Clear site data.
2. สำหรับ repo ที่ deploy V17.2.24 อยู่แล้ว สามารถอัปโหลด/แทนที่ไฟล์ 6 ตัวจาก ZIP `DEPLOY_PATCH_6_FILES.zip` ลง **root ของ repo** (ห้ามใส่เป็นโฟลเดอร์ย่อย).
3. อีกวิธีคือแตก Checkpoint ZIP นี้ แล้วอัปโหลด **เนื้อหาภายในโฟลเดอร์** ไม่ใช่โฟลเดอร์แม่ ลง repo root.
4. Commit, รอ GitHub Pages ใช้ commit ใหม่ แล้วเปิดแอปผ่าน URL เดิม; ถ้ายังขึ้น Diagnostic version เก่า ให้ตรวจ GitHub Pages deployment / PWA update; **อย่าล้าง Storage ของเครื่องที่มีเคสสำคัญ**.
5. ทดสอบเคสจำลองตาม `R21_DEVICE_TEST_STEPS_TH.md` ก่อนใช้กับผู้ป่วยจริง.

**ยังไม่ยืนยัน Ready: true บน Android จริง** จนกว่าจะได้รับ Device Diagnostic หลัง Deploy.
