# ANESVET V17.2.29 — R25 Repeat-use UX (รอบที่ 1)

**ฐานพัฒนา:** ANESVET V17.2.28 R24 FULL SOURCE ที่ผู้ใช้แนบมา ไม่ได้สร้างแอปใหม่

## ปัญหาที่ตรวจพบจาก Source

1. หน้า End Case มีการ์ดขั้นตอนถัดไปสองชุดพร้อมกัน (`endCaseEfficiencyCard` และ `endCaseFastFinish`) ทำให้มีปุ่มหลักซ้ำ
2. ระบบกลับเข้าเคสที่กำลังทำ (`resumeActiveCase`) มีอยู่แล้ว แต่ผู้ใช้ที่เปิดหน้าสรุป / Patient / Cases ไม่เห็นปุ่มกลับเข้าทำงานทันที
3. ก่อน Recovery complete ปุ่มไป End Case มีน้ำหนักทางภาพเหมือนปุ่มบันทึก Recovery ทำให้แข่งขันแย่งความสนใจ
4. Case Summary มีปุ่มทำงานหลายตัวอยู่ในกลุ่มเดียว

## การปรับปรุง

- เพิ่มปุ่ม `↩ กลับไป OR LIVE / Recovery / End Case` บน Patient, Case Summary และ Cases เมื่อมีเคสที่เริ่มแล้วและยังไม่ Final Lock โดยใช้ `AnesvetApp.resumeActiveCase()` ของโปรแกรมเดิม ไม่แตะข้อมูลเคสหรือฝืนการล็อก session
- หน้า End Case แสดง **ปุ่มงานถัดไปหลักเพียงชุดเดียว** และย้ายการ์ดรายละเอียดเดิมไปใต้ส่วนกดขยาย `ดูรายการตรวจทั้งหมดและ Focus pending` เพื่อให้เรียกใช้ได้เมื่อจำเป็น
- แสดง **รายการที่ยังค้าง / blockers** นอกส่วนพับเสมอ (รวมถึง Medication reconciliation, Documentation Guardian และ Final Sign-off ที่ยังอยู่ในหน้าเดิม)
- ปุ่มไป End Case ในหน้า Recovery เป็นปุ่มรองก่อน Recovery complete และเป็นปุ่มขั้นถัดไปเมื่อ Recovery complete
- ปุ่มแก้ไขผู้ป่วยและ Pre-check บน Case Summary ถูกจัดไว้ใต้ `แก้ไข / เมนูอื่น`; ปุ่ม Start case, OR LIVE และ Pause ยังคงอยู่
- ปรับ hit area และการมองเห็น focus ของปุ่มบนจอสัมผัส

## สิ่งที่ไม่เปลี่ยน

- Clinical Alerts, Protocol, Drug Calculator, Medication reconciliation, ASA, Vital recording และ Final Lock checks
- รูปแบบข้อมูลเคส / localStorage keys / audit trail / การรักษาข้อมูลเคสเก่า
- การกลับเข้า active case อัตโนมัติเมื่อเปิดแอปอีกครั้ง
- Silent Bug Center R23 และกลไกบันทึกปัญหา

## ผลตรวจและข้อจำกัด

- ตรวจ JS syntax รวม 174 ไฟล์ ผ่าน
- ตรวจ HTML IDs, ไฟล์ PWA cache 97 รายการ ผ่าน
- ตรวจ behavior ด้วย isolated Chromium UI integration + เปรียบเทียบ core source เดิมรวม 40/40 รายการ ผ่าน ดูรายละเอียด `R25_QA_RESULTS.json` ใน Full Source
- **ยังไม่ได้ทดสอบ End-to-End ของแอปเต็มบนโทรศัพท์และแท็บเล็ตจริง** และยังไม่ได้วัดการกลับมาใช้ซ้ำของสัตวแพทย์จริง ดังนั้นนี่คือ UX improvement iteration ไม่ใช่หลักฐานว่าผู้ใช้จะกลับมาใช้งานมากขึ้นแล้ว

## อัปเดต GitHub Pages

1. สำรองข้อมูลจากใน ANESVET ก่อนอัปเดต
2. แตก `ANESVET_V17_2_29_R25_REPEAT_USE_UX_DEPLOY.zip` แล้วอัปโหลดไฟล์ทั้งหมดไปที่ root ของ repository เดิม แทนที่ไฟล์ชื่อซ้ำ
3. เปิดแอปใหม่ ตรวจเวอร์ชันเป็น 17.2.29 หลัง PWA อัปเดตเสร็จ **อย่าลบ site data หรือถอนการติดตั้งเพราะจะเสี่ยงเสียข้อมูลที่เก็บในเครื่อง**
4. ทดสอบกับเคสจำลอง: เริ่มเคส → บันทึก OR LIVE → เข้าสู่ Recovery → ไป End Case → แก้รายการค้าง → ทดสอบ Final Lock จากเคสจำลอง → Archive verification → PDF

## เป้าหมาย UX รอบต่อไป (ต้องวัดบนอุปกรณ์จริง)

- ผู้ใช้กลับเข้าเคสที่กำลังทำจากหน้า overview ได้ภายใน 1 tap
- ลดเวลาบันทึก Vital Signs และการให้ยาจริง โดยไม่ข้ามการตรวจความถูกต้อง
- End Case แสดงสิ่งที่ค้างอย่างเฉพาะเจาะจง ไม่มีปุ่มสองชุดเรียกงานเดียวกัน
- ทดสอบ usability กับสัตวแพทย์อย่างน้อย 3–5 คนก่อนจัดเป็นเวอร์ชันสำหรับใช้งานประจำ
