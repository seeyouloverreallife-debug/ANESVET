# Vet Anesthesia Monitor — PWA V1

แอป decision-support สำหรับสัตวแพทย์ในการ quick-check ค่าระหว่าง general anesthesia ในสุนัขและแมว

## ฟีเจอร์
- Patient setup: ชื่อ, species, BW, ASA, Emergency
- Monitor: MAP, SpO2, ETCO2, Temp, HR, RR
- Automatic status: Stable / Reassess / Intervene
- Fluid reference + cumulative fluid warning
- Algorithms: hypotension, hypercapnia, hypoxemia, bradycardia, hypothermia
- Anesthesia timer + event markers
- Recovery checklist
- Export case เป็น JSON
- Print / Save PDF ผ่าน browser
- PWA: ติดตั้งบน Android / desktop และใช้ offline หลังโหลดครั้งแรก

## วิธีทดสอบบนคอม
PWA / service worker ต้องรันผ่าน HTTP/HTTPS ไม่ควรเปิด index.html แบบ file://

### วิธีง่ายด้วย Python
เปิด Terminal/Command Prompt ในโฟลเดอร์นี้แล้วรัน:

    python -m http.server 8080

จากนั้นเปิด:
    http://localhost:8080

## วิธีเอาขึ้นออนไลน์
ตัวเลือกง่าย:
1. GitHub Pages
2. Netlify
3. Cloudflare Pages
4. Vercel (static site)

อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น root ของ static hosting

## ติดตั้งบน Android
1. เปิด URL ด้วย Chrome
2. เมนู ⋮
3. เลือก Install app / Add to Home screen
4. หลังเปิดครั้งแรกออนไลน์ แอปจะ cache ไฟล์ไว้ใช้ offline ได้

## หมายเหตุทางคลินิก
แอปนี้เป็น decision-support ไม่ใช่เครื่อง monitor จริง ไม่แทนการตรวจผู้ป่วย การประเมิน waveform, pulse, perfusion, anesthetic depth และ clinical judgment

Thresholds ใน V1 มาจากคู่มือที่จัดทำก่อนหน้า โดยใช้หลักจาก:
- 2020 AAHA Anesthesia and Monitoring Guidelines for Dogs and Cats
- 2024 AAHA Fluid Therapy Guidelines for Dogs and Cats
- Small Animal Surgery, 5th ed.
- BSAVA Small Animal Formulary, 10th ed.
- Small Animal Fluid Therapy
- Plumb's Veterinary Drug Handbook, 10th ed.

ก่อนใช้จริงในโรงพยาบาล ควรให้ทีมกำหนด alarm targets และ SOP เฉพาะของโรงพยาบาลอีกครั้ง
