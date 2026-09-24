# ANESVET V15.10.2 — Briefing → OR LIVE Transition Hotfix

รุ่นนี้เพิ่ม **Pre-OR Anesthesia Briefing** หลัง readiness ผ่านและก่อนเข้า OR LIVE เพื่อสรุปความเสี่ยง สิ่งที่ควรเตรียม Case Drug Plan และ initial support reference เช่น ETT, breathing circuit, O₂ flow, VT/PIP/RR และ fluid reference โดยไม่เขียนค่าเหล่านี้เป็น actual clinical record อัตโนมัติ

ดู `RELEASE_NOTES_V15_10_2.md` สำหรับรายละเอียด hotfix รุ่นนี้

## Previous V15.9.3 notes

รุ่น V15.9.3 ฝัง private pilot feedback endpoint และระบบ queue/retry เดิมไว้ ระบบดังกล่าวยังคงอยู่ใน V15.10.2 แต่ไม่มีการพัฒนาส่วน bug-report เพิ่มในรุ่นนี้

## Previous V15.8 notes

รุ่นนี้ต่อจาก V15.7.0 โดยลด `MORE` ใน OR LIVE ให้เป็น contextual menu ตาม phase และเพิ่ม **OR / Mobile Workflow Settings** เพื่อให้แต่ละโรงพยาบาลปรับความเรียบง่ายของมือถือ/iPad, Quick meds, interval, OR Focus และ report preference ได้เอง โดยไม่ลด safety guards เดิม

ดูรายละเอียดที่ `RELEASE_NOTES_V15_8_0.md`

## V15.8.0 — OR Workspace Customization

- ค่าเริ่มต้น `MORE = Minimal` และแสดงเฉพาะ action ที่เกี่ยวกับ phase ปัจจุบัน
- Induction: Medications / Airway / Event-Problem
- Intraoperative: Medications / Fluid-Blood / Event-Problem
- Emergence: Airway / Medications / Event-Problem
- Standard เพิ่ม Trends/Timeline; Full แสดงชุดเดิมทั้งหมด
- Settings เพิ่ม Quick meds 2/4/6, Recovery interval, Auto OR Focus, ซ่อน/แสดง Mini trends/Recent activity และ Default PDF
- OR vitals interval เพิ่มตัวเลือก 3 และ 15 นาที
- Confirm / Undo / readiness / medication safety / audit trail ยังบังคับเหมือนเดิม

---

# ANESVET V15.7.0 — Pre-OR Readiness & Workflow Guard Release

รุ่นนี้ต่อจาก V15.6.0 โดยเพิ่ม **Pre-OR Readiness Gate** เพื่อไม่ให้เปิด OR LIVE/Recovery ก่อนถึงจุดที่เหมาะสมของ workflow พร้อม documented clinical override สำหรับกรณีจำเป็น และเพิ่มทางออกจาก OR/Recovery focus ที่เห็นชัดบนมือถือ/iPad

ดูรายละเอียดที่ `RELEASE_NOTES_V15_7_0.md`

## V15.7.0 — Pre-OR Readiness & Workflow Guard

- OR LIVE ถูก gate ก่อน Start Case จน Patient/Case Setup, current BW, procedure, ASA, physical exam, risk review และ pre-op checklist พร้อม
- Hard blockers (patient/species/BW/unsaved setup) ข้ามไม่ได้
- Clinical readiness ที่ยังขาดสามารถ override ได้เฉพาะเมื่อบันทึก reason + responsible clinician + audit trail
- Case Drug Plan / Anesthetist / Surgeon แสดงเป็น recommended warnings ไม่ล็อก emergency workflow
- Recovery tab เปิดได้เฉพาะเมื่อ workflow เข้าสู่ Recovery จริง
- เพิ่ม `← CASE` ใน OR LIVE และ `← Case summary` ใน Recovery เพื่อออกจาก focus mode ง่ายขึ้น
- ปุ่มจาก Pre-check/Drug Calculator เปลี่ยนเป็น `ตรวจความพร้อม → OR LIVE`
- ไม่เปลี่ยน dose, alert threshold, ASA/BOAS logic, medication calculations หรือ storage schema

---

# ANESVET V15.6.0 — Drug Administration & Recovery Transition Release

