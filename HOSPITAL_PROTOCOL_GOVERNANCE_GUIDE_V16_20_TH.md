# คู่มือ Hospital Protocol Governance — ANESVET V16.20.0

## Workflow ที่แนะนำ

### 1. PUBLISHED
ใช้กับเคสใหม่ตามปกติ ระบบล็อก protocol configuration เพื่อป้องกันการแก้โดยไม่ตั้งใจ

### 2. Create Draft
ทำเมื่อโรงพยาบาลต้องการเปลี่ยน dose/factor, concentration, Alert Protocol, Drug Library หรือ Quick Presets

ระหว่างมี Draft ระบบจะไม่ให้เริ่มเคสใหม่บนเครื่องนี้ เพื่อป้องกันไม่ให้ working configuration หลุดเข้า clinical case ก่อน publish

### 3. Save configuration
แก้และ Save Hospital Settings / Drug Library / Quick Presets ตามปกติ

### 4. Protocol Dose Review
Run review และ Mark current configuration reviewed ในส่วน Protocol Dose Review ให้เรียบร้อย

### 5. Mark REVIEWED
กด **Mark REVIEWED** ใน Hospital Protocol Governance และระบุ reviewer

ANESVET จะเก็บ snapshot + fingerprint ของ configuration ชุดนั้น หากเปลี่ยน configuration หลัง review จะต้อง review ใหม่ก่อน publish โดย gate ตรวจเทียบ payload จริง ไม่ได้พึ่ง fingerprint อย่างเดียว

### 6. Publish
กด **Publish** และระบุ publisher เมื่อสำเร็จ:
- version นี้กลายเป็น PUBLISHED
- version PUBLISHED ก่อนหน้าจะถูก Retire อัตโนมัติว่า superseded
- Hospital Protocol ถูก lock
- เคสใหม่จึงเริ่มได้อีกครั้ง

### 7. Start Case
ตอนเริ่มเคส ANESVET ตรวจว่า live configuration ยังตรงกับ PUBLISHED fingerprint และ freeze protocol snapshot เข้าเคส

หลังจากนั้นการ publish version ใหม่จะไม่เปลี่ยน protocol ของเคสที่เริ่มไปแล้ว

## Discard Draft
หากยกเลิกการแก้ protocol ให้ใช้ **Discard draft** ระบบจะ restore active PUBLISHED configuration กลับมาและ lock อีกครั้ง

## Retire Published
ใช้เมื่อต้องการหยุดใช้ protocol โดยไม่มีตัวแทนทันที หลัง Retire จะเริ่มเคสใหม่ไม่ได้จนกว่าจะมี PUBLISHED version ใหม่

## สิ่งที่ Governance ไม่ได้ทำ
- ไม่อนุมัติ clinical appropriateness แทนสัตวแพทย์
- ไม่เลือก dose อัตโนมัติ
- ไม่แก้ dose จาก reference อัตโนมัติ
- reviewer/publisher ยังไม่ใช่ authenticated electronic signature
- ยังไม่ sync protocol ระหว่างหลายเครื่อง
