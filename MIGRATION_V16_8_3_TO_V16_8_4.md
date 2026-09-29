# Migration V16.8.3 → V16.8.4

ไม่ต้อง migrate ข้อมูล

V16.8.4 เปลี่ยนเฉพาะการจัดกลุ่ม/แสดงผล Frozen Case Drug Plan ใน OR LIVE และข้อความ workflow guidance

- Existing `protocolSnapshot.caseDrugPlan` ใช้ต่อได้
- Existing `drugAdministrations` ใช้ต่อได้
- Existing cases / archive / settings / patient master ไม่เปลี่ยน schema
- Service worker cache bump เป็น V16.8.4 เพื่อให้ mobile CSS/JS ใหม่ถูกโหลด