รุ่นนี้ต่อจาก V15.5.0 โดยแก้ feedback จากการลองใช้จริงบนมือถือ/iPad: medication workspace ไม่เด้งกลับ OR LIVE หลังบันทึกยาแต่ละตัว, เพิ่ม batch สำหรับ planned induction medications, route/concentration กรอกได้ง่ายขึ้นและ manual medication ไม่ถูกล็อกเพราะไม่มีสูตรคำนวณ, แก้ Full Screen → Recovery transition และย้าย feedback `✓ SAVED` ให้อยู่เหนือ OR controls

ดูรายละเอียดที่ `RELEASE_NOTES_V15_6_0.md`

## V15.6.0 — Drug Administration & Recovery Transition

- Medication workspace ต่อเนื่อง: Save ยาแล้วอยู่หน้าบันทึกยาเพื่อเพิ่มตัวถัดไปได้ทันที
- Planned induction: `Record all planned induction meds` + `Use calculated amounts` แล้ว review actual/route/concentration ก่อน confirm
- Route quick choices: IV / IM / SC / PO / IV/IO / CRI พร้อม free text
- Concentration preset ดึงจาก frozen protocol/library เท่าที่มี และเลือก Manual ได้
- ยา manual หรือยาไม่มี calculation ยังบันทึก actual administration ได้หลังระบุ preparation เอง
- Full Screen จะไม่บังคับ OR LIVE ค้างเมื่อเปลี่ยนเข้า Recovery
- `✓ SAVED` ของ OR vitals แสดงเหนือ fixed dock ชัดเจน
- ไม่เปลี่ยน dose defaults, alert thresholds, ASA, BOAS, fluid reference หรือ recovery readiness logic

---

# ANESVET V15.5.0 — Case Drug Plan & Compact Report Release

รุ่นนี้ต่อจาก V15.4.0 โดยแก้ workflow ยาและ reporting จากการทดสอบใช้งานจริงบนมือถือ/iPad: Drug Calculator สร้าง **Case Drug Plan** แล้ว freeze เข้า OR LIVE, Induction ให้กรอก actual administered ตามแผนโดยไม่ต้องเลือกยาเดิมซ้ำ, เพิ่ม **1-page Summary PDF** และเพิ่ม feedback ที่เห็นชัดหลัง Save Vitals

ดูรายละเอียดที่ `RELEASE_NOTES_V15_5_0.md`

## V15.5.0 — Case Drug Plan & Compact Report

- Case Drug Plan เริ่มจาก Hospital Protocol / Quick Presets และปรับเฉพาะเคสได้
- planned induction drugs ถูกดึงเข้า OR LIVE โดยตรง; ยานอกแผนยังเพิ่มได้
- Emergency / standby drugs สามารถเตรียมไว้ใน plan และขึ้นเป็น Quick meds ใน OR
- แผนยาถูก freeze กับ case + BW + protocol snapshot เมื่อเริ่มเคส
- เพิ่ม 1-page Summary PDF แยกจาก Full PDF รายละเอียดเต็ม
- หลัง Save anesthesia vitals มี inline `✓ SAVED` feedback + save-button flash

# ANESVET V15.4.0 — Recovery UX Release


รุ่นนี้ต่อจาก V15.3.0 โดยปรับ **Recovery ให้เป็น touch-first phase สำหรับมือถือ/iPad**: มี Recovery quick workspace, COPY LAST, RECORD VITALS เป็น action หลัก, fixed mobile dock และ readiness glance ที่สอดคล้องกับ completion guard จริง โดยไม่เปลี่ยน dose/threshold/ASA/BOAS logic เดิม

ดูรายละเอียดที่ `RELEASE_NOTES_V15_4_0.md`

## V15.4.0 — Recovery UX Release

- Recovery quick workspace แสดง latest HR/RR/SpO₂/Temp/Mentation + due timer
- COPY LAST เติมข้อมูลรอบก่อนเพื่อแก้เฉพาะค่าที่เปลี่ยน แต่ไม่ auto-save record
- Mobile/iPad dock: **RECORD VITALS / MEDS / MORE**
- จัดลำดับ Recovery บนมือถือเป็น Observations → Records → Score → Handoff → Problems
- Readiness UI กับ completion guard ใช้ requirement เดียวกัน รวม saved Recovery score อย่างน้อย 1 ครั้ง
- More sheet รวม checklist, score, problems, handoff, event/intervention, complete, undo และ emergency OR return

## V15.1.0 — OR LIVE Navigation & Focus Release

