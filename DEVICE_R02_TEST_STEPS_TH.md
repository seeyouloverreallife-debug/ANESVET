# วิธีทดสอบ ANESVET R02 บน Android / iPad

**ทดสอบบนเครื่องสำรองหรือเคสทดสอบเท่านั้นก่อนใช้จริง**

1. อัปโหลดไฟล์ *ภายใน* โฟลเดอร์ `ANESVET_V17_2_6_R02_MOBILE_BOOT_DIAGNOSTIC` ไปยัง root ของ GitHub Pages repository (ให้ `index.html` อยู่ที่ root ของเว็บไซต์) อัปโหลดทั้งชุด ไม่ใช่เฉพาะ `index.html`.
2. เปิด URL ของแอป; ตรวจหัวแอปเป็น **V17.2.6**. ถ้ายังเป็น V17.2.5 แปลว่ายังใช้รุ่นเก่าหรือยังไม่อัปเดตสำเร็จ.
3. บนอุปกรณ์ที่ไม่มี active case: เปิด Patient Setup, กด ASA I และ ASA II, ตรวจว่ามี `selected` และค่าตรงกับที่เลือก.
4. ลองกด Patient → Pre-check → Medications, รวมทั้งปุ่มทั่วไปในหน้าทดสอบ.
5. ถ้าปุ่มไม่ตอบสนองหรือหน้าไม่เริ่มทำงาน ภายในช่วง boot อาจขึ้น Diagnostic panel เอง หรือกดปุ่ม **🔎** บนแถบด้านบน.
6. กด **Tap test** 2 ครั้ง แล้ว **คัดลอก Diagnostic** หรือถ่ายภาพแผงให้เห็น `reason`, `stage`, `ready`, `error`, `ASA probe`, `interaction hint`, `session`, `dialogs`, `pointer`, `click`, `globals`.
7. ส่งข้อความ Diagnostic พร้อมระบุ Android/iPad รุ่น, browser หรือ PWA, และว่าเกิดก่อนหรือหลังสร้างเคส.

**ห้าม** Clear App Data, Reset Case, Clear Site Data หรือ Uninstall PWA บนอุปกรณ์ที่มี active case ค้างอยู่. หาก `VIEW ONLY` อย่ากด Take Control โดยไม่ตรวจว่ามีอีกเครื่อง/แท็บบันทึกเคสอยู่จริงหรือไม่.

ข้อมูล Diagnostic อาจมี URL/device information หรือข้อความ runtime error; โปรดตรวจสอบก่อนเผยแพร่ต่อบุคคลอื่น.
