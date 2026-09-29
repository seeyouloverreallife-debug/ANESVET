# ANESVET V16.17.0 — คู่มือ Production Pilot บนอุปกรณ์จริง

## เป้าหมาย
รุ่นนี้ไม่ได้เพิ่ม clinical feature ใหม่ จุดประสงค์คือพิสูจน์ว่า workflow ที่มีอยู่สามารถอยู่รอดจากพฤติกรรมของมือถือ/PWA จริง เช่น screen lock, app switching, offline, force close และการใช้งานเคสยาว

## ก่อนเริ่ม
- ใช้ **test patient / simulated case** ก่อน ไม่ใช้ข้อมูลเจ้าของจริงถ้าไม่จำเป็น
- ติดตั้ง/เปิด ANESVET ด้วยวิธีเดียวกับที่จะใช้ใน OR จริง
- Settings → Production Pilot → กด **Run device readiness**
- ถ้ามี `FAIL` ให้แก้ก่อนทำ scenario ต่อ; `WARN` ให้บันทึกบริบทและประเมินซ้ำบนอุปกรณ์นั้น

## Acceptance matrix
Mark `PASS` เฉพาะเมื่อเห็นผลครบทั้ง scenario ไม่ใช่เพียงกดปุ่มได้

### 1. Routine → Final Lock → Archive VERIFIED → New case
ทำเคสจำลองปกติจน Final Lock และยืนยันว่า archive เป็น VERIFIED ก่อนเริ่มเคสใหม่

### 2. Background ≥5 min
ระหว่าง active case บันทึก vital ล่าสุด → ล็อกจอ/สลับแอป ≥5 นาที → กลับมา → ตรวจ patient/case phase/timer/latest record → บันทึก vital ใหม่

### 3. Background ≥30 min
ทำซ้ำด้วยช่วงเวลานานขึ้นเพื่อให้ mobile OS มีโอกาส suspend PWA จริง

### 4. Force close → reopen
หลังมี verified save ให้ปิดแอปจาก task switcher แล้วเปิดใหม่ ตรวจว่า current case และ record ล่าสุดกลับมาถูกต้อง

### 5. Offline → reconnect
ปิด Wi‑Fi/mobile data → บันทึก vitals/event → สลับหน้า → กลับมา → เปิด network → ตรวจว่าข้อมูล local ไม่หาย

### 6. Duplicate tab
เปิด ANESVET อีก tab/window บนอุปกรณ์เดียวกัน ยืนยัน view-only/take-control behavior และไม่มี silent overwrite

### 7. Update waiting during active case
เมื่อมี version ใหม่รออยู่ระหว่าง mutable case ต้องไม่ reload/update โดยอัตโนมัติจนเคสปลอดภัยต่อการเปลี่ยน version

### 8. Recovery → Final Lock
ทำ serial Recovery records, meds reconciliation, transfer snapshot, Recovery complete และ Final Lock

### 9. Backup + test restore
สร้าง verified Full Backup แล้ว restore บน test dataset/test installation ตรวจจำนวน cases/patients และ locked checksum

### 10. Long case ≥2 h
เก็บเคสจำลองอย่างน้อย 2 ชั่วโมง พร้อม repeated vitals/events/drugs และช่วง screen lock/app switching ตามการใช้งานจริง

### 11. Orientation + keyboard
ทดสอบ portrait/landscape, Fast Vital Entry และ Quick Drug; keyboard ห้ามบัง Save/primary dock

### Optional: Archive failure / retry
ทำเฉพาะใน test environment ที่สามารถบังคับ failure ได้อย่างปลอดภัย ต้องเห็นว่า locked current case ไม่หายและ Retry ทำงานเมื่อ storage กลับมาปกติ

## หลังทดสอบ
- ใส่ note สั้น ๆ ต่อ scenario เช่น device model / OS / browser / สิ่งผิดปกติ
- Export pilot report
- ถ้าเจอ bug ให้ใช้ Report issue / feedback และแนบ diagnostics/pilot report ตามความเหมาะสม
