# Vet Anesthesia Monitor — PWA V2

## ใหม่ใน V2
- บันทึก anesthesia values เป็น Record ตามเวลา
- เลือก interval 5 หรือ 10 นาที
- Reminder เมื่อถึงเวลาบันทึกครั้งถัดไป
- Optional Auto-log (ปิดไว้เป็นค่าเริ่มต้นเพื่อป้องกัน stale data)
- ตาราง Anesthesia Record
- กราฟ Trend อัตโนมัติ:
  - MAP
  - HR
  - SpO2
  - ETCO2
  - RR
  - Temperature
- ใส่ Event/Note แต่ละเวลาได้
- Event timeline
- Export Record เป็น CSV
- Export case เป็น JSON
- Print / Save PDF
- เก็บข้อมูลใน browser ด้วย localStorage
- ใช้งาน Offline หลังเปิดครั้งแรก

## Workflow แนะนำในห้องผ่าตัด
1. Start Anesthesia Timer
2. เลือก Record interval 5 หรือ 10 นาที
3. อัปเดตค่าหน้า Monitor จากเครื่องจริง
4. เมื่อถึงเวลา แอปจะแจ้งเตือน
5. กด "บันทึกตอนนี้"
6. แอปเพิ่มแถวใน Anesthesia Record และ update กราฟทันที
7. ใส่ Note เช่น incision, fluid bolus, fentanyl CRI, hypotension
8. จบเคส Export CSV / Print PDF

## เหตุผลที่ Auto-log ปิดเป็นค่าเริ่มต้น
แอปไม่ได้เชื่อมตรงกับ multiparameter monitor ใน V2 ดังนั้นหาก auto-save ทั้งที่ผู้ใช้ไม่ได้อัปเดตค่าบนหน้าจอ อาจเกิด stale/duplicate data ได้
จึงใช้ Reminder + Manual Record เป็น default ที่ปลอดภัยกว่า

## ทดลองบนคอม
เปิด Terminal ในโฟลเดอร์แล้วรัน:

    python -m http.server 8080

จากนั้นเปิด:

    http://localhost:8080

## ติดตั้ง Android
หลังอัปโหลดขึ้น HTTPS hosting:
Chrome > เมนู ⋮ > Install app / Add to Home screen

## Clinical note
แอปเป็น decision-support และ record tool ไม่ใช่ continuous monitor
ต้องดู patient, pulse, waveform, airway, anesthetic depth และอุปกรณ์จริงร่วมเสมอ
