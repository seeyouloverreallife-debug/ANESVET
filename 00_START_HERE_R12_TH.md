# ANESVET V17.2.16 — Checkpoint R12: Wake / Session Ownership Guard

**ต่อยอดตรงจาก V17.2.15 (R11)** ไม่สร้างโปรแกรมใหม่ และไม่แก้ขนาดยา, Drug Calculator, Clinical Safety Thresholds หรือ schema ข้อมูลผู้ป่วย

## บั๊กที่ตรวจพบ
- หลัง Sleep/Background, heartbeat ของแท็บเดิมสามารถเขียน Session Lock ทับแท็บอื่นที่รับสิทธิ์ ACTIVE ระหว่างพักได้ แม้ตัวแท็บเดิมไม่ได้รับ BroadcastChannel/storage event
- `save()` ตรวจเพียง mode ในหน่วยความจำ แต่ไม่ได้ยืนยันว่า Session Lock ปัจจุบันยังเป็นของแท็บนี้ก่อนเขียน clinical current case
- IndexedDB current-case mirror ที่รอ `setTimeout` สามารถถูกเขียนหลังเปลี่ยนเป็น VIEW ONLY และทับ newer copy ได้

## แก้ใน R12
- `session-coordination.js`: ตรวจการครอบครอง Session Lock ก่อน heartbeat ทุกครั้ง; หากมี fresh foreign owner ให้เป็น VIEW ONLY โดยไม่ทับล็อก; การรับสิทธิ์ด้วย Take control ของผู้ใช้ยังทำได้
- `session-controller.js`: ตรวจเจ้าของอีกครั้งเมื่อ `pageshow` และ `visibilitychange` (visible)
- `app.js`: ตรวจ ownership ก่อน save และ clinical write; ยกเลิกการเขียน IndexedDB mirror จาก callback เก่าหากไม่เป็น active owner อีกแล้ว
- Version / PWA cache อัปเดตเป็น V17.2.16

**ขอบเขตที่ไม่แก้:** รูปแบบข้อมูล, สูตรคำนวณยา, เวชระเบียนที่บันทึกแล้ว, กลไกกู้ stale session lock ของเวอร์ชันก่อน, การจัดการกรณีสองเครื่องที่ใช้งานผ่าน origin/storage ไม่ร่วมกัน

## ตรวจ QA
รัน `node RUN_R12_QA.js`; ทดสอบเฉพาะ R12 ที่ `node QA_R12_WAKE_OWNERSHIP.js`.

**ข้อจำกัด:** ยังไม่ได้ทดสอบ Android/iPad จริง และยังไม่มี Browser E2E สำเร็จ; unit test จำลองการพักแท็บ/การสลับสิทธิ์ ไม่เทียบเท่าทดสอบบนอุปกรณ์จริง

**ข้อปฏิบัติก่อนทดสอบ:** สำรองข้อมูลเคสสำคัญ, ทดสอบด้วยเคสจำลอง บนอุปกรณ์หรือ Origin สำรอง; ห้ามลบ site data/uninstall แอปเครื่องที่มี active case. ก่อนทดสอบใหม่บน GitHub Pages ตรวจว่าเป็นเวอร์ชัน V17.2.16.
