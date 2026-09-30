# ANESVET — Bugfix Checkpoint R01 (30 Sep 2026)

## จุดตั้งต้น
- Source: `ANESVET_V17_2_5_Boot_Runtime_Diagnostic_Rescue.zip`
- Runtime version: **V17.2.5 (ไม่เปลี่ยน)**
- Scope R01: **Boot / Runtime / ASA Interaction triage** เท่านั้น
- ห้ามเริ่มโปรเจกต์ใหม่จากศูนย์หรือ reset ข้อมูลผู้ป่วย

## อาการที่ต้องไล่ต่อ
- มีรายงาน Android/iPad ว่ากรอกช่องข้อความได้ แต่ ASA/buttons/navigation ไม่ตอบสนอง
- V17.2.5 มี boot sentinel และ diagnostic panel อยู่แล้ว
- **ยังไม่มีหลักฐานจากอุปกรณ์จริงเพื่อระบุต้นเหตุ**; ห้ามสรุปว่าแก้บั๊กสำเร็จ

## สิ่งที่ทำใน R01
1. แตก ZIP และตรวจโครงสร้าง: source/QA/Service Worker/README อยู่ในแพ็กเกจ
2. อ่าน runtime boot path, session interaction gate และการ bind ASA card
3. เพิ่ม **ไฟล์ทดสอบแยกส่วนเท่านั้น**: `QA_R01_PATIENT_ASA_BINDING.js`
4. รัน suite เดิม 6 ชุด + suite ใหม่ 1 ชุด
5. ตรวจไวยากรณ์ `.js` ทุกไฟล์ รวมไฟล์ QA ใหม่ 63 ไฟล์
6. ตรวจ byte-for-byte parity ของ runtime source กับ ZIP ต้นฉบับ

## ผลทดสอบ
| Suite | ผล |
|---|---:|
| R01 Patient ASA binding | 3/3 PASS |
| V17.2.5 Boot/Runtime | 13/13 PASS |
| V17.2.4 Interaction Gate | 6/6 PASS |
| V17.2.3 Active-case Rescue | 7/7 PASS |
| V17.2.2 Mobile Rescue | 3/3 PASS |
| V17.1 Sync Foundation | 17/17 PASS |
| V17.2 Sync Safety | 19/19 PASS |
| JavaScript syntax | 63/63 PASS |
| Runtime source parity | 100% UNCHANGED |

**สถานะ:** R01 = BASELINE / INSTRUMENTED. ไม่ใช่ bugfix ที่รับรองว่าปัญหาบนอุปกรณ์จริงหายแล้ว

## การทดสอบที่ต้องทำบนอุปกรณ์มีปัญหา
1. ใช้ V17.2.5 ที่เผยแพร่โดยมี version ตรงตามหัวแอป
2. บนอุปกรณ์ที่ไม่มี active case: แตะ ASA I/II ดูว่าบัตร selected และค่าเปลี่ยนหรือไม่
3. หากไม่ตอบสนอง ดูแผง Diagnostic (อาจปรากฏเอง) แล้วกด Tap test และคัดลอก Diagnostic
4. เก็บข้อมูล `stage`, `error`, `pointer`, `click`, `ASA probe`, `bodyClass`, `dialogs`, `globals`
5. เก็บ screenshot แผงพร้อมบอกชนิดอุปกรณ์ / browser / โหมด PWA
6. สำหรับ Android **ที่มี active case: ห้าม reset data, clear site data, หรือถอนแอป** ระหว่างตรวจ
7. หาก ASA ผ่าน ค่อยทดสอบสลับ tab Patient / Pre-check / Medication / OR LIVE โดยใช้เคสทดสอบ ไม่ใช้ข้อมูลเคสจริง

## Decision tree รอบถัดไป (R02 — รับหลักฐานก่อนแก้)
- `stage < patient-master-bound`: ไล่ script load / startup exception; แก้ส่วนที่ล้มตาม stack trace เท่านั้น
- `patient-master-bound` แล้วแต่ `ASA tap NOT_HANDLED`: ตรวจ event target, overlay/inert, session view-only, capture guard, handler conflicts
- `startup-complete` + ASA ทำงาน แต่ tab ไม่ทำงาน: แยกไปตรวจ navigation handler
- อุปกรณ์จริงผ่านทุกอย่าง: ปิด incident นี้และเลื่อนไป Phase 2 Patient Setup

## ขอบเขตที่จะไม่แตะใน R01
Drug dose/route/concentration, OR LIVE medication records, vital data, Recovery, Final Sign-off, Archive, Sync, DB schema, Service Worker, localStorage clinical keys

## คำสั่งให้เริ่มต้นแชต/Work mode รอบหน้า
"ทำต่อ ANESVET จาก BUGFIX_CHECKPOINT_R01_TH.md ใน zip นี้เท่านั้น ห้ามสร้างใหม่ ให้แก้เฉพาะบั๊ก Boot/Runtime ที่มีหลักฐานจากอุปกรณ์จริงหรือจาก automated regression; อธิบายจุดที่แก้ ทดสอบเฉพาะระบบและ regression สำคัญ แล้วบันทึก Checkpoint R02 พร้อม ZIP"
