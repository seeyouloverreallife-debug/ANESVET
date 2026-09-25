# ANESVET V15.14.0 — Hospital Branding & Report Identity

## เป้าหมาย
เพิ่ม Hospital Branding สำหรับรายงาน โดยไม่เพิ่มความรกในหน้าจอ clinical workflow และไม่เปลี่ยน clinical calculations / safety gates เดิม

## เพิ่มใหม่
- Settings → **Hospital Branding & Report Identity**
- ตั้งค่าได้: ชื่อโรงพยาบาล, ชื่อย่อ, ที่อยู่, โทรศัพท์, Email, Website/Facebook และข้อความ footer
- Upload โลโก้ PNG/JPG/WebP พร้อม preview
- ระบบย่อโลโก้ก่อนเก็บใน browser เพื่อลด local-storage usage
- เลือกได้ว่าจะ:
  - แสดงชื่อโรงพยาบาลใน report
  - แสดงข้อมูลติดต่อใน report
  - แสดงชื่อโรงพยาบาลเล็ก ๆ ใน app header
- Hospital branding แสดงในทั้ง:
  - 1-page Summary PDF
  - Full PDF Report
  - Archived case PDF export
- Backup / restore เดิมรวม Hospital Branding โดยอัตโนมัติ เพราะ branding อยู่ใน Hospital Settings

## Branding snapshot ต่อเคส
เมื่อ anesthesia case เริ่มจริง ระบบจะ freeze `ANESVET_HOSPITAL_BRANDING_V1` ไว้ในเคส เพื่อให้ชื่อ/โลโก้/ข้อมูลติดต่อของเคสนั้นคงที่ แม้ภายหลังโรงพยาบาลจะเปลี่ยน branding

เคส legacy ที่สร้างก่อน V15.14 และไม่มี branding snapshot จะ fallback ไปใช้ Hospital Branding ปัจจุบันตอนสร้าง report

## Report identity
Report header ใหม่รองรับ:
- Hospital logo
- Hospital name
- Contact line
- ANESVET document identity
- Custom hospital footer

หากไม่ได้ตั้ง branding รายงานยังสร้างได้ตามปกติและแสดง ANESVET เหมือนเดิม

## Safety / compatibility
ไม่มีการเปลี่ยน:
- Drug calculations / concentrations / doses
- Alert thresholds
- Pre-OR readiness / briefing clinical logic
- OR LIVE / Recovery workflow
- Medication administration safety
- Final lock / audit trail
- Storage keys เดิม

## Version/cache
- App version: `15.14.0`
- Service-worker cache: `anesvet-v15-14-0-hospital-branding-report-identity`
- เพิ่ม `branding.js` ใน offline asset cache
