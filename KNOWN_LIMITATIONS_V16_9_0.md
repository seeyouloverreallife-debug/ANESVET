# Known limitations — V16.9.0

1. Procedure Templates เป็น preset สำหรับ documentation เท่านั้น ยังไม่มี hospital-defined custom template editor
2. Template inference จาก procedure text ใช้ alias matching แบบ local deterministic ไม่ใช่ AI/NLP
3. Routine templates หลายชนิดใช้ core anesthesia milestones เดียวกัน จุดต่างหลักในรุ่นนี้คือ quick setup + context labeling
4. C-section และ Emergency มี specialized OR context จาก workflow ที่มีอยู่เดิม; Dental/Orthopedic ยังไม่เพิ่ม mandatory procedure-specific milestones
5. Build environment ไม่อนุญาต direct navigation ไป `localhost/file://`; จึงทดสอบ browser smoke โดย inject HTML/CSS/JS ลง Chromium ที่ viewport 390×844 แทน ผลผ่านสำหรับ template selection และ mobile dock geometry แต่ยังควรทดสอบ installed PWA บนอุปกรณ์จริงก่อนใช้งาน production