รุ่นนี้ต่อจาก V15.0.0 โดยแก้ pain point จากการลองใช้ OR LIVE บนมือถือ/iPad: ลด action หลักจาก 5 ปุ่มเหลือ **NEXT STEP / VITALS / MORE**, ทำ NEXT ให้แสดงชื่อ action จริงตาม phase, เพิ่ม step counter และ OR Focus mode เพื่อให้ผู้ใช้รู้ทันทีว่าต้องกดอะไรเพื่อเดินเคสต่อ โดยคง Hospital Pilot safety logic เดิมทั้งหมด

ดูรายละเอียดที่ `RELEASE_NOTES_V15_1_0.md`

## V15.0.0 — Hospital Pilot Release

รุ่นนี้ต่อจาก V14.9.0 และเน้น **clinical pilot safety / data integrity** ก่อนใช้กับเคสจริงแบบมีระบบเดิมเป็น backup: verified active-case checkpoint, active-case identity/BW correction audit, stale medication-calculation guard, double-tap protection และ documented recovery override ก่อน Final Lock

ดูรายละเอียดที่ `RELEASE_NOTES_V15_0_0.md`

## V14.9.0 — Mobile/iPad OR Reliability

รุ่นนี้ต่อจาก V14.8.2 โดยเน้นการใช้งานจริงบนมือถือและ iPad ในห้องผ่าตัด: touch-first OR LIVE, local-first autosave/recovery, safe-area และปุ่มสำคัญที่เข้าถึงด้วยนิ้วได้เร็ว โดยไม่เปลี่ยน clinical dose/threshold logic เดิม

ดูรายละเอียดที่ `RELEASE_NOTES_V14_9_0.md`



## V14.8.2 — Structured Anesthetic Risk Flags

เพิ่มการทบทวนความเสี่ยงเฉพาะตัวก่อนวางยา โดยแยก **Brachycephalic anatomy** ออกจาก **Suspected / known BOAS** และไม่วินิจฉัย BOAS หรือกำหนด ASA อัตโนมัติ

- Risk groups: airway/BOAS, aspiration, cardiac/respiratory, perfusion/bleeding, renal/hepatic/metabolic, age/body condition, previous anesthetic event และ procedure risk
- BOAS detail จะขยายเฉพาะเมื่อเลือก Brachycephalic/BOAS
- มี `No additional risk flags identified` เพื่อแยก “ทบทวนแล้วไม่พบ flag เพิ่ม” ออกจาก “ยังไม่ได้ทบทวน”
- ปุ่ม **Save risk review & mark checklist Done** บันทึก reviewer/timestamp/audit และ mark checklist
- Risk flags แสดงต่อใน patient banner, Case Summary, OR LIVE และ PDF/print report
- Airway-related risk มี visual emphasis ใน OR LIVE แต่ไม่เปลี่ยนยา dose/threshold/protocol

ดูรายละเอียดที่ `RELEASE_NOTES_V14_8_2.md`

## V14.8.1 — Structured Pre-anesthetic Physical Examination

เพิ่มแบบบันทึกผลตรวจร่างกายก่อนวางยาในหน้า **Pre-anesthetic** โดยไม่เปลี่ยน dose, alert threshold หรือ clinical protocol เดิม

- Structured findings: mentation, HR, pulse, cardiac auscultation, RR, respiratory effort, lung auscultation, temperature, mucous membrane, CRT, hydration และ pain/discomfort
- ช่อง `Abnormal findings / relevant physical exam notes` และ `Examined by`
- ปุ่ม **Save exam & mark checklist Done** บันทึกเวลา/ผู้ตรวจและติ๊ก `Pre-anesthetic physical exam` ให้อัตโนมัติ
- หากแก้ผลตรวจหลังบันทึก สถานะ recorded จะถูกยกเลิกและต้องกดบันทึกใหม่ เพื่อไม่ให้ timestamp เก่าถูกตีความว่าเป็นผลล่าสุด
- Temperature ใช้ระบบ °C/°F เดียวกับ ANESVET และเก็บ canonical Fahrenheit ภายในตาม architecture เดิม
- Structured physical examination ถูกนำไปแสดงใน PDF/print report ของเคส
- เคสเก่าไม่มีฟิลด์ชุดนี้ยังเปิดได้ตาม backward compatibility เดิม

ดูรายละเอียดที่ `RELEASE_NOTES_V14_8_1.md`

