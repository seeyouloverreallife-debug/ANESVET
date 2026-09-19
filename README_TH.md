# ANESVET V14.7 — OR LIVE & Clinical Workflow

พัฒนาต่อจาก source V14.6.4 ที่แนบมา โดยคง HTML/CSS/JavaScript PWA, storage keys และ IndexedDB schema เดิม ไม่ได้สร้างแอปใหม่จากศูนย์

**สถานะ: release candidate — syntax/regression/workflow/DOM ผ่าน; real browser E2E ยัง BLOCKED และยังไม่ถือว่าผ่าน release gate ครบทั้งหมด** ดู `tests/TEST_RESULTS.txt` และ `tests/SUPPORTED_TEST_RUN.txt` สำหรับผลรันจริง

## สิ่งที่เพิ่ม

- Configurable Alert Protocol: MAP, SpO₂, ETCO₂ และ Temperature ตั้ง warning/critical ด้านต่ำและด้านสูงได้ โดยเว้นทั้งคู่ด้านสูงเพื่อปิดได้
- Settings → Edit hospital alerts: ค่าเริ่มต้นของโรงพยาบาล พร้อมผู้แก้ไข เหตุผล และ audit ก่อน/หลัง; เคารพ Hospital Protocol Lock
- เมื่อ Start Case จะ freeze alert protocol, ขนาดยา, concentration และ drug library ลง protocolSnapshot
- OR LIVE → Case alert override: ปรับเป้าหมายของเคสพร้อมเหตุผล/audit; Return to frozen defaults คืนค่าจาก snapshot ของเคสนั้น
- OR LIVE → OR Quick Drug: ใช้ Current BW ที่บันทึกแล้วกับสูตรใน frozen protocol; ช่อง Actual เริ่มว่าง ต้องกรอก actual mL, route, ผู้ให้ และ preparation แล้วกดยืนยัน บันทึกใน drugAdministrations และเชื่อม timeline โดยอยู่หน้า OR LIVE
- Active Alerts / Problems ใน OR LIVE และ Recovery: Acknowledge, Intervention และ Resolve/outcome พร้อมผู้บันทึก เวลา และประวัติ; complication เดิมยังใช้ได้
- Recovery Handoff Summary สร้างอัตโนมัติเมื่อ Begin Recovery, Extubation หรือกลับจาก Emergency OR พร้อม immutable snapshot ประวัติและ summary ปัจจุบัน; มีใน PDF report ด้วย
- More → Advanced → Legacy Monitoring; route `dashboard`, input IDs และข้อมูลเดิมยังใช้ได้
- Version, URL cache busting, backup version, manifest และ service-worker cache เป็น V14.7

## Clinical defaults ที่คงเดิม

ค่าต่อไปนี้คัดจาก V14.6.4 เพื่อรักษาพฤติกรรมเดิม ไม่ได้เปลี่ยนตามตำราหรือเพิ่มคำแนะนำการรักษาใหม่

| Parameter | Warning | Critical |
|---|---|---|
| MAP (mmHg) | <70 | <60 |
| SpO₂ (%) | <95 | <90 |
| ETCO₂ (mmHg) | <40 หรือ >55 | <30 หรือ >60 |
| Temperature (°F ภายในระบบ) | <99 | <98 |

ใช้เครื่องหมาย < / > แบบ strict เช่น MAP =60 อยู่ระดับ warning ไม่ใช่ critical ส่วน 70 เป็นค่าปกติตามค่าเริ่มต้น ไม่มี upper Temperature threshold ที่เปิดไว้โดยอัตโนมัติ ช่องตั้ง threshold ใช้ °F เพื่อคงค่าเดิมได้ตรง; monitoring ยังคงเลือก °C/°F ได้ ค่า 99°F ≈37.22°C และ 98°F ≈36.67°C

ไม่ได้เปลี่ยน built-in dose, สูตรคำนวณยา, HR/RR threshold, fluid reference, recovery readiness/score หรือ plausibility checks เดิม ยา Cefazolin/Convenia คงสูตร BW ÷ divisor เดิม; ต้องระบุ preparation ที่ใช้ก่อนบันทึก actual สูตรหรือ concentration ที่ขาดใน legacy snapshot จะคำนวณ Quick Drug ไม่ได้ แทนการนำ hospital defaults ปัจจุบันมาใส่ให้เงียบ ๆ

## พฤติกรรมที่เปลี่ยนอย่างชัดเจน

