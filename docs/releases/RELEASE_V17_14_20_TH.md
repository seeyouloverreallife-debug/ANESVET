# ANESVET V17.14.20 — ขนาดยาอ้างอิงครบรายชื่อในเครื่องคำนวณ

ขยายจาก 32 เป็นครบ 62 ชื่อยาใน 10 หมวด รวม 121 บริบทต่อครั้ง/อ่านประกอบ
เพิ่มอัตราอ้างอิง CRI 16 บริบท (11 ชื่อยา) เลือกตามสุนัข/แมวและข้อบ่งใช้
ยังมีชื่อยาอื่น ๆ ให้กรอกเอง และคำนวณ syringe pump / ถุงสารน้ำได้

เริ่มใช้
- แตก ZIP และเปิดหรือโฮสต์ตามวิธีเดิม ตรวจเลขรุ่น V17.14.20
- หน้าแรก → คำนวณยาเร็ว → เลือกชื่อยาและสุนัข/แมว → Dose Reference
- เลือกบริบท/วิธีให้ยา เลือกขนาดในช่วง แล้วกดยืนยันใช้ในเครื่องคำนวณ
- ต้องกรอกน้ำหนักและความเข้มข้นผลิตภัณฑ์จริงก่อนคำนวณ mL
- CRI: เปิดคำนวณ CRI หรือสลับแท็บ CRI → เลือกยา/สัตว์ → CRI Dose Reference
- เลือกอัตราที่เหมาะกับผู้ป่วยแล้วกดยืนยัน ไม่เติมความเข้มข้น/ส่วนผสมอัตโนมัติ
- เปลี่ยนยา สัตว์ หรือวิธีคำนวณ CRI จะล้างอัตราและความเข้มข้นเดิม
- แก้ขนาด/หน่วยเองจะยกเลิกการอ้างว่าใช้โดสจากแหล่งอ้างอิง
- ผลคัดลอกมีบริบท วิธีให้ยา หน่วย ความถี่ หมายเหตุ แหล่งและหน้าอ้างอิง

ยาที่เติม
Marbofloxacin, medetomidine, fentanyl, tramadol, lidocaine, glycopyrrolate,
ephedrine, dobutamine, norepinephrine, robenacoxib, firocoxib, amoxicillin,
cephalexin, cefovecin, doxycycline, enrofloxacin, clindamycin,
trimethoprim/sulfamethoxazole, omeprazole, famotidine, pantoprazole,
prednisolone, dexamethasone, methylprednisolone, chlorpheniramine,
pimobendan, enalapril, benazepril, amlodipine, spironolactone
รวมถึงบริบทเพิ่มเติมของยาเดิม เช่น gabapentin, metoclopramide, metronidazole
และ amoxicillin/clavulanate แบบรักษาการติดเชื้อแยกจาก surgical prophylaxis

รูปแบบและข้อจำกัด
- คำว่า “ครบ” หมายถึงครบ 62 ชื่อยาในรายชื่อเครื่องคำนวณ ไม่ใช่ทุกสูตร/ทุกโรค
- Dose Reference ต้องเลือกสัตว์ ข้อบ่งใช้ route และความถี่ ไม่เป็นใบสั่งยาอัตโนมัติ
- Chlorpheniramine และบริบท mg/ตัว แสดงอ่านอ้างอิง ไม่แปลงเป็น mg/kg
- Firocoxib ในแมวแสดงข้อจำกัด ไม่ยืมขนาดสุนัข
- Dobutamine/norepinephrine: ต่อครั้งแสดงข้อมูล CRI เพื่ออ่าน; ใช้แท็บ CRI คำนวณ
- Local anaesthetic/เพดานรวม และ reversal ตามยาที่ให้ก่อน ต้องกำหนดแยก
- Amlodipine SPC เฉพาะแมวอย่างน้อย 2.5 kg มีการตรวจน้ำหนักก่อนใช้ขนาดอ้างอิง
- Amoxicillin/clavulanate และ TMP/sulfonamide ระบุฐานผลรวมตัวยา
- Tramadol มีหมายเหตุประกอบ AAHA 2022 เรื่องหลักฐานประสิทธิผล
- Antibiotics ต้องมีข้อบ่งใช้ ไม่ถือว่ารายชื่อ/โดสเป็นคำแนะนำให้ทุกเคส
- ไม่คำนวณจำนวนเม็ด loading dose ยาหลายชนิดในถุงเดียว หรือความเข้ากันได้
- หน่วยต่อครั้ง mg/kg, mcg/kg; CRI mg/kg/h, mg/kg/min, mcg/kg/h, mcg/kg/min
- ความเข้มข้น mg/mL, mcg/mL; ปั๊ม mL/h หรือ mL/kg/h; ยังไม่รวม IU, mEq, %

แหล่งอ้างอิง
รวม 13 แหล่ง ใช้ BSAVA Small Animal Formulary Part A ฉบับที่ 10 ปี 2020
จาก PDF ที่แนบในโครงการโดยตรวจหน้า DOSES/Appendix ตามแต่ละบริบท
ลิงก์ BSAVA เป็นข้อมูลหนังสือ ไม่ใช่หน้าโดสออนไลน์; ไม่แจก PDF/ข้อความตำราเต็ม
เสริม SPC ปัจจุบันของ VMD สำหรับ Marbofloxacin และ Amlodipine, Merck และ AAHA
คงอ้างอิง AAHA/RECOVER/ENOVAT ที่ตรวจในรุ่นก่อน; ไม่ผสมช่วงต่างแหล่งเป็นช่วงเดียว
ตรวจแหล่งต้นทางวันที่ 2026-10-11; ฉบับตำรายังเป็นปี 2020 ไม่ใช่ตำราปี 2026
ให้ตรวจฉลากและแนวทางปัจจุบันของประเทศตามผู้ป่วยและผลิตภัณฑ์
ข้อมูลยังไม่มี independent clinical signoff

ตรวจรายการทั้งหมดได้ที่ docs/knowledge/QUICK_DOSE_REFERENCE_V17_14_20.json
ตารางความครอบคลุมรายยา: docs/knowledge/DOSE_COVERAGE_V17_14_20.csv
ผลตรวจซอฟต์แวร์: 8604/8604 ผ่าน 31 ชุด
ทดสอบ 320x844, 390x844, 667x375 และ 1024x844; ภาพใน qa/evidence
คงข้อมูลเคส/clinical protocol เดิมและรูปแบบ CRI สองวิธี ไม่มีการเผยแพร่เว็บไซต์
การตรวจซอฟต์แวร์ไม่ใช่การรับรองโดสทางคลินิกหรือการทดสอบมือถือ/ปั๊มเครื่องจริง
