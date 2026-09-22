# ANESVET V15.0.0 — Hospital Pilot Release

Baseline: V14.9.0 Mobile/iPad OR Reliability

เป้าหมายของรุ่นนี้คือ harden ระบบก่อนเริ่ม hospital pilot โดยไม่เพิ่ม clinical dose, threshold หรือ diagnostic automation ใหม่

## 1. Verified active-case safety checkpoint
- ทุก successful local save ของ active case จะสร้างสำเนา safety checkpoint แยกจาก `CURRENT_KEY`
- checkpoint ถูก read-back verify ก่อนถือว่าสำเร็จ
- ถ้า current save อ่านไม่ได้ หรือ safety checkpoint ของเคสเดียวกันใหม่กว่า ระบบจะ recover state ที่ใหม่กว่า
- การ recovery ถูกบันทึกใน audit trail เป็น `SAFETY_CHECKPOINT_RECOVERED`
- มี banner แจ้งผู้ใช้เมื่อเกิด automatic recovery
- Reset และ final archive จะ clear active safety checkpoint เพื่อไม่ให้เคสเก่าฟื้นกลับมา; ระหว่าง lock→archive ยังคง checkpoint ไว้เป็น fallback หาก archive ล้มเหลว

## 2. Active-case identity / BW integrity
- เมื่อ Start Case ระบบ freeze `caseIdentitySnapshot` ของ patient link, name, HN, Visit ID, species, microchip และ current BW
- หากแก้ข้อมูลชุดนี้หลังเริ่มเคส ต้องระบุ **reason + corrected by** และยืนยันก่อน Save
- correction ถูกบันทึกเป็น `CASE_IDENTITY_BW_CORRECTED` ใน audit trail
- active case ที่อัปเกรดมาจาก V14.9 จะ bootstrap snapshot จากข้อมูลที่มีอยู่เพื่อให้ guard ทำงานต่อ

## 3. Medication stale-calculation guard
- Quick Drug และ medication confirmation ผูก calculation context กับ `caseId + current BW + frozen protocol capturedAt/version`
- ถ้าเคส น้ำหนัก หรือ frozen protocol เปลี่ยนหลังเปิด dialog แต่ก่อนกด Save ระบบจะ SAFETY STOP และบังคับ refresh/reopen calculation
- เพิ่ม rapid double-tap guard ระหว่างเขียน medication administration เพื่อช่วยลด accidental duplicate record
- ยังคงแยก `Calculated reference` ออกจาก `Actual administered` เหมือนเดิม

## 4. Recovery completion hardening
- ถ้า Recovery readiness ครบ สามารถ complete ตาม workflow เดิม
- ถ้ายังไม่ครบ จะต้องระบุ **reason + completed by** ก่อน mark complete
- override ถูกเก็บใน `recoveryCompletionOverride` และ audit trail
- Final Lock & Archive จะไม่อนุญาตจนมี `recoveryCompletedAt` (รวมกรณี complete ด้วย documented override)

## 5. Unchanged clinical behavior
- ไม่เปลี่ยน drug dose / concentration default
- ไม่เปลี่ยน alert threshold
- ไม่เปลี่ยน ASA logic
- ไม่วินิจฉัย BOAS อัตโนมัติ
- ไม่เปลี่ยน fluid reference / recovery score algorithm
- ไม่ rename/delete legacy LocalStorage keys หรือ IndexedDB stores

## Validation in this build environment
PASS:
- syntax + JSON
- source regression / storage contracts
- V14.7.2 UX compatibility
- V14.8 adaptive workflow static contracts
- V14.8.2 anesthetic risk contracts
- V14.9 mobile/iPad compatibility contracts
- V15.0 hospital-pilot safety contracts
- production clinical helpers: 73 assertions
- workflow model: 4 scenarios

NOT CLAIMED:
- jsdom/fake-indexeddb DOM integration suites
- Playwright browser E2E

Reason: browser-test dependencies are not installed in this runtime. The build should be acceptance-tested on the actual hospital phone/iPad/browser before relying on it as the sole clinical record.
