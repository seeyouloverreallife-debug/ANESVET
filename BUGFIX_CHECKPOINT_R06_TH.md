# ANESVET — Checkpoint R06 | V17.2.10

**ฐาน:** V17.2.9 Checkpoint R05 → **รุ่นนี้:** V17.2.10 R06 Touch / Overlay Guard

## จุดบกพร่องที่ตรวจพบจาก source

- `usability-hardening.js`: ตัวดัก `pointerup` บน `document` ที่ทำหน้าที่เป็น fallback ของปุ่ม `uxReturnCase` เดิมใช้ *ตำแหน่งพิกัดอย่างเดียว* จึงเรียก `resumeActiveCase()` เมื่อแตะ element อื่นที่อยู่ทับตำแหน่งปุ่มได้ แม้ event ไม่ได้เริ่มจากปุ่มลัดนั้น
- `usability-hardening.css`: ปุ่มกลับเคสใช้ `z-index:2147483000` สูงกว่า `.security-lock-overlay` (`z-index:99999`) ซึ่งเสี่ยงทำให้ปุ่มปรากฏทับชั้นล็อก

## การแก้ไขแบบจำกัดขอบเขต

1. `returnShortcutPointerEligible()` ยอมรับ fallback เฉพาะกรณี event target เป็นปุ่มหรือ descendant และ hit test ของ `elementFromPoint()` ยืนยันว่าเป็นปุ่มที่อยู่บนสุดจริง
2. ไม่เรียก fallback ขณะมี `dialog[open]`, หน้าล็อก, view-only session, หรือปุ่ม hidden/inert; จำกัด primary pointer และปุ่มเมาส์หลัก
3. Native click ยังใช้งานได้ และถูกป้องกันการยิงซ้ำหลัง pointer fallback
4. ลด `z-index` ของปุ่มลัดจาก 2147483000 เหลือ 180 ให้อยู่เหนือแถบนำทางมือถือ (85) แต่ต่ำกว่าหน้าล็อก (99999)
5. เพิ่ม regression test 17 กรณี และอัปเดต Cache/Manifest/Web assets เป็น 17.2.10

## ขอบเขตที่ไม่เปลี่ยน

- **ไม่เปลี่ยน** คำนวณขนาดยา, Current BW, Clinical gate criteria, OR LIVE / Recovery Controller, Schema, Storage keys, Session ownership, Sync, Backup / Restore และการบันทึกเคส
- Modified runtime files เทียบกับ R05 มีเพียง 6: `usability-hardening.js`, `usability-hardening.css`, `index.html`, `app.js` (version only), `manifest.webmanifest`, `service-worker.js`

## QA และข้อจำกัด

- ตรวจด้วย Node unit/regression ใน container และตรวจ static HTML/Service Worker assets
- Chromium Headless ที่พยายามใช้ทดสอบจริงไม่เสร็จภายในขอบเขตเวลา (exit 124) จึง **ยังไม่มีผล Browser E2E ที่ยืนยันได้**
- ยังไม่ได้ทดสอบอุปกรณ์ Android/iPad จริง จึงไม่สรุปว่าปัญหาปุ่มบนมือถือทั้งหมดหายแล้ว

## แผน R07

หลังทดสอบ R06 บนเครื่องสำรอง: ใช้ Diagnostic ร่วมกับภาพหน้าจอเพื่อระบุว่าแอปยังมีตัวบังปุ่มจริง, ถูก safety gate, หรือ event handler ไม่รับ click แล้วจึงแก้เฉพาะโมดูลที่พบปัญหา
