# ANESVET V17.5.4 — หน้าเปิด Figma ตั้งแต่เริ่มโหลด

ปรับต่อจาก V17.5.3 เมื่อผู้ใช้ยังเห็นหน้าขาวพร้อมโลโก้ก่อนหน้าเปิดใหม่ เน้นมือถือและเก็บการทำงานทางคลินิกเดิม

## สิ่งที่ตรวจพบและสิ่งที่แก้

| ช่วงเปิดแอป | หลักฐาน | การแก้ |
|---|---|---|
| Android/Chrome เปิดแอปจากไอคอน | หน้าเปิดของระบบเกิดก่อน HTML/CSS และใช้ข้อมูลจาก manifest; ภาพที่ผู้ใช้บรรยายยังไม่ได้ตรวจบนเครื่องจริง | คงสีพื้น/แถบระบบ #0b2d31, คง URL manifest และ start_url ของ V17.5.3 เพื่อรักษา identity ปัจจุบัน, ใช้ URL ไอคอนที่มีรุ่นใหม่โดยไม่เปลี่ยนภาพ |
| การอัปเดตข้อมูลแอปที่ติดตั้ง | service worker เดิมใช้ cache-first กับ manifest ซึ่งอาจส่งสำเนาเก่ากลับให้การตรวจอัปเดต | เปลี่ยนเฉพาะ manifest เป็น network-first/no-store; offline หรือ HTTP failure ใช้สำเนาสำเร็จล่าสุดและไม่ทับด้วย error |
| เว็บรอไฟล์รูปแบบหน้าจอ | ทดลองกัก CSS ทั้ง 38 ไฟล์ใน V17.5.3 แล้วไม่มี first-contentful-paint | ฝัง CSS หน้าเปิดเดิมและฟอนต์ไทยไว้ใน HTML; โหลด CSS ภายนอกแบบไม่กั้น first paint |
| ตารางเก่าที่ซ่อนอยู่ | การซ่อนด้วย visibility อย่างเดียวทำให้ตารางขยาย viewport ก่อน CSS ครบ | ซ่อน main จาก layout เฉพาะช่วง boot; ตรวจ first paint ที่ 360/393px และป้องกันการทดสอบผ่านด้วย innerWidth ที่ขยายผิด |
| ระบบพร้อมแต่หน้าจอยังโหลดไม่ครบ | การโหลด CSS แยกจาก runtime อาจทำให้เปิดฟอร์มก่อนหน้าจอครบ | ต้องผ่านทั้ง native data-readiness และ CSS ครบทุกไฟล์; เมื่อ CSS ล้มเหลว/เกิน 12 วินาทีแสดง Retry และไม่เปิดฟอร์มที่ไม่พร้อม |

หน้าเว็บยังใช้แบบ Figma 49:2771 และ assets/startup/ เดิมทุกชิ้น ไม่ใช้ screenshot เป็นภาพหน้าเปิด และไม่แก้ภาพโลโก้ ข้อมูลยา สูตรคำนวณ เกณฑ์แจ้งเตือน storage keys และ clinical controllers คงเดิม

## การทดสอบ

| ชุด | ผล |
|---|---|
| Mobile workflow, native record/medications, recovery, worker promotion | 19/19 |
| Clinical knowledge, ECG, source links, responsive/offline | 36/36 |
| PWA checkpoint and update safeguards | 14/14 |
| Startup, actual home/resume, read failure, offline, observer regression | 9/9 |
| Focused input, simulated visualViewport, End Surgery/C-section/locked case | 16/16 |
| First paint before CSS, failed/slow CSS, retry, online/offline manifest, icons | 14/14 |
| รวม | **108/108** |

ตรวจ JS syntax ครบ, original HTML IDs ไม่หาย/ไม่ซ้ำ, precache 151 รายการมีไฟล์ครบ และตรวจ byte-identical 13 clinical/storage modules กับ V17.5.3

ข้อจำกัด: ทดสอบ Chromium จำลองมือถือ ไม่ได้ทดสอบ native Android launcher/WebAPK หรือแป้นพิมพ์เครื่องจริง หน้าเปิด native ยังคงเป็นโลโก้ที่ Android สร้างก่อนหน้าเว็บเริ่ม และไม่สามารถแทนทั้งภาพด้วยหน้า Figma ที่มีข้อความ/ECG ได้ด้วย HTML การแก้สีใน manifest ต้องรอ Chrome อัปเดตข้อมูลแอปที่ติดตั้ง ซึ่งผู้พัฒนาไม่สามารถบังคับทันทีจากหน้าเว็บ

## สถานะและวิธีนำขึ้น

วันที่ตรวจ 2 ตุลาคม 2026 GitHub main มี V17.5.3 แล้ว ไม่ใช่ V17.5.1 ที่เคยตรวจในรอบก่อน ส่วน **V17.5.4 ยังไม่ได้เผยแพร่** การทดลองเขียนครั้งนี้ถูก GitHub ตอบ 403 Resource not accessible by integration และไม่มีการเปลี่ยน remote branch

1. แตก Full-Source ZIP และอัปโหลดทับที่ราก repository ANESVET ให้ index.html และ assets/ อยู่ถูกตำแหน่ง หรือใช้ Startup-Patch ZIP ซึ่งมีเฉพาะ 6 ไฟล์ที่เปลี่ยนเมื่อฐานเป็น V17.5.3 เท่านั้น
2. หลัง GitHub Pages เผยแพร่ครบ เปิด URL เดิมและรับการอัปเดตด้วยปุ่ม Update now ของแอป ระบบ checkpoint เดิมยังทำงานก่อนการ promote worker/reload
3. ตรวจหัวโปรแกรม V17.5.4 และลองเปิดจากเว็บก่อน หน้า Figma ต้องแสดงระหว่างรอ runtime/CSS
4. สำหรับไอคอนแอปที่ติดตั้งบน Android ให้เปิดออนไลน์หนึ่งครั้ง จากนั้นเมื่อจบใช้งานให้ปิดแอปตามปกติและเชื่อม Wi-Fi เพื่อให้ Chrome อัปเดตข้อมูลแอปตามรอบของมัน การอัปเดต native อาจไม่ทันที
5. ไม่ต้องล้างข้อมูลเว็บหรือถอนแอปเพื่อรับชุดแก้ เพราะข้อมูลเคสเก็บในเครื่อง

## การทดสอบซ้ำ

ติดตั้ง Node.js, Playwright และ Chromium ตั้ง ANESVET_CHROMIUM_EXECUTABLE ให้ชี้ browser ของเครื่อง แล้วรัน QA_V17_5_4_*.js ที่เป็นชุดทั้ง 6 ชุด

สำหรับ QA_V17_5_4_SPLASH.js ให้แตก Full-Source V17.5.3 ไว้เป็น baseline และตั้ง ANESVET_BASELINE_DIR เป็น absolute directory ของ baseline การเทียบช่วงก่อนแก้ต้องใช้รุ่นเดิมจริง

## แหล่งข้อมูลเกี่ยวกับ Android splash

- https://web.dev/learn/pwa/web-app-manifest (Android generates splash from theme_color/background_color/icon)
- https://web.dev/articles/manifest-updates (stable manifest URL and browser-controlled update cycle)
- https://developer.chrome.com/docs/lighthouse/pwa/splash-screen (native splash configuration; Lighthouse PWA audit is deprecated)
