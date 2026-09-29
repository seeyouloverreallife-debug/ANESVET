# Known limitations — V16.15.0

1. Pain score เป็น documentation field เท่านั้น ระบบไม่ validate range ตาม pain scale เพราะแต่ละ scale มีระบบคะแนนและเงื่อนไขต่างกัน
2. O₂ support trend นับจากค่าที่ถูกบันทึกใน Recovery records; การเปลี่ยน support ระหว่างสอง record ที่ไม่ได้กดบันทึกจะไม่ปรากฏ
3. Temperature trend ใช้ first/latest documented Recovery temperature และไม่ตีความทางคลินิกอัตโนมัติ
4. Post-anesthetic medication review พึ่ง frozen Case Drug Plan; ยาที่ไม่ได้อยู่ใน plan ยังปรากฏใน Full reconciliation ในฐานะ other actual administration
5. Transfer snapshot เป็น documentation aid ไม่ใช่ discharge authorization และไม่เพิ่ม hard block ก่อน Recovery complete
6. Interactive Chromium smoke test ใน environment นี้ยังไม่สำเร็จ: headless Chromium ค้างระหว่างเปิด app และถูก timeout; static/unit QA ผ่าน จึงควรทำ Android PWA real-device smoke ก่อน production
