# ANESVET V6

## ใหม่จาก V5

### 1. Patient เป็นหน้าแรกแยกออกมา
หน้าแรกบันทึกเฉพาะข้อมูลผู้ป่วย:
- ชื่อสัตว์
- HN / Case ID
- Species
- Breed / พันธุ์
- Age
- Body weight
- BCS 1–9
- Emergency modifier
- ASA Physical Status

มีปุ่ม **บันทึกข้อมูลผู้ป่วยและไป Dashboard**

### 2. ASA guide ในตัวแอป
- ASA I — normal healthy patient
- ASA II — mild systemic disease / well-controlled condition
- ASA III — severe systemic disease with reduced physiologic reserve
- ASA IV — severe systemic disease that is a constant threat to life
- ASA V — moribund patient unlikely to survive without intervention
- E — Emergency modifier

คำอธิบายเป็น quick guide และยังต้องใช้ clinical judgment ของสัตวแพทย์

### 3. Case setup ย้ายไป Dashboard
Procedure / Surgeon / Anesthetist แยกจาก Patient information ชัดเจน

### 4. Export PDF Report
ปุ่ม **Export PDF Report** จะสร้าง printable clinical report ที่ประกอบด้วย:
- Patient information
- ASA / BCS
- Case information
- Case summary
- Anesthesia record table
- Trend graphs
- Drugs & clinical events
- Recovery information

บน Chrome / Android:
1. กด Export PDF
2. ระบบเปิด Print dialog
3. เลือก **Save as PDF**

วิธีนี้ใช้ browser PDF engine ทำให้ภาษาไทยและกราฟคมกว่า client-side PDF library และยังทำงานแบบ offline ได้

### 5. Migration
V6 จะพยายามนำ current case จาก V5 มาใช้ต่ออัตโนมัติ
ข้อมูลใหม่ Breed และ BCS สามารถเติมในหน้า Patient ได้ภายหลัง

## Updating GitHub Pages
Upload V6 files ทับไฟล์เดิมทั้งหมดใน root ของ repo ANESVET แล้ว Commit
ถ้ายังเห็น V5 ให้เปิด Pages URL ด้วย `?v=6` หรือ Clear site data หนึ่งครั้ง