## V14.8.0 — Adaptive Clinical Workflow

เพิ่ม `OR workflow profile` ต่อเคส: Routine / Elective, Emergency / Critical, C-section และ Custom โดย OR LIVE จะปรับ contextual actions และ metrics ตามบริบท แต่ **ไม่เปลี่ยนยา dose, threshold หรือ clinical protocol อัตโนมัติ**

- Critical: บันทึก Stabilization / support checkpoint ก่อน induction ได้โดยไม่เริ่ม anesthesia timer
- C-section: บันทึก First neonate / Last neonate และคำนวณ elapsed time จาก Induction
- Routine: เก็บ fast path ของ V14.7.2 ให้สั้นและกด Record / Medication ได้เร็ว
- เคสเก่าที่ไม่มี profile จะเปิดเป็น Routine เพื่อ backward compatibility

ดูรายละเอียดที่ `RELEASE_NOTES_V14_8_0.md`


พัฒนาต่อจาก ANESVET V14.7.1 โดยคง clinical workflow, storage keys, IndexedDB schema, alert protocol และ medication audit เดิมทั้งหมด รอบนี้แก้ workflow ตามการใช้งานจริงใน OR: เริ่ม induction ต้องเร็ว, ยา induction อาจมากกว่าหนึ่งตัว, ปริมาณยาสามารถลงย้อนหลังหลัง airway stable และต้องมีจุดบันทึกยาเพิ่มเติมที่มองเห็นง่ายตลอดเคส

**สถานะ: release candidate — syntax, source regression, workflow model และ production clinical helpers ผ่านใน runtime นี้; native browser/origin E2E ถูก environment policy บล็อก (`ERR_BLOCKED_BY_ADMINISTRATOR`) และ npm dependency install timeout จึงไม่อ้างว่า full DOM/PWA E2E ผ่าน** ดู `tests/TEST_RESULTS.txt` และ `tests/BROWSER_E2E_STATUS.txt` สำหรับขอบเขตการทดสอบจริง



## V14.7.2 — Faster induction + deferred medication documentation

- **Start induction เป็น one-tap timestamp**: กดแล้วเริ่ม timer, freeze protocol และลง Induction milestone ทันที โดยไม่เปิดช่องกรอกยาในช่วงที่กำลังจัดการผู้ป่วย
- **ลงยา induction ภายหลังได้**: OR LIVE แสดง `MEDS • induction pending` จนกว่าจะ review เสร็จ ยาที่ลงย้อนหลังผูกเวลา administration กับ Induction milestone แต่เก็บ `documentedAt` แยกเพื่อ audit
- **รองรับ induction มากกว่าหนึ่งยา**: dialog เดิมเปลี่ยนเป็น batch review; บันทึก Diazepam, Propofol หรือยาจาก frozen protocol ต่อกันได้หลายตัว แล้วกด Done เมื่อครบ
- **Medication เข้าถึงได้ตลอดเคส**: เพิ่มปุ่ม `💉 MEDS` ใน sticky OR bar และ Medication ใน Recovery เพื่อบันทึกยา intra-op / emergence / recovery โดยไม่ต้องหา Events & Drugs ด้านล่าง
- **Recovery Handoff ย่อให้เห็นเฉพาะสาระสำคัญ**: duration/extubation, airway, latest vitals, fluids/loss, medications และ open problems เป็น 6 cards; รายละเอียดเดิมยังอยู่ใน collapsible `ดูรายละเอียด Handoff ทั้งหมด` และ snapshot history
- Recovery action bar ถูกย้ายขึ้นก่อน Handoff เพื่อให้การบันทึก recovery เป็นงานหลักของหน้า
- ไม่มีการเปลี่ยน clinical dose, concentration default, alert threshold, fluid reference, recovery score, storage keys หรือ IndexedDB schema

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
- Version, URL cache busting, backup version, manifest และ service-worker cache เป็น V14.7.2

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
5. Locked current/archive ไม่ถูกแปลงเป็น payload V14.7.2 อัตโนมัติ; checksum validation ครอบคลุมทั้ง archived และ locked current ใน backup

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

`npm test` ถูกออกแบบให้รัน syntax, source regression, workflow model, production helpers และ DOM integration (jsdom + fake-indexeddb) แต่ใน runtime ที่จัดทำ V14.7.2 นี้ `npm ci` timeout และ browser policy บล็อก localhost/file navigation จึงยืนยันได้เฉพาะ syntax, source regression, workflow model และ production helper tests; **ไม่อ้างว่า DOM/PWA suite ผ่าน**

