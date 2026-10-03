# ANESVET V17.14.1 — OR LIVE Focused Medication Queue

ฐานงาน: V17.14.0

## เป้าหมาย
ลดสิ่งรบกวนใน OR LIVE โดยไม่เปลี่ยน clinical workflow หรือ medication semantics

## เปลี่ยนแปลงหลัก
Medication queue เดิมเปิดเต็มตลอดเมื่อเคสเริ่มและมี planned medication แม้ current phase clear แล้ว

V17.14.1 เปลี่ยนเป็น:
- `NEEDS REVIEW` → เปิดเต็มอัตโนมัติ
- Current phase clear → auto-compact
- compact summary ยังเห็นจำนวน `LATER` / plan documented
- `View plan` / `Hide plan` สำหรับเปิดดูเต็มเมื่อต้องการ
- `Record next planned` แสดงเมื่อมีรายการต้อง review เท่านั้น

## ไม่เปลี่ยน
- dose calculation / concentration
- Actual administration record semantics
- frozen Case Drug Plan
- Induction Given / details pending
- editable induction administration time
- Intubation timestamp-only
- End Surgery confirmation/mutation
- Emergency Return
- Recovery readiness/completion
- Final Lock / archive verification

## QA
- Dedicated focused medication queue QA รวม deterministic runtime simulation
- Existing workflow / E2E / OR interaction / architecture suites ต้องผ่านทั้งหมดก่อน package
- physical mobile/PWA interaction validation ยังอยู่นอก scope ของ environment นี้