- ติดตามทั้ง warning และ critical ทั้ง 4 parameters แม้ปิด critical popup; popup เป็นเพียงการแจ้งเตือน
- เมื่อ warning ขึ้นเป็น critical ต้อง acknowledge ใหม่; การเว้นว่าง/N/A ไม่ทำให้ alert หาย
- การ resolve อัตโนมัติต้องมีค่าภายในช่วง normal ของ protocol; threshold สำหรับการปิด episode จึงต่างจาก latch ของ popup รุ่นเดิม
- Resolve ด้วยคนต้องมีเหตุผลและยืนยันหากค่าสุดท้ายยังผิดปกติ; ไม่เปิดซ้ำจากค่าเดิมเพียงเพราะ render/reload แต่จะประเมินอีกครั้งเมื่อกรอก/Record observation ใหม่
- เปลี่ยน protocol รายเคสจะปิด episode เดิมด้วยเหตุผล `protocol-change` และประเมินใหม่ภายใต้เกณฑ์ใหม่ ไม่ลงว่า physiological recovery
- Recovery ประเมิน alert จากค่าที่กด Record; ไม่มี ETCO₂ ใน Recovery จะไม่ปิด ETCO₂ episode ให้เอง
- แถว record เก็บ alert protocol ตอนบันทึก ไม่เปลี่ยนสีตามค่า hospital defaults ที่แก้ภายหลัง; แถวเก่าที่ไม่มี protocol ใช้เกณฑ์เดิม
- ต้อง resolve/document outcome ของ active alerts ก่อน Final Lock เพิ่มจาก complication gate เดิม
- Summary แสดงเฉพาะ actual administration ที่ไม่ VOID, ค่าที่กด Record และข้อมูลที่บันทึก; ช่องว่างไม่แปลงเป็น 0 หรือถือว่า normal

## อัปเกรดและใช้ข้อมูลเดิม

1. Backup all data จาก V14.6.4 ก่อนเปลี่ยนไฟล์
2. วาง runtime files ชุดนี้ให้ครบ รวม `clinical-workflow.js` โดยใช้ origin เดิม (scheme/host/port เดิม) เพื่อเข้าถึง browser storage เดิม
3. Service worker ใหม่ยังรอการยืนยัน update ตาม flow เดิม; จบ/เก็บเคสที่ใช้อยู่ก่อน activate update
4. เคสที่เริ่มแล้วแต่ไม่มี alertProtocol ใน snapshot ใช้ legacy thresholds ต่อไป; เคสใหม่ใช้ hospital defaults
5. Locked current/archive ไม่ถูกแปลงเป็น payload V14.7 อัตโนมัติ; checksum validation ครอบคลุมทั้ง archived และ locked current ใน backup

Runtime ไม่ต้องใช้ npm/build สามารถให้บริการทั้งโฟลเดอร์ด้วย HTTPS หรือ localhost เช่น `python3 -m http.server 8080` แล้วเปิด `http://localhost:8080/` การเปิดผ่าน file:// ไม่เหมาะกับการทดสอบ PWA/storage

localStorage keys ยังคง `anesvet_v14_3_*` และ legacy keys เดิม; IndexedDB ยังคง `ANESVET_DB` version 2 มีเพียง fields เพิ่มในเคสที่แก้ไขได้ ไม่ rename/delete keys

## ทดสอบ

ต้องใช้ Node.js ≥22 สำหรับชุดทดสอบ (แอป runtime ไม่ต้องใช้ Node)

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
```

`npm test` รัน syntax, source regression, workflow model เดิม, production helpers และ DOM integration ของแอปจริง (jsdom + fake-indexeddb) DOM tests จำลอง dialog/canvas/browser APIs จึงไม่ทดแทน real browser E2E

`npm run test:browser` ใช้ Playwright, HTTP origin และ native storage ของ Chromium ครอบคลุม desktop/mobile, hospital/case alerts, actual drug, Extubation, handoff, reload, Emergency return, Legacy route และ offline cache smoke มี screenshot หลังรันสำเร็จใน `tests/artifacts/` ถ้ามี Chromium อยู่แล้วตั้ง `CHROMIUM_BIN` ได้

ในสภาพแวดล้อมที่จัดทำ ZIP นี้ real browser E2E ยังรันไม่สำเร็จ: Chromium ไม่มีใน runtime, download timeout และ browser service บล็อกการเปิดแอป จึงยังไม่รับรอง visual layout, native dialog focus, print pagination, offline/PWA upgrade หรือการใช้งานจริงบนอุปกรณ์ ต้องรัน browser gate ก่อนยกระดับจาก release candidate

รายละเอียด architecture: `ARCHITECTURE_V14_7.md` • การเปลี่ยนแปลง: `RELEASE_NOTES_V14_7.md` • source provenance: `SOURCE_PROVENANCE.json`
