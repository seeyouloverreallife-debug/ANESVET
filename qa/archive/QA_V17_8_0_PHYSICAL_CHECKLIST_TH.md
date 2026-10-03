# ANESVET V17.8.0 — Physical Android/PWA Workflow Checklist

> ชุดนี้ต้องทดสอบบนอุปกรณ์จริง ไม่รวมอยู่ใน automated PASS

## A. Routine case
1. New Patient → ระบุ BW → Save Patient & Case Setup
2. Pre-op → Review Case Drug Plan
3. ตรวจ Cefazolin: Geno V 250 mg/mL, IV, BW ÷ 10 mL
4. Start Case → Induction
5. บันทึก induction หลายยาแบบต่อเนื่อง และแก้ actual mL
6. บันทึก Airway / Intubation
7. Surgery start → OR LIVE
8. บันทึก vital หลายรอบ; เปิด keyboard แล้วตรวจว่า header/tab ไม่กระโดด
9. ให้ยา 2 รายการติดกัน; dialog/workspace ต้องไม่เด้งกลับ OR ระหว่างรายการ
10. Surgery end → ต้องเห็น EMERGENCE
11. Extubation → ต้องออก fullscreen และเปิด Recovery
12. บันทึก Recovery vital + score → Complete Recovery → End Case
13. Final Lock → reload → final record ต้องยัง sealed

## B. Reload/resume
- Reload หลัง Start Case, ระหว่าง OR LIVE, หลัง Surgery end และระหว่าง Recovery
- ตรวจ patient/BW, timer elapsed, phase, records, medications, alerts และ protocol snapshot
- ต้องไม่สร้าง duplicate event จากการ reload

## C. Emergency return
- Recovery → Emergency return to OR → OR LIVE
- บันทึก event/vital ตามจริง → Return Recovery
- Recovery start เดิมต้องไม่ถูก reset
- Emergency-return event ต้องคงอยู่ใน timeline/audit

## D. Medication hospital profile
- Cefazolin: 1000 mg vial + sterile water 4 mL = 250 mg/mL; BW ÷ 10 mL; IV
- Convenia: 80 mg/mL; BW ÷ 10 mL; SC
- OR LIVE ต้องระบุ Geno V Pet Care protocol
- เปลี่ยน actual volume ได้ แต่ record ต้องยังเก็บ concentration/route/administered-by

## E. Mobile/PWA
- เปิดจาก installed PWA cold start: ไม่มี splash ขาวเก่า
- portrait/landscape ระหว่าง OR LIVE
- keyboard open/close หลายครั้ง
- fullscreen → Recovery
- toast ต้องไม่ถูก bottom navigation บัง
- End Surgery ต้องเข้าถึงได้ รวม C-section secondary action
