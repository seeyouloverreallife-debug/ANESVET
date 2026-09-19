# ANESVET V14.7.1 — OR LIVE Workflow UX

พัฒนาต่อจาก ANESVET V14.7 โดยคง clinical workflow, storage keys, IndexedDB schema, alert protocol, medication audit และ recovery handoff เดิมทั้งหมด รอบนี้เน้นลด cognitive load ใน OR LIVE และทำให้ปุ่มที่ต้องใช้ตามลำดับเคสอยู่ด้านบน

**สถานะ: release candidate — syntax/regression/workflow helper ผ่าน และ OR LIVE workflow ผ่าน supplemental real-Chromium smoke test; full origin-based PWA E2E ยัง BLOCKED และ jsdom DOM suite ยังรันไม่ครบใน runtime นี้** ดู `tests/TEST_RESULTS.txt`, `tests/SUPPORTED_TEST_RUN.txt` และ `tests/BROWSER_E2E_STATUS.txt` สำหรับขอบเขตการทดสอบจริง


## V14.7.1 — OR LIVE UX simplification

- เพิ่ม **Next Clinical Step** ด้านบน OR LIVE: ปุ่มหลักเปลี่ยนตาม phase โดยอัตโนมัติ เช่น Induction → Airway/Intubation → Surgery start → Surgery end → Extubation/Recovery
- **Induction + Drug** รวม workflow: เริ่ม case/freeze protocol แล้วเปิดยา induction จาก frozen protocol ทันที ไม่ต้องเลื่อนไป Quick Actions หรือ Drug Calculator
- Induction drug เลือกจาก plan / Hospital Quick Preset เมื่อ match ได้; หากไม่ match ระบบไม่เดายาให้และให้เลือกจาก frozen protocol
- Actual administered ยังคงต้องกรอกเอง ไม่ auto-fill จาก calculated volume เพื่อรักษา medication safety
- Save Airway ใน workflow Intubation จะลง Intubation milestone ให้อัตโนมัติ และจะบันทึก Induction milestone ก่อนถ้ายังไม่มี
- Start/Resume, Pause, Keep awake, manual Recovery และ Full screen ย้ายเข้า **Tools** เพื่อลดปุ่มหลักบนหน้าจอ
- Workflow tracker ถูกยุบเป็นรายละเอียดที่กดเปิดดูได้ แทนการกินพื้นที่ด้านบนตลอดเวลา
- Fluid/Blood Loss, Airway และ Event/Problem เปลี่ยนเป็น collapsible panels
- ซ่อน workspace ซ้ำใน OR LIVE ได้แก่ status row ชุดที่สอง, Prioritized Alerts ชุดซ้ำ และ Active Complications ชุดซ้ำ; ข้อมูลและ DOM hooks เดิมยังคงไว้เพื่อ compatibility
- Active Alerts / Problems เป็น problem workspace หลักเพียงจุดเดียวที่แสดงตลอด
- ไม่มีการเปลี่ยน clinical dose, concentration default, alert threshold, fluid reference, recovery score หรือ storage keys

## สิ่งที่เพิ่ม

- Configurable Alert Protocol: MAP, SpO₂, ETCO₂ และ Temperature ตั้ง warning/critical ด้านต่ำและด้านสูงได้ โดยเว้นทั้งคู่ด้านสูงเพื่อปิดได้
- Settings → Edit hospital alerts: ค่าเริ่มต้นของโรงพยาบาล พร้อมผู้แก้ไข เหตุผล และ audit ก่อน/หลัง; เคารพ Hospital Protocol Lock
- เมื่อ Start Case จะ freeze alert protocol, ขนาดยา, concentration และ drug library ลง protocolSnapshot
- OR LIVE → Case alert override: ปรับเป้าหมายของเคสพร้อมเหตุผล/audit; Return to frozen defaults คืนค่าจาก snapshot ของเคสนั้น
- OR LIVE → OR Quick Drug: ใช้ Current BW ที่บันทึกแล้วกับสูตรใน frozen protocol; ช่อง Actual เริ่มว่าง ต้องกรอก actual mL, route, ผู้ให้ และ preparation แล้วกดยืนยัน บันทึกใน drugAdministrations และเชื่อม timeline โดยอยู่หน้า OR LIVE
- Active Alerts / Problems ใน OR LIVE และ Recovery: Acknowledge, Intervention และ Resolve/outcome พร้อมผู้บันทึก เวลา และประวัติ; complication เดิมยังใช้ได้
- Recovery Handoff Summary สร้างอัตโนมัติเมื่อ Begin Recovery, Extubation หรือกลับจาก Emergency OR พร้อม immutable snapshot ประวัติและ summary ปัจจุบัน; มีใน PDF report ด้วย
- More → Advanced → Legacy Monitoring; route `dashboard`, input IDs และข้อมูลเดิมยังใช้ได้
- Version, URL cache busting, backup version, manifest และ service-worker cache เป็น V14.7.1

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
5. Locked current/archive ไม่ถูกแปลงเป็น payload V14.7.1 อัตโนมัติ; checksum validation ครอบคลุมทั้ง archived และ locked current ใน backup

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

`npm test` ถูกออกแบบให้รัน syntax, source regression, workflow model, production helpers และ DOM integration (jsdom + fake-indexeddb) แต่ใน runtime ที่จัดทำ V14.7.1 นี้ dependency `jsdom` ติดตั้งไม่สำเร็จ จึงรันได้ถึง production helpers เท่านั้น และ **ไม่อ้างว่า DOM suite ผ่าน**

มี supplemental real-Chromium smoke test โดยโหลด source production จริงเข้า Chromium ด้วย `page.set_content` เนื่องจากนโยบาย runtime บล็อก `localhost`, `127.0.0.1` และ `file://` ผล interaction OR LIVE ผ่านตั้งแต่ Patient setup → Induction + Drug → Intubation/Airway → Surgery start → Record → Surgery end → Extubation → Recovery/Handoff พร้อมตรวจ visual layout จาก screenshot แต่การทดสอบนี้ไม่ครอบคลุม service worker, PWA upgrade หรือ real-origin storage

`npm run test:browser` เป็น acceptance gate ที่ต้องรันบนเครื่องที่อนุญาต HTTP origin/native storage ของ Chromium เพื่อยืนยัน desktop/mobile, hospital/case alerts, actual drug, handoff/reload, Emergency return, Legacy route, offline cache และ PWA behavior ก่อนใช้งานจริง

รายละเอียด architecture: `ARCHITECTURE_V14_7.md` • V14.7 change record: `RELEASE_NOTES_V14_7.md` • V14.7.1 UX changes: `RELEASE_NOTES_V14_7_1.md` • provenance เดิม: `SOURCE_PROVENANCE.json` • provenance รอบ UX: `SOURCE_PROVENANCE_V14_7_1.json`
