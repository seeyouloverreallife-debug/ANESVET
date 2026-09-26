# ANESVET V15.29.0 — Recovery & Handoff 2.0

## V15.29 — Recovery & Handoff 2.0

รุ่นนี้ปรับช่วง **OR → Recovery → Handoff** ให้ข้อมูลที่ ANESVET รู้อยู่แล้วถูกสรุปอัตโนมัติ และให้สัตวแพทย์พิมพ์เฉพาะข้อมูลส่งต่อที่ระบบอนุมานไม่ได้

- `WATCH / HANDOFF FIRST` แสดง unresolved alert, active complication, airway concern, ค่าล่าสุดที่ยังอยู่ใน warning/critical range ตาม active alert protocol และ note ส่งต่อเพิ่มเติม
- Medication handoff แยก Actual administration เป็น **Analgesia / Antibiotic / NSAID** พร้อมเวลา ปริมาณจริง และ route
- Key timeline สรุป case start, induction, intubation, surgery start/end, extubation, recovery และยากลุ่มสำคัญ
- Readiness chips แสดง Vitals / Checklist / Score / Extubation / Problems แบบสั้น โดย **ไม่เปลี่ยนเกณฑ์ Recovery complete เดิม**
- เพิ่มช่อง `Extra handoff / watch note` แบบ optional; autosave ตามระบบ V15.28
- สร้าง Handoff snapshot อัตโนมัติเมื่อ **Recovery complete** เพิ่มจาก snapshot ตอนเริ่ม Recovery / หลัง emergency return
- Handoff รุ่นใหม่เปิดครั้งแรกอัตโนมัติ และ `More → Handoff` จะเปิด section ก่อนเลื่อนไปหา
- Full handoff text และ snapshot history เดิมยังเปิดดูได้

Clinical calculation, dose reference, protocol review, medication reconciliation และ finalization logic ไม่ถูกเปลี่ยนในรุ่นนี้

---


## V15.28 — Autosave / OR performance

รุ่นนี้ลด synchronous full-state save ระหว่างการพิมพ์ต่อเนื่อง โดยใช้ autosave debounce 450 ms ที่มีอยู่เดิมให้ทำงานจริงแทนการเขียนซ้ำทุก keystroke

- Text / numeric input: แสดง `Unsaved changes` แล้ว autosave หลังหยุดพิมพ์ 450 ms
- Critical clinical actions เช่น Record vitals, medication administration, workflow transition, Recovery / Final Lock: **save ทันทีเหมือนเดิม**
- `visibilitychange`, `pagehide` และ `beforeunload` ระหว่าง active case: flush pending state ทันที
- แก้ race condition ของ **New/Reset case** ที่ autosave/mirror เก่าอาจเขียนข้อมูลผู้ป่วยเดิมกลับเข้ามาหลัง Reset
- Airway numeric fields, drug calculator/concentration inputs, fluid balance, Recovery vitals และ Recovery score note ใช้ debounced draft save เพื่อลด UI/storage churn
- Select / explicit workflow choices ที่เป็น discrete decision ยังคงบันทึกทันทีในจุดที่เดิมทำเช่นนั้น

การเปลี่ยนนี้ไม่แก้สูตรยา, dose reference, protocol review, alert threshold, medication reconciliation หรือ finalization logic

---

## V15.27 — Protocol Review & Dose Conflict
รุ่น V15.27 เพิ่มระบบตรวจทบทวน **Hospital Protocol dose เทียบกับ dose reference ที่โหลดอยู่ในโปรแกรม** โดยไม่แก้ dose ให้อัตโนมัติ

## ใช้งานอย่างไร

ไปที่ **Settings → Protocol Dose Review** แล้วกด Run / Refresh review

ระบบอาจแสดงสถานะ เช่น:

- `WITHIN PRIMARY` — อยู่ใน primary reference context
- `SUPPORTED — CHECK CONTEXT` — มี reference รองรับ แต่เป็นอีกบริบทหนึ่ง ควรตรวจ context
- `OUTSIDE LOADED REFERENCE` — อยู่นอกช่วงอ้างอิงที่เปรียบเทียบได้ในฐานข้อมูลที่โหลดอยู่
- `ROUTE MISMATCH` — route ที่ตั้งไว้ไม่ตรงกับ route ใน reference ที่เปรียบเทียบได้
- `NOT COMPARABLE` — สูตร/หน่วยไม่ควรถูกแปลงมาเปรียบเทียบอัตโนมัติ
- `NO REFERENCE` — ไม่มี reference ที่ map ได้

สถานะเหล่านี้เป็น **review aid** ไม่ใช่คำสั่งให้เปลี่ยน protocol

## Mark reviewed

ก่อน Mark reviewed ให้ Save Hospital Settings / Drug Library ก่อน เพื่อให้ระบบ review ค่าที่ถูกบันทึกจริง

หากมี warning หรือ check-context ระบบจะให้ใส่ reviewer และ review note แล้วเก็บ audit trail ไว้

ถ้าแก้ dose / route / formula ภายหลัง สถานะจะเปลี่ยนเป็น `CHANGED SINCE REVIEW` และควร review ใหม่

## Protocol Lock

หาก Lock protocol ขณะที่ review ไม่ current ระบบจะเตือน แต่ไม่ตัดสินใจแทนสัตวแพทย์ หากยืนยัน Lock ต่อ ระบบจะบันทึก audit ว่าล็อกในขณะที่ dose review ยังไม่ current

## ขอบเขตความปลอดภัย

ระบบนี้ไม่:

- เปลี่ยน dose ให้เอง
- เลือก midpoint จาก dose range
- เปลี่ยน route/concentration
- เดาสูตร legacy ให้เป็น mg/kg
- เปลี่ยน dose reference ของ V15.26.0

## การอัปเดต

หลัง deploy ถ้า browser/PWA ยังแสดงรุ่นเก่า ให้เปิด URL ด้วย `?v=15.29.0` หนึ่งครั้งหรือ refresh PWA ตามขั้นตอนของอุปกรณ์ เพื่อให้ service-worker รับ asset รุ่นใหม่
