# ANESVET V17.14.8 — Vent / Planned Medication Fix

แก้ต่อจาก ZIP `ANESVET-V17.14.6-PHYSICAL-PILOT-UX-FIX-II.zip` ที่ผู้ใช้แนบมา ใช้เลข V17.14.8 เพื่อหลีกเลี่ยงเลข V17.14.7 ที่ปรากฏในงานก่อนหน้า ชุดนี้ไม่ได้ดึงหรือรวมโค้ด V17.14.7 จาก GitHub และยังไม่ได้เผยแพร่ขึ้นเว็บไซต์

## สิ่งที่แก้

- ปุ่ม Vent ผูกการกดได้จริง: ค้นหาช่องโหมดจาก panel ที่กำลังสร้าง แทนค้นหาจาก document หลังช่องถูกย้ายออกไปแล้ว
- Mechanical / Manual PPV เปิดช่อง RR, PIP, PEEP และ VT พร้อมโฟกัส RR; Spontaneous ซ่อนช่อง และการสลับโหมดคงค่าที่กรอกไว้
- OR Medication Queue แสดงยาตาม Frozen Case Drug Plan ที่ยังไม่ได้บันทึกทุกตัว รวมยาของช่วงหลัง เช่น Meloxicam เมื่อเลือกไว้ในแผน
- หน้ามือถือไม่ครอบคิวด้วย details ที่ปิดอยู่อีกชั้น; ใช้การพับของ OR controller โดยตรง
- คงป้ายช่วงเวลาที่วางแผนไว้ และปุ่ม Record เปิดยาเป้าหมายให้ตรวจข้อมูลก่อนบันทึก ไม่บันทึกว่าให้ยาไปแล้วจากการเปิดรายการ
- ยาของช่วงหลังไม่ถูกเพิ่มเป็น auto-next และยาฉุกเฉิน/standby ยังคงต้องเลือกใช้เอง
- CSS ของ medication workspace เคารพสถานะ hidden เพื่อไม่แสดงคิวเก่าในเคสที่ไม่มีแผนหรือถูกล็อก
- เปลี่ยนเวอร์ชันและ Service Worker cache เป็น 17.14.8

## การทดสอบ

มี browser regression ที่ใช้ HTML/CSS, workspace builder และ OR controller ของจริง ครอบคลุมการแตะที่ความกว้าง 390 และ 1024 พิกเซล รวมการเปิดโปรแกรมเต็ม บันทึกค่า Vent โหลดหน้าใหม่ และเปิด editor ยาตามแผนจริง

ผลรวมและรายละเอียดอยู่ที่ `qa/current/QA_V17_14_8_RESULTS.txt` ชุดทดสอบ V17.14.6 เดิมเก็บไว้ใน `qa/archive/V17.14.6/`; current QA ปรับเงื่อนไขการพับคิวให้ตรงพฤติกรรมใหม่

ไม่ได้เปลี่ยนสูตร dose, concentration rules, clinical thresholds, persistence schema, Recovery assessment, Emergency Return หรือ Final Lock การทดสอบในเบราว์เซอร์ยังไม่ใช่การยืนยันผลบนมือถือเครื่องเดิมของผู้ใช้
