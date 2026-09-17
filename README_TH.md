# ANESVET V7 — OR Workflow Update

## ใหม่จาก V6.1

### Timer state ชัดเจน
- READY — ยังไม่เริ่ม
- RUNNING — timer กำลังเดิน
- PAUSED — หยุดชั่วคราว
- Start case เปลี่ยนเป็น Resume case หลัง Pause
- Pause disabled เมื่อยังไม่เริ่ม
- เวลาแสดงทั้ง elapsed time และ clock time ใน records/events

### Pre-anesthetic checklist
เพิ่มหน้า Pre-op ระหว่าง Patient และ Dashboard:
1. Consent / owner discussion
2. Fasting / aspiration risk
3. Physical exam
4. Labs / imaging
5. IV catheter
6. O2 + backup
7. Machine leak check
8. Vaporizer
9. CO2 absorbent
10. Airway equipment
11. Suction
12. Monitor
13. Warming
14. Emergency drugs / crash plan

ถ้ากด Start case ทั้งที่ checklist ยังไม่ครบ แอปจะถามยืนยันก่อน

### Procedure milestones
มีปุ่ม:
- Premedication
- Induction
- Intubation
- Surgery start
- Surgery end
- Extubation
- Recovery complete

ทุก milestone จะบันทึก elapsed time + clock time และไปอยู่ใน Timeline / PDF report

### Timeline tab
รวม:
- Procedure milestones
- Drug events
- Complications
- Notes จาก anesthesia record

### PDF report แบบ medical record มากขึ้น
เพิ่ม:
- Patient information
- ASA / BCS
- Pre-anesthetic checklist
- Case information
- Case summary
- Full anesthesia record
- Physiologic trend graphs
- Drugs / events
- Recovery
- Anesthetist / surgeon sign-off lines

### Update GitHub Pages
Upload V7 files ทับเวอร์ชันเดิมทั้งหมด แล้ว Commit
เปิด:
https://seeyouloverreallife-debug.github.io/ANESVET/?v=7

ถ้า PWA ยังแสดงเวอร์ชันเก่า ให้เปิด URL ?v=7 ใน Chrome หนึ่งครั้ง หรือ Clear site data
