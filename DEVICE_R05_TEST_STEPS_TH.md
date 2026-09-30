# R05 ทดสอบบน Android/iPad (เครื่องทดสอบเท่านั้น)

1. **สำรองข้อมูลเคสก่อน** และเปิด V17.2.9 บนเครื่องทดสอบที่ไม่มี Active Case. หลีกเลี่ยง Clear Site Data หรือถอน PWA บนอุปกรณ์จริงที่มีเคสค้าง.
2. เปิด ANESVET → แตะ **Pre-check** → **Medications** → **ประวัติผู้ป่วย** จากแท็บหลัก. ยืนยันว่าหน้าเปลี่ยนและปุ่มไม่ได้ค้าง.
3. แตะเมนู **ขั้นตอน** บนแถบล่างของมือถือ → เลือก **Medications**, **Settings**, **Patient** → ต้องปิดเมนูและเปิดหน้าที่เลือกได้.
4. หากทดสอบ **OR LIVE / Recovery** ในเคสตัวอย่างที่ยังไม่ผ่าน readiness/transition gate ระบบต้อง **ไม่เปิดหน้าโดยพลการ**: สถานะ `blocked-readiness` หรือ `blocked-recovery` เป็นการป้องกันที่ถูกต้อง ไม่ถือว่า navigation bug.
5. หากปุ่มไม่ตอบสนอง กดปุ่ม **Diagnostic** (🔎) → **คัดลอก Diagnostic** → ดูบรรทัด `navigation`:
   - `CLICK_WITHOUT_ROUTE` = เห็น Click แต่ไม่มีตัวจัดการ route สำเร็จภายใน watchdog.
   - `render-error` = ตัวจัดการ route เริ่มทำงานแต่การ render ผิดพลาด.
   - `blocked-readiness`/`blocked-recovery` = gate ป้องกันการเข้าหน้า.
   - `rendered` = ตัวจัดการเปลี่ยนหน้ารายงานว่าสำเร็จ (หากยังมองไม่เห็นหน้า ให้เก็บ screenshot เพิ่มเพื่อตรวจ CSS/overlay).
6. เก็บ screenshot เฉพาะส่วนที่มีปัญหา และตัดข้อมูลผู้ป่วย/URL อ่อนไหวออกก่อนแชร์ Diagnostic.

**ข้อจำกัด:** Tests ใน container เป็น unit/static regression; อุปกรณ์จริงยังต้องยืนยัน PWA caching, touch events, native dialog top-layer และ interaction ต่อเนื่อง.
