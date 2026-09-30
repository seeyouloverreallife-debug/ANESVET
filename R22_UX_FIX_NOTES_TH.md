# ANESVET V17.2.26 — R22 Clinical Simplicity UX Fix

**ฐาน:** V17.2.25 R21 Critical Boot Bridges • ใช้ source เดิม ไม่เริ่มจากศูนย์

## เหตุผล
- OR LIVE (โดยเฉพาะมือถือ) วางช่อง Vital Signs ไว้หลังหลายแผง ทำให้เลื่อนหา form บ่อย
- Recovery mobile มี CSS `order` บางองค์ประกอบ แต่ sibling อื่นยัง `order:0` จึงแทรกขึ้นก่อน focus แทนการเรียงตาม workflow
- ใช้ full-focus mode แล้วกลับสรุปเคสต้องผ่านเมนูเพิ่มเติม
- ชื่อแท็บ/ปุ่มบางส่วนเป็นคำกว้าง ไม่บอกหน้าที่ชัดเจน

## การเปลี่ยนแปลง
1. เพิ่ม `clinical-simplicity.js` จัด DOM OR ให้ Next Step → Record Vitals → Vital inputs → supporting panels; ใช้ DOM เดิมครบ ไม่ทำสำเนา ID, ไม่เปลี่ยน event listeners
2. `clinical-simplicity.css` แก้ Recovery mobile order: Recovery Focus → observations → unresolved problems → documentation/meds → handoff/score/trends/log
3. เพิ่มปุ่มเล็ก `← สรุปเคส` ใน topbar เมื่ออยู่ OR/Recovery focused mobile; เรียกปุ่ม controller เดิม (ไม่ end case, ไม่ force)
4. ลดปุ่มบันทึก Vital Signs ที่ซ้ำซ้อนเมื่อ focus area เปิดอยู่ โดยเก็บปุ่ม original ไว้สำหรับ event dispatch
5. ปรับชื่อแท็บยา / OR LIVE และปุ่มใน mobile dock ให้อ่านง่ายขึ้น
6. bump live app version/cache/manifest เป็น 17.2.26 เพื่อกระจาย UX patch ใน PWA โดยไม่ล้างข้อมูล

## สิ่งที่ไม่เปลี่ยน
- ไม่เปลี่ยน clinical thresholds, dose calculations, pharmacology, freeze/actual drug logic
- ไม่เปลี่ยน safety/readiness gates, recovery criteria, case database/schema/storage keys, audit records
- คง active alerts/problems, medication confirmations, checklists, original dialogs และ archived files

## Acceptance ที่ต้องทดสอบบนเครื่องจริง
- โหลด active case โดยข้อมูลไม่หาย; OR pre-induction / intraop เห็นปุ่มลำดับขั้นและช่องวัดค่าด้านบน
- Record Vitals 2 รอบ, ค่าครั้งก่อนและ due feedback ยังถูกต้อง
- Induction multi-drug → Quick Drug → กลับ OR ทำได้ต่อเนื่อง
- Recovery mobile เห็น observation อยู่ต้นหน้า; problems/medications/handoff ไม่หาย; เปิดจาก More ได้
- ปุ่ม `← สรุปเคส` กลับได้จริงโดยไม่จบเคส; OR fullscreen เปลี่ยนหน้าแล้วปิด fullscreen ถูกต้อง
- ตรวจทั้ง Android PWA, iPad, desktop; ทดสอบกับ mock cases ก่อนใช้จริง

**หมายเหตุ:** การผ่าน static/test harness ไม่เท่ากับผ่าน E2E จริง; Browser Playwright sandbox นี้ได้รับ `ERR_BLOCKED_BY_ADMINISTRATOR`.