V14.7.1 เคยมี supplemental Chromium smoke test; สำหรับ V14.7.2 runtime นี้ Chromium navigation ถูก policy บล็อกทั้ง localhost และ file URL จึงยังต้องทำ acceptance test บนเครื่องจริงก่อน production โดยเฉพาะ deferred multi-drug induction, Recovery medication, service worker/PWA update และ print/PDF

`npm run test:browser` เป็น acceptance gate ที่ต้องรันบนเครื่องที่อนุญาต HTTP origin/native storage ของ Chromium เพื่อยืนยัน desktop/mobile, hospital/case alerts, actual drug, handoff/reload, Emergency return, Legacy route, offline cache และ PWA behavior ก่อนใช้งานจริง

รายละเอียด architecture: `ARCHITECTURE_V14_7.md` • V14.7 change record: `RELEASE_NOTES_V14_7.md` • V14.7.1 UX changes: `RELEASE_NOTES_V14_7_1.md` • V14.7.2 changes: `RELEASE_NOTES_V14_7_2.md`
## V15.3.0 — Intraoperative Vitals & Timeline

ช่วง `INTRAOPERATIVE` ใช้ Vitals-first cockpit เป็นจุดทำงานหลัก: `COPY LAST` เติมค่าจาก record ล่าสุดเพื่อแก้เฉพาะสิ่งที่เปลี่ยน และ `SAVE VITALS` ใช้ record safety path เดิมทั้งหมด ส่วน Procedure Timeline แสดง vital records ทุกชุดร่วมกับ milestones, drugs, alerts/interventions และ recovery ตามเวลาเดียวกัน

Quick meds จะแสดงเฉพาะรายการ Favorite จาก Hospital Drug Library และการแตะจะเปิด medication dialog พร้อมเลือกยาให้เท่านั้น ไม่ได้บันทึก actual administration อัตโนมัติ

ดูรายละเอียดที่ `RELEASE_NOTES_V15_3_0.md`


## V15.9.2 Feedback delivery
- ผู้ใช้เห็นสถานะ Sending / Submitted / Queued ชัดเจน
- ถ้า Google Apps Script response ถูก CORS/redirect block ระบบ fallback เป็น no-CORS POST และ sendBeacon
- report ถูกบันทึก local queue ก่อนส่งทุกครั้ง
- หาก offline จะส่งซ้ำอัตโนมัติเมื่อกลับ online


## V15.9.3 Feedback endpoint update
- เปลี่ยน private Hospital Pilot feedback endpoint เป็น deployment ใหม่ที่ผู้พัฒนาให้มา
- ผู้ใช้ยังไม่เห็น URL ใน Settings/UI
- queue/retry และ delivery fallback จาก V15.9.2 ยังคงเดิม


## V15.10.1 hotfix
- แก้ปุ่ม `Reviewed → Open OR LIVE` ที่ review แล้วแต่ไม่เปลี่ยนหน้า
- ปรับ ETT preparation estimate ใหม่จาก species + lean BW + breed/skull conformation
- Brachycephalic/airway-risk ไม่ใช้ weight estimate เป็น final size และเตรียม tray กว้างขึ้น
- แมวใช้ adult feline range 3.5–5.0 mm เป็นหลักในการเตรียม พร้อมช่วง 2.0–5.5 mm ให้เลือกตาม anatomy


## V15.10.2 hotfix
- แก้ root cause ของปุ่ม `Reviewed → Open OR LIVE`: `preOrBriefingSignature()` อ้างตัวแปรผิดชื่อ `PREOP_RISK_DEFS` ซึ่งไม่มีอยู่จริง; เปลี่ยนเป็น `PREOP_RISK_FLAGS`
- เพิ่ม dedicated Briefing → OR LIVE transition: re-check readiness, verify save, close dialog safely, open OR LIVE แบบ one-time forced transition หลัง safety ผ่าน และตรวจยืนยันว่า OR page active จริง
- Service worker เปลี่ยน navigation/index เป็น network-first เพื่อลดปัญหา hotfix ถูก cache เก่าบน GitHub Pages/PWA
- Browser-level Chromium test ผ่าน flow Patient → Pre-op → Briefing → Open OR LIVE โดยไม่มี JavaScript error
