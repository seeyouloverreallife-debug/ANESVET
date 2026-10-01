(function(root){
"use strict";
const data={
  "version": "17.4.0",
  "contentVersion": "2026-10-01.1",
  "reviewStatus": "Source-checked editorial education; no independent clinical signoff",
  "sources": {
    "BSAVA": {
      "title": "BSAVA Small Animal Formulary, Part A, 10th edition",
      "kind": "project textbook",
      "filename": "02-BSAVA-Small-Animal-Formulary-Part-A-Canine-and-Feline-10th-Edition-VetBooks.ir-.pdf",
      "sha256": "8353d05edeca67d4de6dcc73532d67fa618db17775fcc06e88ddfa2fdfedd896",
      "pageConvention": "1-indexed PDF file page; printed page is separately stated in locator",
      "accessed": "2026-10-01"
    },
    "ECC": {
      "title": "Advanced Monitoring and Procedures for Small Animal Emergency and Critical Care, 2nd edition",
      "kind": "project textbook",
      "filename": "15-Advanced-Monitoring-and-Procedures-for-Small-Animal-Emergency-and-Critical-Care-2nd-Edition-VetBooks.ir-.pdf",
      "sha256": "8368edc037473138b42b2c40911012378e6b962c1ad035a40a50010cca6e3d22",
      "pageConvention": "1-indexed PDF file page; printed page is separately stated in locator",
      "accessed": "2026-10-01"
    },
    "TECH": {
      "title": "Anesthesia and Analgesia for Veterinary Technicians and Nurses, 6th edition",
      "kind": "project textbook",
      "filename": "17-Anesthesia-and-Analgesia-for-Veterinary-Technicians-and-Nurses-6th-Edition-VetBooks.ir-.pdf",
      "sha256": "3694f9b66887306f7599236b8a4dac5efae5f5f1698a5c55e69dafef66665ccd",
      "pageConvention": "1-indexed PDF file page; printed page is separately stated in locator",
      "accessed": "2026-10-01"
    },
    "FUND": {
      "title": "Fundamental Principles of Veterinary Anesthesia",
      "kind": "project textbook",
      "filename": "18-Fundamental-Principles-of-Veterinary-Anesthesia-VetBooks.ir-.pdf",
      "sha256": "b0cfea66901a7b2c8b616436b47c386b8dbd92dbb7fdc60155778dd5c2a6fd1a",
      "pageConvention": "1-indexed PDF file page; printed page is separately stated in locator",
      "accessed": "2026-10-01"
    },
    "ECG": {
      "title": "Interpretation of the Electrocardiogram in Small Animals",
      "kind": "project textbook",
      "filename": "19-Interpretation-of-the-Electrocardiogram-in-Small-Animals-VetBooks.ir-.pdf",
      "sha256": "451adb5f50844c6240ad597d7bfdd7a2f67ec6b86c35410149eef2ef92e82331",
      "pageConvention": "1-indexed PDF file page; printed page is separately stated in locator",
      "accessed": "2026-10-01"
    },
    "AAHA20": {
      "title": "2020 AAHA Anesthesia and Monitoring Guidelines",
      "url": "https://www.aaha.org/resources/2020-aaha-anesthesia-and-monitoring-guidelines-for-dogs-and-cats/",
      "kind": "guideline",
      "accessed": "2026-10-01"
    },
    "AAHA24": {
      "title": "2024 AAHA Fluid Therapy Guidelines — Section 4",
      "url": "https://www.aaha.org/resources/2024-aaha-fluid-therapy-guidelines-for-dogs-and-cats/section-4-fluid-therapy-and-anesthesia/",
      "kind": "guideline",
      "accessed": "2026-10-01"
    },
    "ACVAA25": {
      "title": "ACVAA Small Animal Anesthesia and Sedation Monitoring Guidelines 2025",
      "url": "https://doi.org/10.1016/j.vaa.2025.03.015",
      "kind": "guideline",
      "accessed": "2026-10-01"
    },
    "RECOVER24": {
      "title": "2024 RECOVER Guidelines: Updated treatment recommendations for CPR in dogs and cats",
      "url": "https://doi.org/10.1111/vec.13391",
      "kind": "guideline",
      "accessed": "2026-10-01"
    },
    "RECOVER26": {
      "title": "2026 RECOVER First Aid: Acute Allergy and Anaphylaxis in Dogs and Cats",
      "url": "https://doi.org/10.1111/vec.70137",
      "kind": "guideline",
      "accessed": "2026-10-01"
    },
    "RVC25": {
      "title": "Hjalmarsson et al. 2025: Anesthetic complications in dogs undergoing pulmonic balloon valvuloplasty",
      "url": "https://doi.org/10.3389/fvets.2025.1595738",
      "kind": "retrospective study",
      "accessed": "2026-10-01"
    }
  },
  "fieldLabels": {
    "class": "Class",
    "mechanism": "Mechanism",
    "indications": "Indications",
    "clinicalRole": "Clinical role",
    "cautions": "Contraindications / Cautions",
    "cardiovascular": "Cardiovascular effects",
    "respiratory": "Respiratory effects",
    "adverse": "Adverse effects",
    "interactions": "Drug interactions",
    "onsetDuration": "Onset / Duration",
    "dogCat": "Dog / Cat notes",
    "reversal": "Reversal / Antagonist",
    "monitoring": "Monitoring"
  },
  "drugs": [
    {
      "id": "propofol",
      "name": "Propofol",
      "group": "Induction",
      "aliases": [
        "propofol",
        "Propofol",
        "PropoFlo",
        "Rapinovet"
      ],
      "fields": {
        "class": {
          "text": "Alkylphenol hypnotic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "เสริม inhibitory signaling ที่ GABA-A",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Induction; IV maintenance ใน protocol ที่เหมาะสม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "ทำให้หมดสติอย่างรวดเร็ว แต่ไม่มี surgical analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง hypovolemia และ cardiopulmonary reserve ต่ำ; ตรวจชนิด preservative และฉลากก่อนใช้ infusion",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Vasodilation และ myocardial depression → ความดันลด",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Dose-dependent hypoventilation / apnea; เตรียม airway และ assisted ventilation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Apnea, hypotension, myoclonus; lipid emulsion เสี่ยงปนเปื้อน",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Premedication/opioid/benzodiazepine ลดความต้องการยา แต่เพิ่มผลกด CNS",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV onset เร็ว; bolus ออกฤทธิ์สั้นระดับนาที; ขึ้นกับยาอื่นและปริมาณสะสม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "แมวฟื้นช้ากว่าสุนัขบางกรณี; repeated exposure อาจสัมพันธ์กับ Heinz bodies",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist; airway/ventilation และ supportive care",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "ติดตาม ventilation, ETCO₂, BP, SpO₂ และระดับสลบหลังฉีด รวมถึง delayed apnea",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Propofol monograph, PDF pp. 362–364 (printed pp. 346 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–143"
        }
      ]
    },
    {
      "id": "alfaxalone",
      "name": "Alfaxalone",
      "group": "Induction",
      "aliases": [
        "alfaxalone",
        "Alfaxalone",
        "Alfaxan"
      ],
      "fields": {
        "class": {
          "text": "Neuroactive steroid",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "GABA-A mediated CNS depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Induction; maintenance; sedation บางวิธีตามฉลาก/การทบทวน",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Hypnosis; ต้องเสริม analgesia สำหรับหัตถการเจ็บ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวังการฉีดเร็ว/การให้ร่วม CNS depressants; ตรวจ formulation และ shelf life",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "ความดันลดตามขนาดยา; อาจเกิด compensatory tachycardia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Hypoventilation และ apnea โดยเฉพาะร่วม sedative/opioid",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Paddling, excitation หรือไวต่อสิ่งเร้าใน recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Premedication ลดความต้องการยาและเพิ่ม cardiopulmonary depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV onset เร็ว; redistribution และ hepatic metabolism ทำให้ระยะสั้น; IM onset ช้ากว่า",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "ใช้ใน dog/cat; แมวอาจมี recumbency นานกว่า; ข้อมูลไม่ใช้แทนการ titrate",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Airway, ventilation, BP, SpO₂, depth และพฤติกรรม recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Alfaxalone monograph, PDF pp. 25–26 (printed pp. 9 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
        }
      ]
    },
    {
      "id": "etomidate",
      "name": "Etomidate",
      "group": "Induction",
      "aliases": [
        "etomidate",
        "Etomidate"
      ],
      "fields": {
        "class": {
          "text": "Imidazole hypnotic",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "GABA-A modulation",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Induction เมื่อ cardiovascular compromise เป็นข้อกังวลสำคัญ",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "คง cardiovascular function ค่อนข้างดี; ไม่มี analgesia",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ยับยั้ง cortisol synthesis; ต้องทบทวนความเหมาะสมใน sepsis/adrenal compromise",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "ผลกด HR/BP โดยทั่วไปน้อยกว่ายา hypnotic หลายชนิด",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Respiratory depression ยังเป็นไปได้; ไม่ยกเว้นการเตรียม airway",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Myoclonus, vomiting, injection pain; propylene glycol formulation อาจเกิด hemolysis",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Benzodiazepine co-induction อาจช่วยลด myoclonus/เพิ่ม muscle relaxation",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV induction onset เร็ว/ระยะสั้น; adrenal suppression ยาวกว่าระยะ hypnosis",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "ใช้ได้ใน dog/cat ที่คัดเลือก; opisthotonos อาจพบในแมวช่วงฟื้น",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "BP/ECG, ventilation, induction movement และ adrenal risk",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 141–144"
        }
      ]
    },
    {
      "id": "ketamine",
      "name": "Ketamine",
      "group": "Induction",
      "aliases": [
        "ketamine",
        "Ketamine",
        "Ketaset"
      ],
      "fields": {
        "class": {
          "text": "Dissociative anesthetic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "NMDA receptor antagonism",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Chemical restraint; induction combination; adjunct analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "ลด central sensitization; analgesia อย่างเดียวไม่เพียงพอทุก surgery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง hypertrophic/restrictive cardiac disease, sympathetic reserve ต่ำ และ renal dysfunction",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "มักเพิ่ม sympathetic tone/HR/BP; myocardial depression อาจปรากฏเมื่อ catecholamine depleted",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Apneustic breathing/hypoventilation; retained swallowing ไม่รับประกัน airway protection",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Muscle rigidity, salivation, dysphoric/prolonged recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Benzodiazepine ลด muscle hypertonicity; sedative/opioid เพิ่มผลรวม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV onset ประมาณหนึ่งนาที; duration ขึ้นกับ route/combination/repeated use",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "แมวมี active metabolites/renal clearance considerations จึงเสี่ยง prolonged effect",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist; reversal ยาคู่ไม่ได้ reverse ketamine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "ECG/BP, ventilation, airway protection, muscle tone และ recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Ketamine monograph, PDF pp. 233–234 (printed pp. 217 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 144–145"
        }
      ]
    },
    {
      "id": "dexmedetomidine",
      "name": "Dexmedetomidine",
      "group": "Sedative",
      "aliases": [
        "dexmedetomidine",
        "Dexmedetomidine",
        "Dexdomitor"
      ],
      "fields": {
        "class": {
          "text": "Alpha-2 agonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Central sympatholysis และ peripheral alpha-2 effects",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Sedation, premedication, analgesic adjunct",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Sedation + analgesia; ลดความต้องการ induction/inhalant",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง cardiovascular/systemic disease, hypovolemia และ diabetic patient; ตรวจฉลาก",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Vasoconstriction/initial hypertension, bradycardia และ cardiac output ลด; AV block อาจพบ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "RR อาจลด; ให้ oxygen และตรวจ ventilation โดยเฉพาะยาร่วม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Vomiting, diuresis, hyperglycemia; sudden arousal ยังเป็นไปได้",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Opioid/other sedatives เพิ่มผลกด; อย่าใช้ anticholinergic แก้ HR โดยไม่ดู BP/afterload",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset/ระยะขึ้นกับ route/dose; analgesia อาจหมดก่อน sedation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat ไวต่อ cardiovascular effects; ใช้ patient selection",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Atipamezole; analgesia หายไปด้วย",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "HR/rhythm ร่วม BP/pulse/perfusion, SpO₂, ventilation และ temperature",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Dexmedetomidine monograph, PDF pp. 132–133 (printed pp. 116 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
        }
      ]
    },
    {
      "id": "medetomidine",
      "name": "Medetomidine",
      "group": "Sedative",
      "aliases": [
        "medetomidine",
        "Medetomidine",
        "Domitor"
      ],
      "fields": {
        "class": {
          "text": "Alpha-2 agonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Alpha-2 mediated sedation, analgesia และ vasoconstriction",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Sedation และ premedication combination",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Balanced anesthesia adjunct; racemic mixture ต่างจาก dexmedetomidine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "หลีกเลี่ยง/ระวัง cardiovascular compromise และ hypovolemia ตาม clinical review",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Bradycardia, AV block, initial hypertension, cardiac output ลด",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Hypoventilation เด่นขึ้นเมื่อใช้ร่วมยากด CNS",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Vomiting, diuresis, hypothermia และ prolonged sedation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "เพิ่มฤทธิ์ opioids/hypnotics; ไม่เทียบ dose กับ dexmedetomidine ตรง ๆ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset/ระยะขึ้นกับ route, dose และยาอื่น",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; cat ketamine combination ต้องวางแผน reversal timing",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Atipamezole; ต้องรักษา analgesia หลัง reversal",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "ECG + pulse/BP/perfusion, airway, ventilation, temperature",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Medetomidine monograph, PDF pp. 263–264 (printed pp. 247 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 136–137"
        }
      ]
    },
    {
      "id": "acepromazine",
      "name": "Acepromazine",
      "group": "Sedative",
      "aliases": [
        "acepromazine",
        "Acepromazine",
        "ACP"
      ],
      "fields": {
        "class": {
          "text": "Phenothiazine tranquilizer",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "CNS depressant; peripheral alpha-1 blockade",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Premedication/tranquilization",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Sedation และ antiemetic role; ไม่มี analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "Hypotension/shock, anemia, hepatic disease; Boxer syncope sensitivity",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Vasodilation → hypotension; splenic RBC sequestration",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "RR อาจลด; ผลกด ventilation เพิ่มเมื่อใช้ยาร่วม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Hypotension, hypothermia และ sedation นาน",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "CNS depressants เพิ่มผลรวม; alpha blockade อาจเปลี่ยน epinephrine response",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IM onset ประมาณ 20–30 นาที; sedation อาจนานหลายชั่วโมง",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "ใช้ใน dog/cat; ระวัง Boxer/giant breed sensitivity",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "BP/perfusion, temperature, sedation และ recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Acepromazine monograph, PDF pp. 17–18 (printed pp. 1 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 133–134"
        }
      ]
    },
    {
      "id": "diazepam",
      "name": "Diazepam",
      "group": "Sedative",
      "aliases": [
        "diazepam",
        "Diazepam",
        "Valium"
      ],
      "fields": {
        "class": {
          "text": "Benzodiazepine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "เสริม GABA-A ที่ benzodiazepine site",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Co-induction, muscle relaxation, emergency seizure control",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Cardiovascular-sparing adjunct; sedation เดี่ยวไม่แน่นอน",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง hepatic/respiratory impairment; repeated oral use ในแมวสัมพันธ์ hepatic necrosis",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "โดยทั่วไป cardiovascular depression น้อยเมื่อใช้เดี่ยว",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "ผลกดเพิ่มเมื่อใช้ร่วม opioid/hypnotic; airway muscle relaxation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Paradoxical excitation, ataxia; IM ดูดซึมไม่สม่ำเสมอและระคายเคือง",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "CNS depressants additive; formulation ไม่ควรผสมโดยไม่ตรวจ compatibility",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV onset เร็ว; repeated dosing/ตับผิดปกติทำให้สะสม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Healthy dog/cat อาจตื่นเต้น; oral feline caution ไม่เท่ากับห้าม IV co-induction ทุกกรณี",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Flumazenil",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Ventilation, BP, sedation quality และ recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Diazepam monograph, PDF pp. 134–136 (printed pp. 118 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
        }
      ]
    },
    {
      "id": "midazolam",
      "name": "Midazolam",
      "group": "Sedative",
      "aliases": [
        "midazolam",
        "Midazolam",
        "Dormicum"
      ],
      "fields": {
        "class": {
          "text": "Benzodiazepine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "เสริม GABA-A mediated inhibition",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Co-induction, sedation combination, seizure control",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Muscle relaxation/anxiolysis; ไม่มี analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง severe hypotension, hepatic และ respiratory disease; neonatal use ต้อง review ฉลาก/ตำราเฉพาะ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "มักกด CV น้อย แต่ hypotension เป็นไปได้กับยาอื่น",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Opioid combination เพิ่ม respiratory depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Paradoxical excitation, ataxia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "เพิ่มฤทธิ์ hypnotics/opioids; หลีกเลี่ยง calcium-containing fluid incompatibility",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset เร็ว; โดยทั่วไประยะสั้น แต่เปลี่ยนตาม route และ clearance",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Healthy dog/cat sedation เดี่ยวไม่น่าเชื่อถือ; debilitated patient อาจตอบสนองต่างกัน",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Flumazenil",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Ventilation/airway, BP, sedation และ recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Midazolam monograph, PDF pp. 282–283 (printed pp. 266 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 134–135"
        }
      ]
    },
    {
      "id": "fentanyl",
      "name": "Fentanyl",
      "group": "Analgesic",
      "aliases": [
        "fentanyl",
        "Fentanyl",
        "Sublimaze"
      ],
      "fields": {
        "class": {
          "text": "Full mu opioid agonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Mu receptor analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Intraoperative analgesia; infusion ใน monitored setting",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Potent analgesia/inhalant sparing; ไม่ใช่ยาสลบเดี่ยวที่คาดเดาได้ทุกเคส",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง respiratory compromise และ prolonged accumulation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Bradycardia; ต้องสัมพันธ์กับ BP/perfusion",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Respiratory depression/apnea เมื่อให้ IV ระหว่างสลบ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Dysphoria, sedation; ขนาดสูง/infusion นานทำให้ฟื้นช้า",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Sedative/hypnotic additive; partial agonist/antagonist อาจเปลี่ยน analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV onset เร็ว; bolus ระดับ 10–20 นาที; infusion นานทำให้ duration ยืด",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat: patch onset ช้าและแปรปรวน ไม่ใช้แทน immediate intraoperative analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Naloxone; ต้องจัดการ pain หลัง reversal",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "ECG/BP, ventilation/ETCO₂, pain และ recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Fentanyl monograph, PDF pp. 176–178 (printed pp. 160 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
        }
      ]
    },
    {
      "id": "methadone",
      "name": "Methadone",
      "group": "Analgesic",
      "aliases": [
        "methadone",
        "Methadone"
      ],
      "fields": {
        "class": {
          "text": "Full mu opioid agonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Mu analgesia; NMDA antagonist contribution",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Moderate–severe perioperative pain",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Premedication analgesia และ balanced anesthesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง hepatic clearance ลด/respiratory compromise",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Bradycardia อาจเกิด; ประเมิน perfusion",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Respiratory depression โดยเฉพาะ IV ในผู้ป่วยสลบ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Sedation/excitation; repeated use อาจสะสม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Hypnotics/sedatives additive; mixed opioid receptor activity อาจเปลี่ยนผล",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Analgesia มักประมาณ 3–4 ชั่วโมง แต่แตกต่างรายตัว",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; OTM absorption ในแมวมี formulation considerations",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Naloxone; analgesia หายไปด้วย",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Pain score, ventilation, HR/BP และ sedation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Methadone monograph, PDF pp. 270–271 (printed pp. 254 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
        }
      ]
    },
    {
      "id": "morphine",
      "name": "Morphine",
      "group": "Analgesic",
      "aliases": [
        "morphine",
        "Morphine"
      ],
      "fields": {
        "class": {
          "text": "Full mu opioid agonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Mu opioid receptor analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Moderate–severe pain; selected epidural/infusion protocols",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Analgesia; ลด inhalant requirement",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง vomiting contraindication; neuraxial use ต้องตรวจ preservative",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Bradycardia; rapid IV histamine release → hypotension",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Dose-dependent respiratory depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Vomiting, histamine reaction, dysphoria; accumulation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "CNS depressants additive; butorphanol อาจลด mu analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset/ระยะขึ้นกับ route; epidural นานกว่าระบบ systemic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog มัก sedation/panting; cat อาจ hyperthermia/excitation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Naloxone",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Pain, temperature, ventilation, HR/BP และ injection response",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Morphine monograph, PDF pp. 290–291 (printed pp. 274 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
        }
      ]
    },
    {
      "id": "buprenorphine",
      "name": "Buprenorphine",
      "group": "Analgesic",
      "aliases": [
        "buprenorphine",
        "Buprenorphine"
      ],
      "fields": {
        "class": {
          "text": "Partial mu agonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "High receptor affinity/slow dissociation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Mild–moderate perioperative pain",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Analgesic component โดยเฉพาะในแมว; ไม่ถือว่าเพียงพอทุก surgery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ตับผิดปกติอาจทำให้ effect ยืด; reassess breakthrough pain",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "มัก CV effects น้อย แต่ไม่ยกเว้น monitoring",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Respiratory depression ยังต้องเฝ้าระวังกับยาร่วม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Sedation และ neonatal exposure ผ่าน placenta",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Full mu interaction ซับซ้อน; ถ้า analgesia ไม่พออย่าชะลอ rescue เพียงเพราะได้รับ buprenorphine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset ช้ากว่า opioid บางตัว; effect มักหลายชั่วโมง",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Cat OTM ต้องตรวจ formulation; pain reassessment จำเป็นทั้งสอง species",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Naloxone reversal อาจไม่สมบูรณ์จาก high affinity; ต้อง support ventilation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Pain score, ventilation, sedation และ HR/BP",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Buprenorphine monograph, PDF pp. 69–70 (printed pp. 53 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
        }
      ]
    },
    {
      "id": "butorphanol",
      "name": "Butorphanol",
      "group": "Analgesic",
      "aliases": [
        "butorphanol",
        "Butorphanol",
        "Torbugesic"
      ],
      "fields": {
        "class": {
          "text": "Kappa agonist / mu antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Mixed opioid receptor action",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Sedation adjunct; selected mild pain/antitussive roles",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Sedation เด่น; analgesia ไม่พอสำหรับ severe surgical pain",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง airway ที่มี copious mucus; วางแผน rescue analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Bradycardia พบได้แต่ค่อนข้างน้อยใน clinical dose",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Respiratory depression ยังเป็นไปได้; cough suppression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Sedation และ excitation เป็นรายตัว",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "อาจ antagonize full mu analgesia; additive CNS depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Analgesia สั้นและแปรปรวน; sedation อาจนานกว่า",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; ไม่ใช้ความสงบแทน pain assessment",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Naloxone",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Pain/ventilation, sedation และ cardiovascular status",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Butorphanol monograph, PDF pp. 70–71 (printed pp. 54 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 138–139"
        }
      ]
    },
    {
      "id": "tramadol",
      "name": "Tramadol",
      "group": "Analgesic",
      "aliases": [
        "tramadol",
        "Tramadol"
      ],
      "fields": {
        "class": {
          "text": "Atypical opioid / monoamine reuptake inhibitor",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Mu activity ของ metabolite และ serotonin/norepinephrine pathways",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Selected multimodal analgesia ตาม species/evidence",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Adjunct; ไม่ถือว่า reliable sole severe surgical analgesia ในสุนัข",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง seizures และ serotonergic combination; hepatic/renal impairment",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "ติดตาม HR/BP; ไม่ใช่ pressor หรือ treatment ของ hypotension",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "อาจกด respiration/ทำ sedation; ยังต้อง monitor ยาร่วม",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "GI upset, dysphoria/sedation และ serotonin toxicity risk",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "SSRI/MAOI/serotonergic drugs เพิ่ม serotonin syndrome risk",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "ระยะขึ้นกับ route, species และ active metabolite; ไม่สรุปจากความสงบ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog active metabolite ต่ำ/ผลแปรปรวน; cat metabolism ต่างจาก dog",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "Naloxone อาจ reverse opioid component แต่ไม่แก้ทุก monoaminergic effect",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Pain response, behavior, ventilation และ serotonin toxicity signs",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Tramadol monograph, PDF pp. 426–427 (printed pp. 410 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 175–176"
        }
      ]
    },
    {
      "id": "lidocaine",
      "name": "Lidocaine",
      "group": "Local / Emergency",
      "aliases": [
        "lidocaine",
        "Lidocaine",
        "Lignocaine",
        "Xylocaine"
      ],
      "fields": {
        "class": {
          "text": "Amide local anesthetic; class IB antiarrhythmic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Voltage-gated sodium channel blockade",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Local/regional anesthesia; selected ventricular arrhythmias",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Multimodal analgesia และ rhythm-specific antiarrhythmic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง intravascular toxicity, hepatic clearance และ cat sensitivity",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Overdose → conduction depression, hypotension/arrhythmia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Systemic toxicity อาจกด respiration/เกิด apnea",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Neurologic excitation/seizures → CNS depression; local anesthetic systemic toxicity",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Toxicity รวมกับ local anesthetics อื่น; ตรวจ cumulative exposure ทุก route",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Local onset เร็ว; duration สั้นกว่า bupivacaine; IV effect ต้อง titrate ตาม protocol",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "แมวไวต่อ systemic adverse effects มากกว่า; dog IV protocol ห้ามยกไปใช้ตรง ๆ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี receptor antagonist; LAST rescue ตาม hospital protocol",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "ECG/BP, neurologic signs, respiration และ cumulative local anesthetic exposure",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Lidocaine monograph, PDF pp. 244–246 (printed pp. 228 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
        }
      ]
    },
    {
      "id": "bupivacaine",
      "name": "Bupivacaine",
      "group": "Local / Emergency",
      "aliases": [
        "bupivacaine",
        "Bupivacaine",
        "Marcaine",
        "Macaine"
      ],
      "fields": {
        "class": {
          "text": "Amide local anesthetic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Reversible sodium channel blockade",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Regional/perineural/epidural analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Longer local analgesia; ลด systemic anesthetic need",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ห้าม IV administration/IV regional anesthesia; ระวัง accidental intravascular injection",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Cardiotoxicity อาจรุนแรงและรักษายาก",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Systemic toxicity อาจทำ apnea; monitor neuraxial effects",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Seizures, severe arrhythmias/cardiovascular collapse ถ้า systemic toxicity",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Local anesthetic toxicity additive; รวม exposure ทุกชนิด",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset ช้ากว่า lidocaine; epidural ประมาณ 20–30 นาที/หลายชั่วโมง",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat ต้องคำนวณ total local exposure อย่างรอบคอบ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist; LAST rescue protocol",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Injection site/technique, ECG/BP, CNS/respiration และ block extent",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Bupivacaine monograph, PDF pp. 68–69 (printed pp. 52 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 168–170"
        }
      ]
    },
    {
      "id": "isoflurane",
      "name": "Isoflurane",
      "group": "Inhalant",
      "aliases": [
        "isoflurane",
        "Isoflurane"
      ],
      "fields": {
        "class": {
          "text": "Volatile anesthetic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Multiple CNS targets; mechanism ยังไม่อธิบายครบ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Maintenance of general anesthesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "ปรับ depth โดย vaporizer/expired concentration; ต้องเสริม analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ใช้ calibrated vaporizer และ scavenging; ระวัง hypovolemia/CV compromise",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Dose-dependent vasodilation/hypotension",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Dose-dependent respiratory depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Hypotension, hypoventilation; environmental exposure",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Opioid/sedative ลด requirement; เพิ่ม duration nondepolarizing blockade",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Speed ขึ้นกับ uptake/ventilation; เปลี่ยนช้ากว่า sevoflurane",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; pungent mask/chamber induction ต้อง review airway/stress",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist; ลด/หยุด delivery และ support patient",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Clinical depth, BP, ETCO₂, SpO₂, temperature; gas concentration ถ้ามี",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Isoflurane monograph, PDF pp. 229–230 (printed pp. 213 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
        }
      ]
    },
    {
      "id": "sevoflurane",
      "name": "Sevoflurane",
      "group": "Inhalant",
      "aliases": [
        "sevoflurane",
        "Sevoflurane"
      ],
      "fields": {
        "class": {
          "text": "Volatile anesthetic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Multiple CNS sites; mechanism ไม่สมบูรณ์",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Induction/maintenance ตาม airway plan",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Low blood solubility ช่วยปรับ depth เร็ว",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "Calibrated vaporizer/scavenging; ตรวจ absorbent condition และ circuit",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Dose-dependent hypotension",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Dose-dependent hypoventilation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Hypotension, recovery agitation; neonatal depression ผ่าน placenta",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Sedative/analgesic adjunct ลด requirement; additive cardiopulmonary depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Uptake/recovery โดยทั่วไปเร็วกว่า isoflurane แต่ขึ้นกับ ventilation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; smooth apparent induction ไม่ยกเว้น airway risk",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist; support ventilation/perfusion",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Depth, BP, ventilation, oxygenation และ temperature",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Sevoflurane monograph, PDF pp. 390–391 (printed pp. 374 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 151–158"
        }
      ]
    },
    {
      "id": "atropine",
      "name": "Atropine",
      "group": "Emergency",
      "aliases": [
        "atropine",
        "Atropine"
      ],
      "fields": {
        "class": {
          "text": "Antimuscarinic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Muscarinic acetylcholine receptor blockade",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Selected bradycardia/bradyarrhythmias; specific CPR role",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "เพิ่ม HR เมื่อ vagal effect มี clinical significance",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ไม่ใช้ HR เดี่ยวตัดสิน; ระวัง tachyarrhythmia และ alpha-2 induced hypertension",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Tachycardia; transient conduction effects อาจเกิด",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "ลด secretions/bronchodilation; ไม่แทน ventilation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Tachyarrhythmia, GI ileus; thickened secretions",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Anticholinergic additive; alpha-2 physiology ต้องประเมิน BP/afterload",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV effect ไม่ทันทีทุกเคส; รอประเมิน response ก่อน redose ตาม protocol",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; routine prophylaxis ต้องพิจารณาเหตุผลเฉพาะเคส",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี routine antagonist ใน anesthesia; supportive reassessment",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "ECG + pulse, BP และ perfusion ก่อน/หลังให้",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Atropine monograph, PDF pp. 53–54 (printed pp. 37 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
        }
      ]
    },
    {
      "id": "glycopyrrolate",
      "name": "Glycopyrrolate",
      "group": "Emergency",
      "aliases": [
        "glycopyrrolate",
        "Glycopyrrolate",
        "Glycopyrronium",
        "Robinul"
      ],
      "fields": {
        "class": {
          "text": "Quaternary antimuscarinic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Peripheral muscarinic blockade; ไม่ผ่าน BBB ได้ง่าย",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Selected vagal/opioid bradycardia; secretion control",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Anticholinergic ที่ duration ยาวกว่า atropine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ไม่ใช่ routine HR correction; ระวัง alpha-2 hypertension/tachyarrhythmia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "เพิ่ม HR; very low administration อาจเกิด transient bradycardia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "ลดน้ำใน secretions ทำให้เหนียว; ไม่แก้ hypoventilation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Tachycardia, ileus, thick secretions",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Anticholinergic effects รวม; ทบทวน alpha-2 และ reversal combinations",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset ช้ากว่า atropineบางสถานการณ์; duration ยาวกว่า",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; ไม่สลับ atropine โดยไม่ทบทวน timing",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี routine antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "ECG/pulse, BP, perfusion และ airway secretions",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Glycopyrrolate monograph, PDF pp. 203–204 (printed pp. 187 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 140, 181–182"
        }
      ]
    },
    {
      "id": "epinephrine",
      "name": "Epinephrine / Adrenaline",
      "group": "Emergency",
      "aliases": [
        "epinephrine",
        "Epinephrine / Adrenaline",
        "Adrenaline"
      ],
      "fields": {
        "class": {
          "text": "Catecholamine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Alpha-1/2 and beta-1/2 agonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Anaphylaxis; rhythm-directed CPR protocol",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Vasopressor/inotrope/bronchodilator; indication-specific protocol",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "แยก anaphylaxis กับ CPA protocol; RECOVER 2024 ไม่แนะนำ routine high-dose epinephrine ใน CPR; ข้อมูลในตำราเก่าบางส่วนถูกปรับแล้ว",
          "refs": [
            {
              "source": "RECOVER24",
              "locator": "Box 1; Table 1 ALS-08 and ALS-16"
            },
            {
              "source": "BSAVA",
              "locator": "Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "HR/contractility/vascular resistance เปลี่ยนตาม exposure; arrhythmogenic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Bronchodilation; ไม่แทน airway/oxygen/ventilation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Tachyarrhythmia, hypertension, myocardial oxygen demand และ ischemia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Sympathomimetic additive; alpha blocker เปลี่ยน response",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV effect เร็วและสั้น; anaphylaxis route/infusion ต้อง review แยก CPA",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat: small-patient preparation errors สำคัญมาก",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี routine specific antagonist; หยุด/ปรับ exposure และ supportive care",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "ECG/BP/perfusion, ventilation/oxygenation และ infusion site",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Epinephrine / Adrenaline monograph, PDF pp. 21–22 (printed pp. 5 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 183–184"
        }
      ]
    },
    {
      "id": "ephedrine",
      "name": "Ephedrine",
      "group": "Emergency",
      "aliases": [
        "ephedrine",
        "Ephedrine"
      ],
      "fields": {
        "class": {
          "text": "Mixed direct/indirect sympathomimetic",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Alpha/beta effects และ endogenous norepinephrine release",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Selected anesthetic hypotension",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Pressor/inotropic support ใน selected physiology",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง tachyarrhythmia; catecholamine depletion ลด efficacy",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "เพิ่ม BP/HR/inotropy; reflex response เปลี่ยนได้",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "ไม่ใช่ respiratory support; ต้องติดตาม ventilation ของผู้ป่วย",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Hypertension/tachyarrhythmia และ tachyphylaxis",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Other sympathomimetics เพิ่ม CV effects",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV bolus onset เร็ว; effect อาจนานถึงประมาณ 30 นาที",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; repeated bolus อาจตอบสนองลดลง ไม่ redose อัตโนมัติ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี routine antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "BP trend/ECG/pulse และ response หลังให้",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Ephedrine monograph, PDF pp. 164–165 (printed pp. 148 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–183"
        }
      ]
    },
    {
      "id": "dobutamine",
      "name": "Dobutamine",
      "group": "Emergency",
      "aliases": [
        "dobutamine",
        "Dobutamine"
      ],
      "fields": {
        "class": {
          "text": "Catecholamine inotrope",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Predominant beta-1 activity with other adrenergic effects",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Hypotension ที่ poor contractility เป็น contributor",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Improve contractility; ไม่ใช่ default treatment ทุก low BP",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง tachyarrhythmia; ต้องมี accurate infusion และ physiology review",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Positive inotropy; HR/arrhythmia/BP เปลี่ยนตาม response",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "ไม่แก้ airway/ventilation problem โดยตรง",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Tachyarrhythmia, hypertension; prolonged use อาจ hypokalemia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Other sympathomimetics เพิ่ม arrhythmia risk; beta blockade อาจลด effect",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "ออกฤทธิ์สั้น; infusion adjustment เห็นผล/หมดฤทธิ์รวดเร็ว",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; titrate ตาม hemodynamic response",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี routine antagonist; ลด/หยุด infusion เมื่อ adverse response",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "BP/pulse/perfusion, ECG; electrolytes ถ้าใช้ต่อเนื่อง",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Dobutamine monograph, PDF pp. 147–148 (printed pp. 131 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
        }
      ]
    },
    {
      "id": "norepinephrine",
      "name": "Norepinephrine / Noradrenaline",
      "group": "Emergency",
      "aliases": [
        "norepinephrine",
        "Norepinephrine / Noradrenaline",
        "Noradrenaline"
      ],
      "fields": {
        "class": {
          "text": "Catecholamine vasopressor",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Alpha adrenergic vasoconstriction with beta contribution",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Vasodilatory hypotension/shock ที่ผ่านการประเมิน volume",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Support vascular tone; individualized infusion",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "หลีกเลี่ยงใช้แทนแก้ hypovolemia; ระวัง ischemia/extravasation",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "SVR เพิ่ม; cardiac output เปลี่ยนตาม preload/afterload/exposure",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "ไม่แก้ hypoventilation; assess oxygen delivery ร่วม perfusion",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Hypertension, arrhythmias และ tissue ischemia",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Sympathomimetic additive; alpha/beta blocker เปลี่ยน response",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV infusion effect เร็ว/ระยะสั้น; ไม่ใช้ bolus shortcut",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; ดู perfusion endpoints มากกว่า BP เพียงค่าเดียว",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี routine antagonist; extravasation management ตาม protocol",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Continuous/frequent BP, ECG, peripheral perfusion และ catheter site",
          "refs": [
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 182–184"
        }
      ]
    },
    {
      "id": "naloxone",
      "name": "Naloxone",
      "group": "Reversal",
      "aliases": [
        "naloxone",
        "Naloxone",
        "Narcan"
      ],
      "fields": {
        "class": {
          "text": "Opioid antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Competitive opioid receptor antagonism",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Clinically important opioid depression/overdose",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Reverse opioid effects; pain จะกลับมา",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ประเมิน airway/ventilation และ pain plan; ไม่ reverse sedative อื่น",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "HR/BP อาจเปลี่ยนหลังเสีย opioid analgesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "แก้ opioid-mediated depression แต่ต้อง support airway ขณะรอ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Acute pain/stress; recurrent opioid depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Antagonizes opioid analgesia; ไม่แก้ monoaminergic toxicity ทั้งหมด",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "IV onset เร็ว; effect ประมาณ 30–40 นาที/สั้นกว่า opioid บางตัว",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; ต้องเฝ้าระวัง renarcotization",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "เป็น antagonist; ไม่มี routine antagonist ของ naloxone",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Ventilation, pain, HR/BP และ sedation recurrence",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Naloxone monograph, PDF pp. 296 (printed pp. 280 onward)"
        }
      ]
    },
    {
      "id": "flumazenil",
      "name": "Flumazenil",
      "group": "Reversal",
      "aliases": [
        "flumazenil",
        "Flumazenil"
      ],
      "fields": {
        "class": {
          "text": "Benzodiazepine antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Displaces benzodiazepine at receptor site",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Selected benzodiazepine sedation/respiratory depression",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Reverse benzodiazepine contribution; ไม่ reverse hypnotic/ketamine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง benzodiazepine dependence/seizure control และ mixed toxic ingestion",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "ติดตาม CV หลัง reversal; ไม่ใช่ pressor",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Ventilation ดีขึ้นถ้า benzodiazepine เป็นสาเหตุ; support airway ต่อ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Excitation/seizure risk บางบริบท; resedation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "ลด benzodiazepine effect รวม anticonvulsant effect",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset ประมาณ 1–2 นาที; effect ราวหนึ่งชั่วโมงแต่แปรปรวน",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat; ต้องประเมินว่ามี drug class อื่นค้างหรือไม่",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "เป็น antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "Ventilation, mental status, seizure recurrence และ resedation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Flumazenil monograph, PDF pp. 185–186 (printed pp. 169 onward)"
        }
      ]
    },
    {
      "id": "atipamezole",
      "name": "Atipamezole",
      "group": "Reversal",
      "aliases": [
        "atipamezole",
        "Atipamezole",
        "Antisedan"
      ],
      "fields": {
        "class": {
          "text": "Alpha-2 antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Competitive alpha-2 receptor blockade",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Reverse medetomidine/dexmedetomidine effects",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Reverse sedation/analgesia/CV effects; ไม่ reverse ketamine",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง timing หลัง ketamine combination; routine rapid IV reversal อาจ excitation",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "HR/BP เปลี่ยนเร็วเมื่อยกเลิก alpha-2 effect",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "Reassess ventilation; reversal ไม่แทน airway protection",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "Excitation/tachycardia; analgesia หาย",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "Antagonizes alpha-2 drugs; ketamine ยังมี effect",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Onset ขึ้นกับ route; เฝ้าระวัง sedation และ pain หลัง reversal",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat reversal relationship ต่างกัน; ไม่คัดลอก volume ratio โดยไม่ review",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "เป็น antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "HR/BP, pain, mental status, airway และ recovery",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Atipamezole monograph, PDF pp. 51–52 (printed pp. 35 onward)"
        }
      ]
    },
    {
      "id": "carprofen",
      "name": "Carprofen",
      "group": "Analgesic",
      "aliases": [
        "carprofen",
        "Carprofen",
        "Rimadyl"
      ],
      "fields": {
        "class": {
          "text": "NSAID",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Cyclooxygenase inhibition ลด prostaglandins",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Perioperative inflammatory pain ใน suitable patient",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Multimodal analgesia; ไม่ให้ sedation/induction",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "ระวัง renal/hepatic/GI disease, hypovolemia/hypotension และ bleeding risk",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "ไม่ใช่ pressor; renal perfusion risk ใน low-flow states",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "ไม่ใช่ respiratory depressant หลัก; ยัง monitor anesthesia",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "GI ulceration/bleeding, renal injury, hepatic adverse effects",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "หลีกเลี่ยงร่วม NSAID อื่น/corticosteroid; review nephrotoxic drugs",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Analgesic timing ขึ้นกับ route; ไม่ใช้ duration แทน pain reassessment",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "Dog/cat indication/licensing ต่างกัน; cat repeated dosing ต้องทบทวนเฉพาะ",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "BP/hydration/perfusion, pain, renal/GI/hepatic risk",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Carprofen monograph, PDF pp. 79–81 (printed pp. 63 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
        }
      ]
    },
    {
      "id": "meloxicam",
      "name": "Meloxicam",
      "group": "Analgesic",
      "aliases": [
        "meloxicam",
        "Meloxicam",
        "Metacam"
      ],
      "fields": {
        "class": {
          "text": "NSAID",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "mechanism": {
          "text": "Cyclooxygenase inhibition",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "indications": {
          "text": "Perioperative inflammatory pain ใน selected patient",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "clinicalRole": {
          "text": "Multimodal analgesia; ไม่มี hypnosis",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cautions": {
          "text": "เลื่อนให้ถ้าเสี่ยง hypotension จน perfusion เหมาะสม; renal/GI/hepatic risks",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "cardiovascular": {
          "text": "Renal perfusion risk ระหว่าง hypotension; ไม่ใช้รักษา low BP",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "respiratory": {
          "text": "ไม่ใช่ respiratory depressant หลัก",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "adverse": {
          "text": "GI injury/bleeding, renal injury; accumulation เมื่อ clearance ลด",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "interactions": {
          "text": "ไม่ร่วม NSAID/corticosteroid โดยไม่มี review; nephrotoxic interactions",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "onsetDuration": {
          "text": "Timing/ระยะตาม formulation และ species; reassess pain",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "dogCat": {
          "text": "แมว therapeutic margin/half-life ต่างจากสุนัข; ตรวจฉลากประเทศ/ชนิดผลิตภัณฑ์",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "reversal": {
          "text": "ไม่มี specific antagonist",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        "monitoring": {
          "text": "BP/hydration, renal/GI risks และ pain response",
          "refs": [
            {
              "source": "BSAVA",
              "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
            },
            {
              "source": "FUND",
              "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
            },
            {
              "source": "TECH",
              "locator": "Ch. 6: Anesthetic monitoring, PDF pp. 207–245"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      },
      "references": [
        {
          "source": "BSAVA",
          "locator": "Meloxicam monograph, PDF pp. 266–268 (printed pp. 250 onward)"
        },
        {
          "source": "FUND",
          "locator": "Ch. 7–10: relevant pharmacology, PDF pp. 165–169"
        }
      ]
    }
  ],
  "guides": [
    {
      "id": "hypotension",
      "title": "Hypotension",
      "category": "Circulation",
      "trigger": {
        "text": "ความดันต่ำหรือ perfusion แย่; ใช้ configured case thresholds เดิม",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
          },
          {
            "source": "AAHA24",
            "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ยืนยัน cuff/measurement และดู pulse/CRT/perfusion พร้อมกัน",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ตรวจ depth, HR/rhythm, blood loss และ volume status",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "แก้ตาม physiology แล้ววัดซ้ำ; deterioration ให้ขอความช่วยเหลือ",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "verify",
      "nodes": [
        {
          "id": "verify",
          "question": {
            "text": "ยืนยัน measurement และ perfusion แล้วหรือยัง?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
              },
              {
                "source": "AAHA24",
                "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ยัง",
              "action": {
                "text": "ตรวจ cuff, level, repeated reading/alternative method; ถ้าผู้ป่วยไม่ stable ให้ช่วยเหลือพร้อมตรวจ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            },
            {
              "label": "แล้ว",
              "action": {
                "text": "ตรวจ contributors: depth, rhythm, bleeding, ventilation และ volume",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            }
          ]
        },
        {
          "id": "cause",
          "question": {
            "text": "Contributor ใดได้รับการสนับสนุนจากข้อมูล?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
              },
              {
                "source": "AAHA24",
                "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "สลบลึก",
              "action": {
                "text": "ลด depressant load ตาม clinical assessment และคง analgesia",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "HR ต่ำ + perfusion แย่",
              "action": {
                "text": "ตรวจ rhythm/vagal/drug effect; chronotropic treatment ต้องเหมาะกับ BP/afterload",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "สูญเสีย volume",
              "action": {
                "text": "ห้ามเลือด/targeted fluid challenge ตาม individual plan; ตรวจ overload risk",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "contractility/SVR ผิดปกติ",
              "action": {
                "text": "พิจารณา inotrope/pressor ที่ตรง physiology หลังทบทวน reversible causes",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "ไม่ชัดเจน",
              "action": {
                "text": "ประเมินซ้ำทั้ง oxygenation/ventilation, glucose, temperature, anemia และ drug effect",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "หลัง intervention ดีขึ้นหรือไม่?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
              },
              {
                "source": "AAHA24",
                "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ดีขึ้น",
              "action": {
                "text": "ติดตาม trend/perfusion และบันทึก response",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่ดีขึ้น",
              "action": {
                "text": "ขอ clinician support; พิจารณา direct BP/labs/เปลี่ยนแผนหรือหยุด procedure; ถ้า CPA เข้าสู่ CPR",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "ไม่ load fluid แบบอัตโนมัติจาก BP ตัวเดียว; แยก hypovolemia จาก vasodilation",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "BP + pulse/CRT, ECG, SpO₂/ETCO₂, blood loss และ fluid response",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "dobutamine",
        "norepinephrine",
        "ephedrine",
        "atropine"
      ],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Hypotension, PDF pp. 426–427"
        },
        {
          "source": "AAHA24",
          "locator": "Section 4: hypotension, fluid responsiveness and overload considerations"
        }
      ]
    },
    {
      "id": "hypertension",
      "title": "Hypertension",
      "category": "Circulation",
      "trigger": {
        "text": "ความดันสูงต่อเนื่อง; ตรวจ reading และ clinical context",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
          },
          {
            "source": "AAHA20",
            "locator": "Troubleshooting: Hypertension"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ยืนยัน cuff/reading",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypertension"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ตรวจ stimulation/pain, depth และ ventilation",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypertension"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "เลือกแก้สาเหตุ; อย่าเพิ่ม inhalant จาก BP อย่างเดียว",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypertension"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "verify",
      "nodes": [
        {
          "id": "verify",
          "question": {
            "text": "Measurement credible?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Hypertension"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "แก้ cuff/ตำแหน่งและตรวจซ้ำ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypertension"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            },
            {
              "label": "ใช่",
              "action": {
                "text": "ประเมิน depth/analgesia และ drug exposure",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypertension"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            }
          ]
        },
        {
          "id": "cause",
          "question": {
            "text": "พบ noxious response หรือ gas/drug contributor?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Hypertension"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "Pain/light depth",
              "action": {
                "text": "จัด analgesia และ depth ให้พอดี; pause stimulation ถ้าจำเป็น",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypertension"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "Hypercapnia/hypoxemia",
              "action": {
                "text": "แก้ airway/ventilation/oxygenation",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypertension"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "Alpha-2/pressor/โรคเดิม",
              "action": {
                "text": "ทบทวนยา/ระดับ BP และ patient disease; ไม่ไล่ตัวเลขด้วย inhalant",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypertension"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "ยังสูงต่อเนื่อง?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Hypertension"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "พิจารณา disease/physiology และการรักษาเฉพาะโดย clinician",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypertension"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่",
              "action": {
                "text": "ติดตาม trend และ perfusion",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypertension"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "BP สูงไม่เท่ากับ analgesia ไม่พอเสมอ",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypertension"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "BP/HR, depth, ETCO₂/SpO₂ และ surgical timing",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypertension"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "dexmedetomidine"
      ],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Hypertension, PDF pp. 425–427"
        },
        {
          "source": "AAHA20",
          "locator": "Troubleshooting: Hypertension"
        }
      ]
    },
    {
      "id": "hypoxemia",
      "title": "Hypoxemia",
      "category": "Respiration",
      "trigger": {
        "text": "SpO₂ ลด/oxygenation concern; clinical severity ขึ้นกับ signal และ patient",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
          },
          {
            "source": "AAHA20",
            "locator": "Troubleshooting: Hypoxemia"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ตรวจ ETT/oxygen supply และ patient ทันที",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypoxemia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ดู chest excursion/capnogram แล้วตรวจ probe signal",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypoxemia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ถ้าไม่ดีขึ้นให้ escalate airway/ventilation และตรวจ pulmonary causes",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypoxemia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "airway",
      "nodes": [
        {
          "id": "airway",
          "question": {
            "text": "Airway/oxygen supply intact?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Hypoxemia"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "แก้ oxygen source/circuit/ETT; re-establish airway ถ้าจำเป็น",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypoxemia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "vent"
            },
            {
              "label": "ใช่",
              "action": {
                "text": "ตรวจ ventilation และ probe waveform/pulse agreement",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypoxemia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "vent"
            }
          ]
        },
        {
          "id": "vent",
          "question": {
            "text": "Ventilation หรือ ETT position ผิดปกติ?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Hypoxemia"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "แก้ kink/obstruction/displacement/mainstem; assist ventilation อย่างระวัง BP",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypoxemia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "persistent"
            },
            {
              "label": "ไม่",
              "action": {
                "text": "ตรวจ signal/perfusion; พิจารณา atelectasis/aspiration/pulmonary/pleural disease",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypoxemia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "persistent"
            }
          ]
        },
        {
          "id": "persistent",
          "question": {
            "text": "Oxygenation ยังไม่ดี?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Hypoxemia"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "ขอ help; ABG/diagnostics/ventilatory support หรือหยุด procedure ตาม patient; continued O₂ recovery",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypoxemia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่",
              "action": {
                "text": "ติดตาม continuous oxygenation และสาเหตุ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Hypoxemia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "อย่าเสียเวลาปรับ probe ซ้ำจนละเลย airway/oxygen; pink MM ไม่ยืนยันว่า oxygenation พอ",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypoxemia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "SpO₂ waveform, chest movement, ETCO₂, BP และ ABG เมื่อ indicated",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Hypoxemia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Hypoxemia, PDF pp. 427–428"
        },
        {
          "source": "AAHA20",
          "locator": "Troubleshooting: Hypoxemia"
        }
      ]
    },
    {
      "id": "hypercapnia",
      "title": "Hypoventilation / Hypercapnia",
      "category": "Respiration",
      "trigger": {
        "text": "ETCO₂ สูง/เพิ่มขึ้น หรือ ventilation ไม่พอ",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
          },
          {
            "source": "FUND",
            "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ตรวจ capnogram และ airway/circuit",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
            },
            {
              "source": "FUND",
              "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "แยก low minute ventilation จาก rebreathing",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
            },
            {
              "source": "FUND",
              "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "Assist ventilation เมื่อ indicated พร้อมวัด BP response",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
            },
            {
              "source": "FUND",
              "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "wave",
      "nodes": [
        {
          "id": "wave",
          "question": {
            "text": "Capnogram/sample credible?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
              },
              {
                "source": "FUND",
                "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "แก้ sample line/leak/monitor และดู patient ventilation",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
                  },
                  {
                    "source": "FUND",
                    "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            },
            {
              "label": "ใช่",
              "action": {
                "text": "ตรวจ RR/tidal excursion และ inspired CO₂",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
                  },
                  {
                    "source": "FUND",
                    "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            }
          ]
        },
        {
          "id": "cause",
          "question": {
            "text": "Pattern สนับสนุนอะไร?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
              },
              {
                "source": "FUND",
                "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "Low ventilation",
              "action": {
                "text": "ตรวจ depth/drug effects/obstruction; support ventilation",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
                  },
                  {
                    "source": "FUND",
                    "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "Rebreathing",
              "action": {
                "text": "ตรวจ absorbent, one-way valves, flow และ dead space; เปลี่ยนระบบถ้าผิดปกติ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
                  },
                  {
                    "source": "FUND",
                    "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "ไม่สอดคล้อง patient",
              "action": {
                "text": "ตรวจ blood gas/temperature และ pulmonary perfusion; ETCO₂ ไม่เท่ากับ PaCO₂ เสมอ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
                  },
                  {
                    "source": "FUND",
                    "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "หลังแก้/PPV?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
              },
              {
                "source": "FUND",
                "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ดีขึ้น",
              "action": {
                "text": "ติดตาม ETCO₂ waveform และ BP",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
                  },
                  {
                    "source": "FUND",
                    "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่ดีขึ้น",
              "action": {
                "text": "ตรวจ ETT/system ใหม่และ escalate diagnostics/ventilation",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
                  },
                  {
                    "source": "FUND",
                    "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "PPV อาจลด venous return/BP; ใช้ pressure เหมาะสมและ reassess",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
            },
            {
              "source": "FUND",
              "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "ETCO₂ waveform/inspired CO₂, RR, airway pressure, SpO₂ และ BP",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
            },
            {
              "source": "FUND",
              "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Hypoventilation / Hypercapnia, PDF pp. 428–434"
        },
        {
          "source": "FUND",
          "locator": "Ch. 4: capnography and ventilation, PDF pp. 69–80"
        }
      ]
    },
    {
      "id": "lowetco2",
      "title": "Low ETCO₂ / Capnogram Loss",
      "category": "Respiration",
      "trigger": {
        "text": "ETCO₂ ลดทันทีหรือ waveform หาย",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
          },
          {
            "source": "ACVAA25",
            "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ดู patient pulse/perfusion และ airway/circuit พร้อมกัน",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
            },
            {
              "source": "ACVAA25",
              "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ตรวจ sample line, connection และ ETT",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
            },
            {
              "source": "ACVAA25",
              "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ถ้า perfusion หายหรือ CPA suspected ให้เริ่ม CPR ตาม protocol",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
            },
            {
              "source": "ACVAA25",
              "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "patient",
      "nodes": [
        {
          "id": "patient",
          "question": {
            "text": "มี acute collapse/apnea/unresponsiveness?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
              },
              {
                "source": "ACVAA25",
                "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "Call help; ประเมิน arrest อย่างรวดเร็วและเริ่ม RECOVER BLS เมื่อเข้าเกณฑ์; ไม่รอ waveform",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่",
              "action": {
                "text": "ตรวจ circuit/ETT/sample line",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "circuit"
            }
          ]
        },
        {
          "id": "circuit",
          "question": {
            "text": "พบ leak/disconnection/sample failure?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
              },
              {
                "source": "ACVAA25",
                "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "แก้/เปลี่ยนระบบและตรวจ chest movement/waveform",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "ไม่",
              "action": {
                "text": "ประเมิน ventilation มากเกินหรือ reduced pulmonary perfusion",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "Perfusion กับ BP เป็นอย่างไร?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
              },
              {
                "source": "ACVAA25",
                "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "แย่",
              "action": {
                "text": "เข้าสู่ circulation evaluation; blood loss/CO/shock และ pulmonary causes",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "เหมาะสม",
              "action": {
                "text": "แก้ excessive ventilation ถ้ามี; ตรวจ ABG เมื่อ ETCO₂ ไม่สอดคล้อง",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "Low ETCO₂ ไม่ใช่ overventilation เสมอ; capnogram ใช้ยืนยัน perfusion ได้ใน context เท่านั้น",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
            },
            {
              "source": "ACVAA25",
              "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "Pulse/BP/ECG, waveform และ ventilation",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
            },
            {
              "source": "ACVAA25",
              "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Low ETCO₂ / Capnogram Loss, PDF pp. 428–440"
        },
        {
          "source": "ACVAA25",
          "locator": "Circulation and ventilation monitoring, journal pp. 379–380"
        }
      ]
    },
    {
      "id": "bradycardia",
      "title": "Bradycardia",
      "category": "Circulation",
      "trigger": {
        "text": "HR ต่ำต้องแปลร่วม pulse, rhythm และ BP",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
          },
          {
            "source": "FUND",
            "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ยืนยัน ECG rate กับ pulse",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
            },
            {
              "source": "FUND",
              "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ตรวจ BP/perfusion และยา/vagal stimulus",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
            },
            {
              "source": "FUND",
              "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ถ้า poor perfusion ให้แก้ cause; ไม่ให้ anticholinergic จาก HR อย่างเดียว",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
            },
            {
              "source": "FUND",
              "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "rhythm",
      "nodes": [
        {
          "id": "rhythm",
          "question": {
            "text": "ECG-pulse agreement?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
              },
              {
                "source": "FUND",
                "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "ตรวจ artifact/pulse deficit และ rhythm strip",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "FUND",
                    "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "perf"
            },
            {
              "label": "ใช่",
              "action": {
                "text": "ตรวจ perfusion/BP",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "FUND",
                    "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "perf"
            }
          ]
        },
        {
          "id": "perf",
          "question": {
            "text": "Perfusion แย่/ความดันต่ำ?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
              },
              {
                "source": "FUND",
                "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "หยุด vagal stimulus ถ้าทำได้; ตรวจ depth/hypothermia/oxygenation/drugs; พิจารณา rhythm-appropriate support",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "FUND",
                    "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "ไม่",
              "action": {
                "text": "Alpha-2 bradycardia อาจมี high BP/afterload; monitor และ review physiology ก่อนรักษา",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "FUND",
                    "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "ยังมี symptomatic conduction issue?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
              },
              {
                "source": "FUND",
                "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "Escalate ECG/clinician review; high-grade AV block อาจต้อง pacing consideration",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "FUND",
                    "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่",
              "action": {
                "text": "ติดตาม HR/BP/pulse และ intervention response",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "FUND",
                    "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "Anticholinergic อาจไม่แก้ infranodal block; α2-associated hypertension ต้องพิจารณา afterload",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
            },
            {
              "source": "FUND",
              "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "ECG strip, pulse quality, BP, temperature/ventilation",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
            },
            {
              "source": "FUND",
              "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "atropine",
        "glycopyrrolate",
        "atipamezole"
      ],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Bradycardia, PDF pp. 428–430"
        },
        {
          "source": "FUND",
          "locator": "Alpha-2, opioid and anticholinergic physiology, PDF pp. 136–140"
        }
      ]
    },
    {
      "id": "tachycardia",
      "title": "Tachycardia",
      "category": "Circulation",
      "trigger": {
        "text": "HR สูง/เพิ่มขึ้น; แยก sinus response กับ tachyarrhythmia",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
          },
          {
            "source": "AAHA20",
            "locator": "Troubleshooting: Tachycardia"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ดู ECG และ pulse agreement",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Tachycardia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ตรวจ pain, oxygenation, ventilation, volume และยา",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Tachycardia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "แก้ driver; ไม่ deepen inhalant อัตโนมัติ",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Tachycardia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "rhythm",
      "nodes": [
        {
          "id": "rhythm",
          "question": {
            "text": "มี sinus P:QRS relationship?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Tachycardia"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ชัดเจน",
              "action": {
                "text": "ประเมิน physiologic drivers",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Tachycardia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            },
            {
              "label": "ไม่ชัด",
              "action": {
                "text": "เปิด structured ECG review; unstable ให้ขอช่วยเหลือทันที",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Tachycardia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            }
          ]
        },
        {
          "id": "cause",
          "question": {
            "text": "Contributor หลัก?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Tachycardia"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "Pain/light depth",
              "action": {
                "text": "เสริม analgesia และ depth ที่เหมาะสม",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Tachycardia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "Oxygen/ventilation/volume",
              "action": {
                "text": "แก้ hypoxemia/hypercapnia/hemorrhage-hypovolemia",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Tachycardia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "Drug/arrhythmia/อื่น",
              "action": {
                "text": "Review administered drugs, temperature, electrolytes และ rhythm",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Tachycardia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "Poor perfusion/ยัง rapid?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
              },
              {
                "source": "AAHA20",
                "locator": "Troubleshooting: Tachycardia"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "Rhythm-specific clinician treatment; pause procedure และ escalate",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Tachycardia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่",
              "action": {
                "text": "Trend HR/BP และ clinical response",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
                  },
                  {
                    "source": "AAHA20",
                    "locator": "Troubleshooting: Tachycardia"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "อย่าใช้ HR เป็นตัววัด depth หรือ pain เพียงอย่างเดียว",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Tachycardia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "ECG/BP, pulse deficit, ETCO₂/SpO₂, blood loss และ analgesia",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
            },
            {
              "source": "AAHA20",
              "locator": "Troubleshooting: Tachycardia"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Tachycardia, PDF pp. 428–430"
        },
        {
          "source": "AAHA20",
          "locator": "Troubleshooting: Tachycardia"
        }
      ]
    },
    {
      "id": "arrhythmia",
      "title": "Arrhythmias",
      "category": "Circulation",
      "trigger": {
        "text": "New irregular rhythm, pulse deficit หรือ hemodynamic change",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
          },
          {
            "source": "ECG",
            "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ตรวจ ECG artifact และ pulse/perfusion",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
            },
            {
              "source": "ECG",
              "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ถ้า unstable ให้ขอ help/ใช้ rhythm-specific protocol",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
            },
            {
              "source": "ECG",
              "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ตรวจ oxygenation, ventilation, electrolytes, depth และ drug effect",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
            },
            {
              "source": "ECG",
              "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "stable",
      "nodes": [
        {
          "id": "stable",
          "question": {
            "text": "Patient มี effective circulation?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
              },
              {
                "source": "ECG",
                "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่/CPA",
              "action": {
                "text": "เริ่ม CPR เมื่อเข้า clinical arrest criteria; ใช้ RECOVER rhythm branch",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
                  },
                  {
                    "source": "ECG",
                    "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "มีแต่ unstable",
              "action": {
                "text": "Pause stimulus, correct reversible causes และขอ clinician rhythm treatment",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
                  },
                  {
                    "source": "ECG",
                    "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "strip"
            },
            {
              "label": "มีและ stable",
              "action": {
                "text": "Obtain strip/multiple leads และ structured interpretation",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
                  },
                  {
                    "source": "ECG",
                    "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "strip"
            }
          ]
        },
        {
          "id": "strip",
          "question": {
            "text": "Rhythm ระบุได้มั่นใจหรือยัง?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
              },
              {
                "source": "ECG",
                "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ยัง",
              "action": {
                "text": "Rate → Regularity → P → P:QRS → QRS; อย่าสรุปจาก monitor number",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
                  },
                  {
                    "source": "ECG",
                    "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "ได้",
              "action": {
                "text": "Treatment ตาม rhythm/clinical impact; ไม่ให้ antiarrhythmic blanket",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
                  },
                  {
                    "source": "ECG",
                    "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "หลังแก้ cause?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
              },
              {
                "source": "ECG",
                "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ยัง abnormal",
              "action": {
                "text": "Escalate labs/ECG/cardiology; reassess procedure risk",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
                  },
                  {
                    "source": "ECG",
                    "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ดีขึ้น",
              "action": {
                "text": "Monitor recurrence และบันทึก strip/response",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
                  },
                  {
                    "source": "ECG",
                    "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "Electrical activity ไม่รับประกัน mechanical output; artifact อาจคล้าย VF",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
            },
            {
              "source": "ECG",
              "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "ECG + pulse/BP/perfusion, ETCO₂/SpO₂, electrolytes/acid-base",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
            },
            {
              "source": "ECG",
              "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "lidocaine"
      ],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Arrhythmias, PDF pp. 427–430"
        },
        {
          "source": "ECG",
          "locator": "Arrhythmia morphology and limitations, PDF pp. 125–373"
        }
      ]
    },
    {
      "id": "hypothermia",
      "title": "Hypothermia",
      "category": "Temperature",
      "trigger": {
        "text": "Temperature ลด; thresholds จาก case protocol เดิม",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ตรวจ core temperature และลด ongoing heat loss",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ใช้ warming device ที่ออกแบบสำหรับ anesthetized patient",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ดู perfusion/drug accumulation และ monitor skin/temperature",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "verify",
      "nodes": [
        {
          "id": "verify",
          "question": {
            "text": "Temperature credible?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "ตรวจ probe position/contact และค่าซ้ำ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "warm"
            },
            {
              "label": "ใช่",
              "action": {
                "text": "ทบทวน heat loss/length/perfusion",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "warm"
            }
          ]
        },
        {
          "id": "warm",
          "question": {
            "text": "ยังสูญเสีย heat/ไม่มี warming?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "เพิ่ม safe active warming/insulation; ลด wet prep/exposure; warmed fluids ตาม plan",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "ไม่",
              "action": {
                "text": "ประเมิน poor perfusion, environment และ device performance",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "ยังต่ำลงหรือฟื้นช้า?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "แก้ systemic contributors; continue monitored recovery และ clinician review",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่",
              "action": {
                "text": "ติดตาม core/skin ป้องกัน overheating/burn",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "ห้าม uncontrolled direct heat หรือปล่อย warming โดยไม่ตรวจผิวหนัง",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "Core temperature trend, skin, HR/BP และ recovery",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Hypothermia, PDF pp. 400–402, 414, 443–444"
        }
      ]
    },
    {
      "id": "airway",
      "title": "Airway / ETT Problems",
      "category": "Airway",
      "trigger": {
        "text": "Resistance, poor chest movement, absent capnogram หรือ desaturation",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ตรวจ airway/ETT และ oxygen ทันที",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "หา kink, displacement, mucus, cuff/connector และ circuit",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ถ้ารักษา patency ไม่ได้ให้ re-establish airway/known-good ventilation system",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "air",
      "nodes": [
        {
          "id": "air",
          "question": {
            "text": "Ventilate ได้/มี effective chest rise?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่ได้",
              "action": {
                "text": "Call help; ตรวจ ETT obstruction/displacement/circuit; re-establish airway ตาม clinician",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ได้",
              "action": {
                "text": "ตรวจ ETT depth, leak และ circuit function",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            }
          ]
        },
        {
          "id": "cause",
          "question": {
            "text": "พบสาเหตุ?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "Mainstem/displacement",
              "action": {
                "text": "แก้ ETT position และยืนยัน clinical/capnographic placement",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "check"
            },
            {
              "label": "Obstruction/leak",
              "action": {
                "text": "แก้ kink/secretions/cuff; replace ETT/system ถ้าจำเป็น",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "check"
            },
            {
              "label": "ไม่พบ",
              "action": {
                "text": "พิจารณา bronchospasm/laryngospasm/pulmonary disease; ventilation assessment",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "check"
            }
          ]
        },
        {
          "id": "check",
          "question": {
            "text": "Airway restored?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "Monitor oxygenation/ventilation และ planned extubation",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่",
              "action": {
                "text": "Escalate advanced airway support; oxygenation ต้องมาก่อนการอ่านคู่มือ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "แมวเสี่ยง laryngospasm; อย่าฝืน repeated traumatic intubation; ไม่ assume probe failure ก่อนดู airway",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "ETCO₂ waveform, chest rise, SpO₂, airway pressure และ BP",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Airway / ETT Problems, PDF pp. 428–434, 443–444"
        }
      ]
    },
    {
      "id": "regurgitation",
      "title": "Regurgitation / Aspiration",
      "category": "Airway",
      "trigger": {
        "text": "เห็น gastric content ในปาก/pharynx หรือ aspiration concern",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ปกป้อง airway/จัด cuffed ETT และ suction visible material",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ตรวจ oxygenation/ventilation และสงสัย aspiration",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ติดตาม recovery respiratory signs; cuff ไม่รับประกันป้องกัน aspiration ทั้งหมด",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "air",
      "nodes": [
        {
          "id": "air",
          "question": {
            "text": "Airway protected/oxygenation adequate?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "Re-establish protected airway + oxygen/ventilation; suction visible material",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "asp"
            },
            {
              "label": "ใช่",
              "action": {
                "text": "รักษา cuff/ETT และ clear pharyngeal contamination ตาม clinical plan",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "asp"
            }
          ]
        },
        {
          "id": "asp",
          "question": {
            "text": "มี respiratory compromise/aspiration suspected?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "Escalate O₂/ventilation, examination/diagnostics และ inpatient monitoring",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "recover"
            },
            {
              "label": "ไม่มี",
              "action": {
                "text": "ยัง monitor respiratory trend; absence of immediate signs ไม่ exclude complication",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "recover"
            }
          ]
        },
        {
          "id": "recover",
          "question": {
            "text": "Ready for extubation?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ยัง",
              "action": {
                "text": "คง airway protection/appropriate depth และต่อ recovery monitoring",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "พร้อม",
              "action": {
                "text": "Extubate ตาม airway/reflex risk; monitor delayed respiratory signs",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "ไม่ extubate ขณะยังป้องกัน airway ไม่ได้; ไม่ทำ lavage แบบ blind โดยไม่มี protected airway/clinician protocol",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "SpO₂/ETCO₂, respiratory effort/sounds, temperature และ delayed aspiration signs",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Regurgitation / Aspiration, PDF pp. 441–442"
        }
      ]
    },
    {
      "id": "hemorrhage",
      "title": "Hemorrhage",
      "category": "Circulation",
      "trigger": {
        "text": "Visible/occult blood loss กับ perfusion decline",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
          },
          {
            "source": "ECC",
            "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
          },
          {
            "source": "AAHA24",
            "locator": "Section 4: acute surgical blood loss"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "แจ้ง surgeon/หยุดแหล่งเลือดออกและขอ help",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
            },
            {
              "source": "ECC",
              "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: acute surgical blood loss"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ประเมิน blood loss, pulse/BP และ oxygen delivery",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
            },
            {
              "source": "ECC",
              "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: acute surgical blood loss"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "วางแผน volume/blood products และตรวจ response ตาม patient",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
            },
            {
              "source": "ECC",
              "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: acute surgical blood loss"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "control",
      "nodes": [
        {
          "id": "control",
          "question": {
            "text": "Source controlled?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
              },
              {
                "source": "ECC",
                "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
              },
              {
                "source": "AAHA24",
                "locator": "Section 4: acute surgical blood loss"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "Surgical hemostasis/pressure และ team escalation; resuscitate พร้อมกัน",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: acute surgical blood loss"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "perf"
            },
            {
              "label": "แล้ว",
              "action": {
                "text": "ประเมิน ongoing/occult loss",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: acute surgical blood loss"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "perf"
            }
          ]
        },
        {
          "id": "perf",
          "question": {
            "text": "Perfusion/oxygen delivery affected?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
              },
              {
                "source": "ECC",
                "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
              },
              {
                "source": "AAHA24",
                "locator": "Section 4: acute surgical blood loss"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "Individualized volume resuscitation/blood product assessment; PCV/TS และ labs ตาม availability",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: acute surgical blood loss"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "repeat"
            },
            {
              "label": "ยังไม่ชัด",
              "action": {
                "text": "Quantify loss/trend และตรวจ serial perfusion/labs",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: acute surgical blood loss"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "repeat"
            }
          ]
        },
        {
          "id": "repeat",
          "question": {
            "text": "ยัง deteriorate/bleeding?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
              },
              {
                "source": "ECC",
                "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
              },
              {
                "source": "AAHA24",
                "locator": "Section 4: acute surgical blood loss"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "Escalate source control/transfusion/coagulation evaluation; CPA route เมื่อ arrest",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: acute surgical blood loss"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่",
              "action": {
                "text": "Monitor loss, volume response และ overload",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
                  },
                  {
                    "source": "AAHA24",
                    "locator": "Section 4: acute surgical blood loss"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "PCV ค่าเดียวช่วง acute loss ไม่ใช้ตัดสิน severity; fluid ไม่ทดแทน oxygen carrying capacity ของ RBC",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
            },
            {
              "source": "ECC",
              "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: acute surgical blood loss"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "Serial BP/pulse, quantified loss, PCV/TS, lactate/coagulation เมื่อ available",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
            },
            {
              "source": "ECC",
              "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
            },
            {
              "source": "AAHA24",
              "locator": "Section 4: acute surgical blood loss"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Hemorrhage, PDF pp. 426–427"
        },
        {
          "source": "ECC",
          "locator": "Ch. 67: blood products and transfusion monitoring, PDF pp. 903–913"
        },
        {
          "source": "AAHA24",
          "locator": "Section 4: acute surgical blood loss"
        }
      ]
    },
    {
      "id": "depth",
      "title": "Anesthetic Depth Problems",
      "category": "Depth / Recovery",
      "trigger": {
        "text": "Movement, light signs หรือ excessive cardiopulmonary depression",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
          },
          {
            "source": "ACVAA25",
            "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ดูหลาย signs ร่วม ventilation/perfusion และ protocol",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
            },
            {
              "source": "ACVAA25",
              "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ตรวจ delivery, ETT/circuit และ recent drug exposure",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
            },
            {
              "source": "ACVAA25",
              "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "แยก analgesia ไม่พอจาก hypnosis/depth; ช่วย airway/perfusion ก่อน",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
            },
            {
              "source": "ACVAA25",
              "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "plane",
      "nodes": [
        {
          "id": "plane",
          "question": {
            "text": "สงสัย light หรือ deep?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
              },
              {
                "source": "ACVAA25",
                "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "Light/movement",
              "action": {
                "text": "หยุด stimulusถ้าทำได้; ตรวจ anesthetic delivery/ETT/circuit และ analgesia",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "Deep/depression",
              "action": {
                "text": "ลด/หยุด depressant ตาม clinician; support ventilation/oxygen/perfusion",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            },
            {
              "label": "ไม่ชัด",
              "action": {
                "text": "ดู eye/jaw/reflex/movement, gas delivery และ drug effects; dissociative signs แตกต่าง",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "reassess"
            }
          ]
        },
        {
          "id": "reassess",
          "question": {
            "text": "สอดคล้อง drug/monitor/patient แล้ว?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
              },
              {
                "source": "ACVAA25",
                "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "ตรวจ measurement/delivery และ reversible systemic problems; ขอ help",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "แล้ว",
              "action": {
                "text": "ปรับ balanced protocol อย่างระวังและ monitor response",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
                  },
                  {
                    "source": "ACVAA25",
                    "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "HR/BP เดี่ยวไม่บอก depth; paralysis ไม่รับประกัน unconsciousness หรือ analgesia",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
            },
            {
              "source": "ACVAA25",
              "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "Depth signs, gas concentration เมื่อมี, BP, ventilation และ temperature",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
            },
            {
              "source": "ACVAA25",
              "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "propofol",
        "alfaxalone",
        "ketamine"
      ],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Anesthetic Depth Problems, PDF pp. 425–426"
        },
        {
          "source": "ACVAA25",
          "locator": "Monitoring depth of anesthesia, journal pp. 378–379"
        }
      ]
    },
    {
      "id": "recovery",
      "title": "Delayed Recovery",
      "category": "Depth / Recovery",
      "trigger": {
        "text": "ฟื้นช้ากว่าที่คาดจาก protocol/duration/patient",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ตรวจ airway, ventilation, oxygenation และ perfusion ก่อน",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ทบทวนยา/time/cumulative exposure และ temperature",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "พิจารณา glucose/metabolic/organ/neurologic causes; reversal เฉพาะ class ที่เหมาะสม",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "abc",
      "nodes": [
        {
          "id": "abc",
          "question": {
            "text": "Airway/ventilation/perfusion adequate?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่",
              "action": {
                "text": "Support airway/O₂/ventilation/circulation และ call help",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            },
            {
              "label": "ใช่",
              "action": {
                "text": "ตรวจ temperature/glucose/drug chart",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "cause"
            }
          ]
        },
        {
          "id": "cause",
          "question": {
            "text": "Contributor ชัดเจน?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "Drug effect",
              "action": {
                "text": "ทบทวน last dose/duration/clearance; specific reversal เมื่อเหมาะ พร้อม pain plan",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "follow"
            },
            {
              "label": "Hypothermia/metabolic",
              "action": {
                "text": "แก้ monitored warming/glucose/electrolytes ตามตรวจพบ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "follow"
            },
            {
              "label": "ไม่ชัด/neurologic signs",
              "action": {
                "text": "Escalate exam/labs/neurologic differential; อย่า assume drug effect อย่างเดียว",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "follow"
            }
          ]
        },
        {
          "id": "follow",
          "question": {
            "text": "หลัง intervention?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ดีขึ้น",
              "action": {
                "text": "ต่อ monitored recovery; เฝ้า resedation และ pain",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่ดีขึ้น",
              "action": {
                "text": "Intensive monitoring/clinician reassessment และ additional diagnostics",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "Reversal ไม่แทน airway care และไม่แก้ยาทุกตัว; quiet patient อาจยังมี pain",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "Ventilation/SpO₂, BP, temperature/glucose, mental status และ pain",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "naloxone",
        "flumazenil",
        "atipamezole"
      ],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Delayed Recovery, PDF pp. 443–444"
        }
      ]
    },
    {
      "id": "anaphylaxis",
      "title": "Anaphylaxis",
      "category": "Emergency",
      "trigger": {
        "text": "Acute deterioration หลัง exposure; shock/respiratory/GI/skin signs",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
          },
          {
            "source": "ECC",
            "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
          },
          {
            "source": "RECOVER26",
            "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "หยุด suspected exposure/infusion และเรียก help",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
            },
            {
              "source": "ECC",
              "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
            },
            {
              "source": "RECOVER26",
              "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "ช่วย airway/O₂/ventilation; ประเมิน BP/perfusion",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
            },
            {
              "source": "ECC",
              "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
            },
            {
              "source": "RECOVER26",
              "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "Epinephrine-based emergency management ตาม severity และ monitored protocol",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
            },
            {
              "source": "ECC",
              "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
            },
            {
              "source": "RECOVER26",
              "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "exposure",
      "nodes": [
        {
          "id": "exposure",
          "question": {
            "text": "Severe airway/circulation compromise?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
              },
              {
                "source": "ECC",
                "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
              },
              {
                "source": "RECOVER26",
                "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "หยุด trigger และ simultaneous airway/oxygen/resuscitation; clinician epinephrine plan",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
                  },
                  {
                    "source": "RECOVER26",
                    "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "epi"
            },
            {
              "label": "ไม่ชัด",
              "action": {
                "text": "ประเมิน exposure timing และหลาย organ systems; skin signs อาจไม่ครบ",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
                  },
                  {
                    "source": "RECOVER26",
                    "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "epi"
            }
          ]
        },
        {
          "id": "epi",
          "question": {
            "text": "Anaphylaxis กับ hemodynamic status?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
              },
              {
                "source": "ECC",
                "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
              },
              {
                "source": "RECOVER26",
                "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่มี hypotension",
              "action": {
                "text": "แนวทาง 2026 เสนอ early IM epinephrine ในโรงพยาบาล; ต้องตรวจ patient/route/preparation",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
                  },
                  {
                    "source": "RECOVER26",
                    "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "follow"
            },
            {
              "label": "มี hypotension",
              "action": {
                "text": "แนวทาง 2026 เสนอ monitored IV epinephrine infusion แทน IV bolus; individualized fluid support",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
                  },
                  {
                    "source": "RECOVER26",
                    "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "follow"
            },
            {
              "label": "CPA",
              "action": {
                "text": "เข้ากระบวนการ RECOVER CPR ทันที; anaphylaxis dosing ไม่ใช่ CPA dosing",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
                  },
                  {
                    "source": "RECOVER26",
                    "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        },
        {
          "id": "follow",
          "question": {
            "text": "หลัง initial response?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
              },
              {
                "source": "ECC",
                "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
              },
              {
                "source": "RECOVER26",
                "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ดีขึ้น",
              "action": {
                "text": "Monitor recurrence/respiration/perfusion และ documented trigger",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
                  },
                  {
                    "source": "RECOVER26",
                    "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่ดีขึ้น",
              "action": {
                "text": "Escalate refractory shock/airway care; evaluate alternate causes และ advanced support",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
                  },
                  {
                    "source": "ECC",
                    "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
                  },
                  {
                    "source": "RECOVER26",
                    "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "2026 ไม่แนะนำ systemic glucocorticoid เป็น routine anaphylaxis treatment; antihistamine ไม่แทน epinephrine/resuscitation",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
            },
            {
              "source": "ECC",
              "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
            },
            {
              "source": "RECOVER26",
              "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "Continuous ECG/BP/SpO₂, ventilation, recurrence และ infusion site",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
            },
            {
              "source": "ECC",
              "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
            },
            {
              "source": "RECOVER26",
              "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "epinephrine"
      ],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: Anaphylaxis, PDF pp. 427–429"
        },
        {
          "source": "ECC",
          "locator": "Ch. 68, PDF pp. 915–917: type I hypersensitivity and anaphylaxis"
        },
        {
          "source": "RECOVER26",
          "locator": "Table 1 FA-02/FA-30; sections 3.5–3.6 and clinical guidance"
        }
      ]
    },
    {
      "id": "arrest",
      "title": "CPA / Cardiopulmonary Arrest",
      "category": "Emergency",
      "trigger": {
        "text": "Unresponsive + apneic patient: rapid clinical arrest assessment; อย่ารอ ECG assistant",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
          },
          {
            "source": "RECOVER24",
            "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "เรียก CPR team; เริ่ม BLS ตาม RECOVER เมื่อเข้า arrest criteria",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
            },
            {
              "source": "RECOVER24",
              "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "Compressions + airway/oxygen/ventilation; หยุด anesthetic delivery",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
            },
            {
              "source": "RECOVER24",
              "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        },
        {
          "text": "เตรียม ECG/ETCO₂ และ rhythm-directed ALS โดยไม่ชะลอ BLS",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
            },
            {
              "source": "RECOVER24",
              "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "start": "bls",
      "nodes": [
        {
          "id": "bls",
          "question": {
            "text": "Suspected CPA?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
              },
              {
                "source": "RECOVER24",
                "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ใช่",
              "action": {
                "text": "เริ่ม BLS ทันที; ไม่เสียเวลาคลำ pulse ใน apneic/unresponsive patient; compressions 100–120/min",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "rhythm"
            },
            {
              "label": "ยังไม่เข้าเกณฑ์",
              "action": {
                "text": "Immediate clinical airway/perfusion assessment; ongoing monitoring",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        },
        {
          "id": "rhythm",
          "question": {
            "text": "Rhythm ระหว่าง brief planned assessment?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
              },
              {
                "source": "RECOVER24",
                "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "VF/pulseless VT",
              "action": {
                "text": "Shockable: defibrillation โดย trained clinician และ return compressions; full RECOVER algorithm",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "follow"
            },
            {
              "label": "PEA/asystole",
              "action": {
                "text": "Nonshockable: continue BLS/ALS/reversible causes; ไม่ defibrillate asystole",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "follow"
            },
            {
              "label": "Uncertain/artifact",
              "action": {
                "text": "ตรวจ electrodes/lead และ patient อย่างรวดเร็ว; อย่าชะลอ compressions",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": "follow"
            }
          ]
        },
        {
          "id": "follow",
          "question": {
            "text": "หลัง cycle/possible ROSC?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
              },
              {
                "source": "RECOVER24",
                "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
              }
            ],
            "status": "editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "No ROSC",
              "action": {
                "text": "BLS cycles/reassessment ตาม RECOVER; rhythm-specific ALS และ reversible causes",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ROSC",
              "action": {
                "text": "Post-arrest intensive care/monitoring และ evaluate cause/recurrence",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
                  }
                ],
                "status": "editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "avoid": [
        {
          "text": "ECG ไม่ยืนยัน pulse; 2024 ไม่แนะนำ routine high-dose epinephrine; atropine ถ้าใช้ใน CPR ไม่ให้ซ้ำ; คู่มือนี้ไม่มี dose table",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
            },
            {
              "source": "RECOVER24",
              "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "monitor": [
        {
          "text": "ECG during planned pauses, ETCO₂/perfusion markers; ROSC ต้อง clinical reassessment",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
            },
            {
              "source": "RECOVER24",
              "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
            }
          ],
          "status": "editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "epinephrine",
        "naloxone",
        "flumazenil",
        "atipamezole"
      ],
      "references": [
        {
          "source": "TECH",
          "locator": "Chapter 13: CPA / Cardiopulmonary Arrest, PDF pp. 435–441"
        },
        {
          "source": "RECOVER24",
          "locator": "Table 1 MON-11, BLS-07, ALS-08; Box 1 and CPR algorithm"
        }
      ]
    }
  ],
  "rhythms": [
    {
      "id": "sinus",
      "name": "Sinus rhythm",
      "features": {
        "text": "Sinus P ที่สม่ำเสมอ; P:QRS 1:1; QRS morphology consistent",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus rhythm, PDF pp. 125–126"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "ไม่สรุปว่า hemodynamically normal จาก ECG เพียงอย่างเดียว",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus rhythm, PDF pp. 125–126"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "แปล rate ร่วม species, size, drugs, depth และ perfusion",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus rhythm, PDF pp. 125–126"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Sinus rhythm, PDF pp. 125–126"
        }
      ]
    },
    {
      "id": "sinus_brady",
      "name": "Sinus bradycardia",
      "features": {
        "text": "Sinus pattern พร้อม rate ต่ำตาม patient context",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus bradycardia, PDF pp. 129–130"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "Rate ต่ำมี significance เมื่อ perfusion เสีย ไม่ใช่ตัวเลขเดี่ยว",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus bradycardia, PDF pp. 129–130"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "ดู opioid/α2/vagal stimulation/hypothermia; รักษาตาม BP/perfusion",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus bradycardia, PDF pp. 129–130"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Sinus bradycardia, PDF pp. 129–130"
        }
      ]
    },
    {
      "id": "sinus_tachy",
      "name": "Sinus tachycardia",
      "features": {
        "text": "Sinus P:QRS 1:1 พร้อม rate สูง; อาจ gradual change",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus tachycardia, PDF pp. 162–163"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "อาจเป็น compensatory response; การกด rate โดยไม่แก้สาเหตุอาจไม่เหมาะ",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus tachycardia, PDF pp. 162–163"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "ตรวจ pain, hypoxemia/hypercapnia, volume และ drugs",
        "refs": [
          {
            "source": "ECG",
            "locator": "Sinus tachycardia, PDF pp. 162–163"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Sinus tachycardia, PDF pp. 162–163"
        }
      ]
    },
    {
      "id": "sinus_arrhythmia",
      "name": "Respiratory sinus arrhythmia",
      "features": {
        "text": "Sinus P:QRS 1:1 แต่ R–R เปลี่ยนสัมพันธ์ respiration",
        "refs": [
          {
            "source": "ECG",
            "locator": "Respiratory sinus arrhythmia, PDF pp. 131–135"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "พบได้ในสุนัข; irregularity อย่างเดียวไม่แปลว่า AF",
        "refs": [
          {
            "source": "ECG",
            "locator": "Respiratory sinus arrhythmia, PDF pp. 131–135"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "ดู respiratory pattern/longer strip; แยก pauses และ ectopy",
        "refs": [
          {
            "source": "ECG",
            "locator": "Respiratory sinus arrhythmia, PDF pp. 131–135"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Respiratory sinus arrhythmia, PDF pp. 131–135"
        }
      ]
    },
    {
      "id": "apc",
      "name": "Atrial premature complex",
      "features": {
        "text": "Early beat มี P morphology ต่าง/ซ้อน T; มัก narrow QRS แต่ aberrancy ได้",
        "refs": [
          {
            "source": "ECG",
            "locator": "Atrial premature complex, PDF pp. 177–185"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "Frequency/coupling/perfusion ช่วยประเมิน clinical relevance",
        "refs": [
          {
            "source": "ECG",
            "locator": "Atrial premature complex, PDF pp. 177–185"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "ตรวจ long strip/multiple leads และ reversible drivers",
        "refs": [
          {
            "source": "ECG",
            "locator": "Atrial premature complex, PDF pp. 177–185"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Atrial premature complex, PDF pp. 177–185"
        }
      ]
    },
    {
      "id": "svt",
      "name": "Supraventricular tachycardia pattern",
      "features": {
        "text": "Rapid rhythm มัก narrow QRS; P อาจซ่อน/ผิดรูป; wide aberrancy เป็นไปได้",
        "refs": [
          {
            "source": "ECG",
            "locator": "Supraventricular tachycardia pattern, PDF pp. 192–212"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "Rapid rate อาจลด ventricular filling/CO; unstable ต้องรักษาโดย clinician",
        "refs": [
          {
            "source": "ECG",
            "locator": "Supraventricular tachycardia pattern, PDF pp. 192–212"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "อย่าแยก SVT/VT จาก width อย่างเดียว; ขอ ECG review",
        "refs": [
          {
            "source": "ECG",
            "locator": "Supraventricular tachycardia pattern, PDF pp. 192–212"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Supraventricular tachycardia pattern, PDF pp. 192–212"
        }
      ]
    },
    {
      "id": "af",
      "name": "Atrial fibrillation pattern",
      "features": {
        "text": "โดยทั่วไป irregularly irregular, ไม่มี consistent P; baseline fibrillatory activity",
        "refs": [
          {
            "source": "ECG",
            "locator": "Atrial fibrillation pattern, PDF pp. 222–224"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "Pulse deficit/poor filling อาจลด CO; classification มี exceptions",
        "refs": [
          {
            "source": "ECG",
            "locator": "Atrial fibrillation pattern, PDF pp. 222–224"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "แยก frequent ectopy/artifact; ดู ventricular rate และ underlying cardiac disease",
        "refs": [
          {
            "source": "ECG",
            "locator": "Atrial fibrillation pattern, PDF pp. 222–224"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Atrial fibrillation pattern, PDF pp. 222–224"
        }
      ]
    },
    {
      "id": "av1",
      "name": "First-degree AV block",
      "features": {
        "text": "P:QRS 1:1 และ PR prolonged ตาม calibrated species-specific reference",
        "refs": [
          {
            "source": "ECG",
            "locator": "First-degree AV block, PDF pp. 255–257"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "ทุก P ยัง conduct; significance ขึ้นกับ underlying context",
        "refs": [
          {
            "source": "ECG",
            "locator": "First-degree AV block, PDF pp. 255–257"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "ตรวจยา/vagal effects และ serial PR; ไม่ auto-classify จาก PR ไม่ทราบ calibration",
        "refs": [
          {
            "source": "ECG",
            "locator": "First-degree AV block, PDF pp. 255–257"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "First-degree AV block, PDF pp. 255–257"
        }
      ]
    },
    {
      "id": "av2",
      "name": "Second-degree AV block",
      "features": {
        "text": "บาง P ไม่ตามด้วย QRS; PR pattern ต้องดูหลาย cycle",
        "refs": [
          {
            "source": "ECG",
            "locator": "Second-degree AV block, PDF pp. 257–271"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "High-grade block/slow ventricular response อาจลด CO",
        "refs": [
          {
            "source": "ECG",
            "locator": "Second-degree AV block, PDF pp. 257–271"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "แยก nonconducted APC/SA pause; 2:1 block ไม่ควรเรียก Mobitz I/II จาก ratio อย่างเดียว",
        "refs": [
          {
            "source": "ECG",
            "locator": "Second-degree AV block, PDF pp. 257–271"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Second-degree AV block, PDF pp. 257–271"
        }
      ]
    },
    {
      "id": "av3",
      "name": "AV dissociation / possible complete block",
      "features": {
        "text": "P และ QRS independent; ต้องแยก complete block จาก usurpation/isorhythmic dissociation",
        "refs": [
          {
            "source": "ECG",
            "locator": "AV dissociation / possible complete block, PDF pp. 274–281"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "AV dissociation อย่างเดียวไม่พิสูจน์ third-degree block",
        "refs": [
          {
            "source": "ECG",
            "locator": "AV dissociation / possible complete block, PDF pp. 274–281"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "Long strip/multiple leads; clinician review และ pacing consideration ตาม perfusion",
        "refs": [
          {
            "source": "ECG",
            "locator": "AV dissociation / possible complete block, PDF pp. 274–281"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "AV dissociation / possible complete block, PDF pp. 274–281"
        }
      ]
    },
    {
      "id": "vpc",
      "name": "Ventricular premature complex",
      "features": {
        "text": "Premature abnormal wide QRS มักไม่มี preceding conducted P; pause/fusion ช่วยตีความ",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular premature complex, PDF pp. 317–320"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "ต้องประเมิน perfusion/complexity ไม่ treat ทุก VPC อัตโนมัติ",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular premature complex, PDF pp. 317–320"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "แยก SV beat with aberrancy; ประเมิน recurrence, triggers และ pulse deficit",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular premature complex, PDF pp. 317–320"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Ventricular premature complex, PDF pp. 317–320"
        }
      ]
    },
    {
      "id": "vt",
      "name": "Ventricular tachycardia pattern",
      "features": {
        "text": "Run ของ ventricular complexes; broad abnormal morphology; capture/fusion/AV dissociation อาจช่วย",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular tachycardia pattern, PDF pp. 345–361"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "VT with pulse กับ pulseless VT มี clinical pathway ต่างกัน",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular tachycardia pattern, PDF pp. 345–361"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "Wide rapid rhythm อาจเป็น SVT with aberrancy; pulse/perfusion สำคัญ; pulseless VT ใช้ CPR branch",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular tachycardia pattern, PDF pp. 345–361"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Ventricular tachycardia pattern, PDF pp. 345–361"
        }
      ]
    },
    {
      "id": "vf",
      "name": "Ventricular fibrillation pattern",
      "features": {
        "text": "Chaotic undulation ไม่มี organized QRS; exclude electrical artifact",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular fibrillation pattern, PDF pp. 369–373"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "ไม่มี effective ventricular pumping ใน true VF",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular fibrillation pattern, PDF pp. 369–373"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "ถ้า clinical CPA ใช้ shockable RECOVER pathway; อย่ารอ educational assistant",
        "refs": [
          {
            "source": "ECG",
            "locator": "Ventricular fibrillation pattern, PDF pp. 369–373"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Ventricular fibrillation pattern, PDF pp. 369–373"
        }
      ]
    },
    {
      "id": "asystole",
      "name": "Asystole pattern",
      "features": {
        "text": "ไม่มี ventricular electrical activity; exclude lead disconnect/low gain",
        "refs": [
          {
            "source": "ECG",
            "locator": "Asystole pattern, PDF pp. 314–316"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "Flat line ไม่รับประกัน asystole หาก lead/monitor failure",
        "refs": [
          {
            "source": "ECG",
            "locator": "Asystole pattern, PDF pp. 314–316"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "clinical CPA → nonshockable CPR pathway; ตรวจ leads โดยไม่ delay BLS",
        "refs": [
          {
            "source": "ECG",
            "locator": "Asystole pattern, PDF pp. 314–316"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Asystole pattern, PDF pp. 314–316"
        }
      ]
    },
    {
      "id": "pea",
      "name": "Pulseless electrical activity",
      "features": {
        "text": "Organized ECG activity แต่ไม่มี effective mechanical circulation",
        "refs": [
          {
            "source": "ECG",
            "locator": "Pulseless electrical activity, PDF pp. 314–315"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "Electrical rhythm ไม่ยืนยัน perfusion",
        "refs": [
          {
            "source": "ECG",
            "locator": "Pulseless electrical activity, PDF pp. 314–315"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "เป็น clinical assessment; waveform อย่างเดียวระบุไม่ได้; nonshockable RECOVER pathway",
        "refs": [
          {
            "source": "ECG",
            "locator": "Pulseless electrical activity, PDF pp. 314–315"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Pulseless electrical activity, PDF pp. 314–315"
        }
      ]
    },
    {
      "id": "artifact",
      "name": "Artifact / indeterminate",
      "features": {
        "text": "Noise/lead motion/poor contact ทำให้ rhythm ดูผิดรูปหรือ irregular",
        "refs": [
          {
            "source": "ECG",
            "locator": "Artifact / indeterminate, PDF pp. 220, 31–35"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "significance": {
        "text": "ต้องแยก technical signal จาก patient event",
        "refs": [
          {
            "source": "ECG",
            "locator": "Artifact / indeterminate, PDF pp. 220, 31–35"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Hemodynamic impact and arrhythmias, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "anesthesia": {
        "text": "ตรวจ electrodes/gain/speed และ correlate patient/pulse; ถ้า CPA ไม่ delay BLS",
        "refs": [
          {
            "source": "ECG",
            "locator": "Artifact / indeterminate, PDF pp. 220, 31–35"
          },
          {
            "source": "TECH",
            "locator": "Chapter 13: Rate/rhythm abnormalities, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      },
      "references": [
        {
          "source": "ECG",
          "locator": "Artifact / indeterminate, PDF pp. 220, 31–35"
        }
      ]
    }
  ],
  "workflow": [
    {
      "id": "rate",
      "label": "Rate",
      "claim": {
        "text": "บันทึก observed ventricular rate; ตรวจ speed/timebase และ pulse agreement",
        "refs": [
          {
            "source": "ECG",
            "locator": "Paper speed and rate, PDF pp. 34–35"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      }
    },
    {
      "id": "regularity",
      "label": "Regularity",
      "claim": {
        "text": "ดู R–R หลาย cycle; regular, respiratory-phasic หรือ irregularly irregular",
        "refs": [
          {
            "source": "ECG",
            "locator": "Regularity, PDF pp. 131–135, 222–224"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      }
    },
    {
      "id": "p",
      "label": "P wave",
      "claim": {
        "text": "มี/ไม่มี/ไม่แน่ใจ; morphology เหมือนกันหรือซ่อนใน T/QRS",
        "refs": [
          {
            "source": "ECG",
            "locator": "P wave and atrial activity, PDF pp. 31–32, 177–185"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      }
    },
    {
      "id": "relation",
      "label": "P:QRS",
      "claim": {
        "text": "ทุก P conduct หรือมี dropped QRS, variable association/AV dissociation",
        "refs": [
          {
            "source": "ECG",
            "locator": "AV relationship, PDF pp. 254–281"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      }
    },
    {
      "id": "qrs",
      "label": "QRS morphology",
      "claim": {
        "text": "เปรียบ width/shape กับ sinus baseline; verify lead/gain/speed; aberrancy เป็นได้",
        "refs": [
          {
            "source": "ECG",
            "locator": "Morphology and wide-complex SVT, PDF pp. 31–35, 113–118"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      }
    },
    {
      "id": "rhythm",
      "label": "Rhythm",
      "claim": {
        "text": "เสนอ patterns ที่ต้องทบทวน; แสดงเหตุผล/ข้อมูลขาด ไม่ออก final diagnosis",
        "refs": [
          {
            "source": "ECG",
            "locator": "Rhythm differential, PDF pp. 125–373"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      }
    },
    {
      "id": "hemodynamics",
      "label": "Hemodynamic significance",
      "claim": {
        "text": "ตรวจ pulse/BP/perfusion; ECG rate ไม่เท่ากับ effective cardiac output",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Rhythm significance, PDF pp. 427–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      }
    },
    {
      "id": "anesthesia",
      "label": "Anesthesia considerations",
      "claim": {
        "text": "ตรวจ depth/drugs/oxygenation/ventilation, temperature/electrolytes และ surgical stimulus",
        "refs": [
          {
            "source": "TECH",
            "locator": "Chapter 13: Reversible contributors, PDF pp. 428–430"
          }
        ],
        "status": "editorial synthesis; clinician verification required"
      }
    }
  ],
  "updates": [
    {
      "text": "ACVAA 2025 เสริม continuous ECG/capnography และ patient observations; reference guidance ไม่เปลี่ยน configured alarm thresholds",
      "refs": [
        {
          "source": "ACVAA25",
          "locator": "Table 1; circulation/ventilation monitoring"
        }
      ],
      "status": "editorial synthesis; clinician verification required"
    },
    {
      "text": "RECOVER 2024 supersedes older CPA high-dose epinephrine advice; CPR atropine หากใช้ให้ครั้งเดียว",
      "refs": [
        {
          "source": "RECOVER24",
          "locator": "Box 1; Table 1 ALS-08, ALS-09 and ALS-19"
        }
      ],
      "status": "editorial synthesis; clinician verification required"
    },
    {
      "text": "RECOVER 2026 allergy/anaphylaxis แยก uncomplicated allergy จาก anaphylaxis; routine glucocorticoids ไม่แนะนำสำหรับ anaphylaxis",
      "refs": [
        {
          "source": "RECOVER26",
          "locator": "Table 1 FA-02/FA-30"
        }
      ],
      "status": "editorial synthesis; clinician verification required"
    },
    {
      "text": "งาน retrospective 2025 ใน dogs ที่ทำ pulmonic valvuloplasty พบ hypotension ต่างระหว่าง TIVA/PIVA; small selected cohort มี confounding ไม่ใช้เปลี่ยน protocol/calculator อัตโนมัติ",
      "refs": [
        {
          "source": "RVC25",
          "locator": "Abstract; Discussion; 44 dogs retrospective study"
        }
      ],
      "status": "editorial synthesis; clinician verification required"
    }
  ]
};
function freeze(x){if(x&&typeof x==="object"){Object.values(x).forEach(freeze);Object.freeze(x)}return x}
root.ANESVET_KNOWLEDGE_DATA=freeze(data);if(typeof module!=="undefined"&&module.exports)module.exports=root.ANESVET_KNOWLEDGE_DATA;
})(typeof globalThis!=="undefined"?globalThis:this);
