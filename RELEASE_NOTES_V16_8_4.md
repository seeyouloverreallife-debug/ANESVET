# ANESVET V16.8.4 — OR Workflow Polish

## Medication queue semantics
- แยก Frozen Case Drug Plan ใน OR LIVE เป็น 3 กลุ่ม: **NEEDS REVIEW**, **LATER**, และ **DOCUMENTED**
- ยา `post` ไม่ถูกนับเป็นงานค้างระหว่าง Induction/Intraoperative อีกต่อไป แต่แสดงเป็น **LATER**
- เมื่อเข้าสู่ Emergence/Recovery รายการ `post` ที่ยังไม่มี Actual administration จะย้ายเป็น **NEEDS REVIEW**
- ปุ่ม `Review next` เปิดเฉพาะรายการที่ต้องทบทวนใน phase ปัจจุบัน/ก่อนหน้า และจะไม่ดึงยาที่วางไว้สำหรับ phase ภายหลังขึ้นมาเป็นงานถัดไป
- Mobile MEDS badge นับเฉพาะรายการที่ต้อง review ตอนนี้ ไม่รวม `LATER`

## Next Clinical Step
- เพิ่มข้อความ **Documentation remaining** แยกจาก clinical step เพื่อสื่อว่าข้อมูลยายังค้างได้โดยไม่บล็อกการเดิน workflow
- `Ready for surgery` ไม่ใช้คำที่ทำให้รายการ post-operative medication ดูเหมือนต้องให้ใน Induction
- Intraoperative guidance เชื่อมกับ Medication queue แบบ phase-aware

## Mobile workflow
- คง 3 action surfaces แบบเสถียรบนมือถือ:
  - Induction / non-intraop: Next Step • Vitals • More
  - Intraoperative: Record Vitals • Meds • More
- รักษา V16.8.3 dock geometry hotfix (`left/right inset` + `transform:none`) ไว้ครบ

## Compatibility
- ไม่เปลี่ยน state schema
- ไม่เปลี่ยน IndexedDB schema/version
- ไม่เปลี่ยน storage keys
- ไม่เปลี่ยน dose calculation, alert threshold หรือ medication administration records
- อัปเดตจาก V16.8.3 ได้โดยไม่ต้อง migrate database
