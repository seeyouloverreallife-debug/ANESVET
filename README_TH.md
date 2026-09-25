# ANESVET V15.18.0 — End Case & Report Flow

ต่อยอดจาก V15.17.0 โดยทำให้ workflow ต่อเนื่องจนถึงขั้นปิดเคส โดยไม่เพิ่ม clinical calculation ใหม่

## จุดใหม่
- หน้า End Case มี **Finalization Guide** บอกสิ่งที่ยังค้างและพาไปยังรายการถัดไป
- มี **Focus pending** สำหรับซ่อนรายการที่ตรวจแล้วชั่วคราว
- Report section แยกชัดและมีปุ่ม Export ตามค่า Default Report ใน Settings
- หลัง `End, Lock & Archive` ระบบจะ **ไม่ล้างเคสทันที** อีกต่อไป
- หลัง Lock สามารถ Export report, เปิด Archive, อยู่ review record ต่อ หรือเริ่ม New Case ได้
- Safety gate เดิมของ Recovery / Alerts / Complications / Sign-off / Final checklist ยังคงเหมือนเดิม

## การอัปเดตบน GitHub Pages / PWA
หลังแทนไฟล์รุ่นเดิม แนะนำเปิดครั้งแรกด้วย `?v=15.18.0` หรือ Hard Refresh หนึ่งครั้ง เพื่อเปลี่ยน service-worker cache

## หมายเหตุ
ANESVET เป็น workflow/documentation aid สำหรับทีมสัตวแพทย์ ไม่แทน clinical judgment, monitor source data หรือ hospital protocol
