# Known Limitations — ANESVET V16.12.0

## Documentation Guardian
1. Guardian เห็นเฉพาะข้อมูลที่ถูกบันทึกใน ANESVET จึงไม่สามารถทราบได้ว่าการ monitor, ให้ยา หรือ intervention เกิดขึ้นจริงนอกแอปหรือไม่
2. Planned medication ที่ขึ้น `needs review` หมายถึง **ไม่พบ matching actual administration record** ไม่ได้หมายถึงไม่ได้ให้ยา
3. Airway reminder ถูกออกแบบให้ conservative: จะเตือน structured airway details เมื่อมี `Intubation` timestamp เพื่อลด false positive ในเคสที่ไม่ได้ใส่ท่อ
4. Vitals overdue ใช้ monitoring interval ที่ตั้งไว้เป็น documentation interval ไม่ใช่คำแนะนำว่าความถี่ทางสรีรวิทยาที่เหมาะสมสำหรับผู้ป่วยทุกตัวเท่ากัน
5. End Case completeness เป็น record-review aid; final clinical/legal completeness ยังขึ้นกับบริบทของโรงพยาบาลและ record requirements ที่ใช้งานจริง
6. Guardian ไม่แทน source monitor, clinical observation หรือ clinical judgment

## UI / device
- ควรทดสอบ installed Android PWA จริง โดยเฉพาะ soft keyboard, long OR session, task switching, offline/reload และ Recovery transition
- Browser smoke ใน build environment ใช้ injected runtime เนื่องจาก environment จำกัด direct localhost/file navigation

## Data model
- ไม่มี schema migration ใน V16.12.0
- Guardian ไม่ persist state ใหม่ของตัวเอง; ทุก reminder derive จาก case state ปัจจุบัน
