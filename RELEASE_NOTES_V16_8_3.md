# ANESVET V16.8.3 — Mobile Dock Hotfix

## Fixed
- แก้ OR LIVE bottom action dock บนมือถือที่เลื่อนไปทางซ้ายและทำให้ปุ่มหลักถูกตัดออกนอกจอ
- แก้ Recovery bottom dock ด้วย rule เดียวกัน เพื่อป้องกันอาการเดียวกันในหน้า Recovery
- สาเหตุคือ CSS layer `clinical-calm.css` เปลี่ยน `left/right` เป็น edge inset แต่ยังคง `transform: translateX(-50%)` และ fixed width จาก `style.css`
- Hotfix reset `transform`, `width`, `max-width` และกำหนด `box-sizing:border-box` เมื่อใช้ left/right inset

## Compatibility
- ไม่เปลี่ยน state schema
- ไม่เปลี่ยน IndexedDB schema/version
- ไม่เปลี่ยน storage keys
- ไม่เปลี่ยน drug calculation / alert thresholds / workflow logic
- ไม่ต้อง migrate ข้อมูลจาก V16.8.2

## Next recommended release
V16.9 ควรเน้น Procedure Templates และ phase-aware medication queue semantics หลังจากผ่าน mobile acceptance test ของ V16.8.3
