# คู่มือ Case Review — ANESVET V16.22.0

## จุดประสงค์
Case Review & Quality Dashboard ใช้สำหรับดู “รูปแบบของข้อมูลที่บันทึกไว้” จาก archived anesthesia cases หลายเคสพร้อมกัน เพื่อช่วยเลือกเคสที่ควรกลับไปทบทวนและดูความสม่ำเสมอของ documentation

ระบบนี้ **ไม่ได้ให้คะแนนสัตวแพทย์**, ไม่ตัดสินว่าการรักษาดีหรือไม่ดี และไม่สรุปว่า intervention ใดเป็นสาเหตุของผลลัพธ์

## Dataset ที่แนะนำ
สำหรับการทบทวนตามปกติให้ใช้ **Final locked records** ซึ่งเป็นค่าเริ่มต้น เพราะเป็นข้อมูลที่จบ workflow และถูก Final Lock แล้ว

ตัวเลือก Working copies / All archived เหมาะกับการตรวจปัญหา documentation หรือ workflow แต่ไม่ควรตีความเป็น final-case statistics

## สิ่งที่ดูได้
- จำนวนเคสในช่วงเวลา
- median ของเวลาที่ระบบบันทึกว่าเคสดำเนินอยู่
- median Recovery duration
- physiologic alert episodes ที่ถูกบันทึก
- structured complication ที่ถูกบันทึก
- Problem → Intervention → Response documentation
- structured documentation domains
- protocol version ที่ถูก freeze ในแต่ละเคส
- Recovery completion override ที่มีการบันทึกเหตุผล

## การตีความ Alert
คำว่า “MAP / hypotension alert” ใน dashboard หมายถึง **documented alert episode ใน ANESVET** ตามข้อมูลและ threshold ที่ใช้ในเคสนั้น ไม่ได้หมายความว่า dashboard ได้วินิจฉัย hypotension เพิ่มเติมย้อนหลัง

จำนวน episode จึงอาจได้รับผลจาก:
- ระยะเวลาวางยา
- ความถี่ในการบันทึก vital
- hospital/case threshold
- case mix
- การใช้งาน ANESVET ในแต่ละช่วงเวลา

## Documentation completeness
Dashboard ใช้ domain ที่สอดคล้องกับ Documentation Guardian ได้แก่ Airway, Monitoring, Medications, Problems, Recovery และ Final Sign-off

ตัวเลขนี้แปลว่า “มี structured documentation ที่ระบบตรวจพบหรือไม่” ไม่ได้แปลว่า care นั้นถูกหรือผิด และ missing documentation ไม่เท่ากับไม่ได้ทำสิ่งนั้นจริง

## Export CSV
ปุ่ม **Export review CSV** ส่งออกเฉพาะข้อมูลจาก filter ปัจจุบันเพื่อทำ review ภายนอกได้ ไฟล์นี้ไม่ใช่ส่วนหนึ่งของ Final Lock checksum และไม่ใช่ signed audit record
