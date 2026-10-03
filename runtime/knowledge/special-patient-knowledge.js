(function(root){
"use strict";
const data={
  "version": "17.4.2",
  "contentVersion": "2026-10-01.brachy.1",
  "reviewStatus": "Source-based editorial education; independent clinical review pending",
  "sources": {
    "RESP25": {
      "title": "Canine and Feline Respiratory Medicine, 3rd edition (Lynelle R. Johnson, 2025)",
      "kind": "project textbook",
      "filename": "06-Canine-and-Feline-Respiratory-Medicine-3rd-Edition-VetBooks.ir-.pdf",
      "sha256": "a13f46cf8aa0a19614d23ab7052c5fa9de1cee07847109789bbbd80ff2de115f",
      "accessed": "2026-10-01",
      "pageConvention": "1-indexed PDF file page"
    },
    "AAHA_BRACHY25": {
      "title": "Singler / Weil, 2025: Anesthetic considerations for brachycephalic dog breeds",
      "url": "https://www.aaha.org/trends-magazine/publications/anesthetic-considerations-for-brachycephalic-dog-breeds/",
      "kind": "specialist expert commentary; not an official AAHA position/guideline",
      "accessed": "2026-10-01"
    },
    "BOAS24": {
      "title": "Filipas et al. 2024: Postoperative respiratory complications after BOAS surgery, 199 cases",
      "url": "https://doi.org/10.1111/jsap.13707",
      "kind": "original retrospective observational study",
      "accessed": "2026-10-01"
    },
    "BOAS25": {
      "title": "Webb et al. 2025: Pre-operative management protocol and major postoperative complications in BOAS surgery",
      "url": "https://doi.org/10.1111/jsap.13881",
      "kind": "original retrospective study",
      "accessed": "2026-10-01"
    }
  },
  "guides": [
    {
      "id": "brachycephalic",
      "title": "สุนัขหน้าสั้น · Brachycephalic Anesthesia / BOAS",
      "category": "Special patients",
      "keywords": [
        "brachycephalic",
        "BOAS",
        "Bulldog",
        "French Bulldog",
        "Pug",
        "บูลด็อก",
        "เฟรนช์บูลด็อก",
        "ปั๊ก",
        "หน้าสั้น",
        "ถอดท่อ",
        "extubation"
      ],
      "trigger": {
        "text": "คู่มือวางแผนสุนัขหน้าสั้นสำหรับทุก procedure: ประเมิน BOAS/โรคร่วม เตรียม difficult airway และให้ recovery มีคนเฝ้าและแผนใส่ท่อซ้ำ",
        "refs": [
          {
            "source": "FUND",
            "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
          },
          {
            "source": "RESP25",
            "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
          }
        ],
        "status": "source-based editorial synthesis; clinician verification required"
      },
      "quick": [
        {
          "text": "ประเมิน breathing / BOAS และ GI history ก่อนเริ่ม; หาก distress ให้ stabilize และทบทวน elective procedure",
          "refs": [
            {
              "source": "FUND",
              "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
            },
            {
              "source": "RESP25",
              "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
            }
          ],
          "status": "source-based editorial synthesis; clinician verification required"
        },
        {
          "text": "เตรียมคน O₂, ETT หลายขนาด, laryngoscope, suction และ rescue plan ก่อน sedation / induction",
          "refs": [
            {
              "source": "FUND",
              "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
            },
            {
              "source": "TECH",
              "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
            }
          ],
          "status": "source-based editorial synthesis; clinician verification required"
        },
        {
          "text": "ถอดท่อเมื่อ awake และ airway / ventilation พร้อม; เฝ้าฟื้นใกล้ชิดและพร้อม reintubate ไม่ใช้การกลืนครั้งแรกเพียงอย่างเดียว",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
            },
            {
              "source": "FUND",
              "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
            }
          ],
          "status": "source-based editorial synthesis; clinician verification required"
        }
      ],
      "start": "triage",
      "nodes": [
        {
          "id": "triage",
          "question": {
            "text": "ขณะนี้มี respiratory distress หรือ airway compromise หรือไม่?",
            "refs": [
              {
                "source": "FUND",
                "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
              },
              {
                "source": "RESP25",
                "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
              }
            ],
            "status": "source-based editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "มี / ไม่คงที่",
              "action": {
                "text": "หยุดแผน elective; stabilize และจัดการ airway/oxygenation พร้อมขอความช่วยเหลือ ก่อนกลับมาวางแผน",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "RESP25",
                    "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "rescue"
            },
            {
              "label": "ไม่มี acute distress",
              "action": {
                "text": "ประเมิน BOAS severity, GI history, โรคร่วม และความพร้อมทีม",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "RESP25",
                    "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "ready"
            }
          ]
        },
        {
          "id": "ready",
          "question": {
            "text": "ทีมเฝ้าระวังและอุปกรณ์ airway rescue พร้อมก่อน sedation หรือไม่?",
            "refs": [
              {
                "source": "FUND",
                "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
              },
              {
                "source": "TECH",
                "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
              },
              {
                "source": "FUND",
                "locator": "Patient preparation and individualized fasting, PDF file p. 45; BOAS/GI disease, PDF file pp. 398–399"
              }
            ],
            "status": "source-based editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ยังไม่พร้อม",
              "action": {
                "text": "เตรียมคน O₂, ETT หลายขนาด, laryngoscope, suction, ventilation และ emergency airway plan; ทบทวนสถานที่หรือส่งต่อเมื่อเกินทรัพยากร",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "FUND",
                    "locator": "Patient preparation and individualized fasting, PDF file p. 45; BOAS/GI disease, PDF file pp. 398–399"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "ready"
            },
            {
              "label": "พร้อม",
              "action": {
                "text": "วาง fasting, analgesia และ premedication เป็นรายตัว; preoxygenate และเฝ้าดู airway ต่อเนื่อง",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "FUND",
                    "locator": "Patient preparation and individualized fasting, PDF file p. 45; BOAS/GI disease, PDF file pp. 398–399"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "induction"
            }
          ]
        },
        {
          "id": "induction",
          "question": {
            "text": "หลัง induction ยืนยัน secure airway และ ventilation ได้หรือไม่?",
            "refs": [
              {
                "source": "FUND",
                "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
              },
              {
                "source": "TECH",
                "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
              }
            ],
            "status": "source-based editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่ได้ / intubation ยาก",
              "action": {
                "text": "ขอ help, รักษา oxygenation, หลีกเลี่ยงการใส่ท่อซ้ำที่ทำให้เกิด trauma และใช้ difficult-airway rescue plan",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "rescue"
            },
            {
              "label": "ได้",
              "action": {
                "text": "ตรวจ capnogram, cuff, tube depth และ circuit; monitor ตาม protocol และเตรียม recovery ก่อนจบ procedure",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "extubation"
            }
          ]
        },
        {
          "id": "extubation",
          "question": {
            "text": "พร้อมถอดท่อจากการประเมินผู้ป่วยและ rescue readiness หรือไม่?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
              },
              {
                "source": "FUND",
                "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
              }
            ],
            "status": "source-based editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ยังไม่พร้อม",
              "action": {
                "text": "คง airway support ที่เหมาะสม; reassess awake/protective responses, ventilation, temperature และ residual drugs",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "extubation"
            },
            {
              "label": "พร้อม",
              "action": {
                "text": "ถอดท่อโดยมีคนเฝ้า O₂, suction, ETT และยาสำหรับใส่ซ้ำ พร้อม clinician; ไม่ใช้การกลืนครั้งแรกเพียงอย่างเดียว",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "observe"
            }
          ]
        },
        {
          "id": "observe",
          "question": {
            "text": "หลังถอดท่อ breathing และ oxygenation คงที่หรือไม่?",
            "refs": [
              {
                "source": "TECH",
                "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
              },
              {
                "source": "FUND",
                "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
              },
              {
                "source": "RESP25",
                "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
              }
            ],
            "status": "source-based editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "ไม่ / effortเพิ่ม / stridorแย่",
              "action": {
                "text": "แยก obstruction จาก pulmonary/aspiration/depth แล้วจัดการ airway; เตรียม reintubation",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "RESP25",
                    "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "rescue"
            },
            {
              "label": "คงที่",
              "action": {
                "text": "ติดตาม effort, SpO₂, temperature, mentation และ pain; พิจารณาระดับ observation ตามความเสี่ยง",
                "refs": [
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "RESP25",
                    "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": "disposition"
            }
          ]
        },
        {
          "id": "rescue",
          "question": {
            "text": "ปัญหาหลักที่กำลังจัดการคืออะไร?",
            "refs": [
              {
                "source": "FUND",
                "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
              },
              {
                "source": "TECH",
                "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
              },
              {
                "source": "RESP25",
                "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
              },
              {
                "source": "RECOVER24",
                "locator": "CPR algorithm"
              }
            ],
            "status": "source-based editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "Airway obstruction / ETT",
              "action": {
                "text": "เปิด Airway / ETT และ Hypoxemia guide; clinician จัดการ definitive airway / ventilation",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "RESP25",
                    "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "CPR algorithm"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "Regurgitation / aspiration",
              "action": {
                "text": "เปิด Regurgitation / Aspiration guide; ปกป้อง airway และประเมิน pulmonary injury",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "RESP25",
                    "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "CPR algorithm"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "No effective circulation",
              "action": {
                "text": "เรียกทีมและใช้ CPA / RECOVER; อย่ารอ workflow นี้",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "RESP25",
                    "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                  },
                  {
                    "source": "RECOVER24",
                    "locator": "CPR algorithm"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        },
        {
          "id": "disposition",
          "question": {
            "text": "มี severe BOAS, airway surgery หรือ recovery complication หรือไม่?",
            "refs": [
              {
                "source": "FUND",
                "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
              },
              {
                "source": "TECH",
                "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
              },
              {
                "source": "RESP25",
                "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
              }
            ],
            "status": "source-based editorial synthesis; clinician verification required"
          },
          "branches": [
            {
              "label": "มี / ยังไม่แน่ใจ",
              "action": {
                "text": "พิจารณา extended observation, ICU หรือ referral; clinician ประเมินซ้ำและเตรียม handoff",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "RESP25",
                    "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": null
            },
            {
              "label": "ไม่มีและclinicianยืนยันคงที่",
              "action": {
                "text": "ใช้เกณฑ์ discharge ตามผู้ป่วยพร้อม owner red flags; ไม่ใช้เวลาที่ผ่านไปอย่างเดียว",
                "refs": [
                  {
                    "source": "FUND",
                    "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                  },
                  {
                    "source": "TECH",
                    "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                  },
                  {
                    "source": "RESP25",
                    "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                  }
                ],
                "status": "source-based editorial synthesis; clinician verification required"
              },
              "next": null
            }
          ]
        }
      ],
      "sections": [
        {
          "id": "risk",
          "title": "1. ประเมินก่อนวางยา · หน้าสั้นไม่ได้บอกความรุนแรงทั้งหมด",
          "claims": [
            {
              "text": "BOAS = กลุ่มความผิดปกติที่เพิ่มแรงต้านทางเดินหายใจในสุนัขหน้าสั้น เช่น Bulldog, French Bulldog, Pug และ Boston Terrier; ประเมินอาการจริงและโรคร่วม ไม่ตัดสินความเสี่ยงจากชื่อพันธุ์เพียงอย่างเดียว",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ถามเสียงกรน/stridor, หายใจแรงขณะพัก, ทนออกกำลังหรืออากาศร้อนไม่ได้, sleep-related breathing difficulty, cyanosis/เป็นลม และประวัติใส่ท่อหรือฟื้นสลบยาก; เสียงกรนไม่ใช่หลักฐานว่า airway ปลอดภัย",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ถาม regurgitation/vomiting, reflux, ไอหลังอาหารและ aspiration เดิม; ตรวจ BCS, อุณหภูมิ, hydration, cardiopulmonary status และจัด ASA จากสภาพผู้ป่วย",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "หาก respiratory distress ขณะพัก, hyperthermia, สงสัย aspiration หรือโรคร่วมไม่คงที่ ให้ stabilize และทบทวนความเหมาะสม/สถานที่ของ elective procedure; เลือก imaging/blood gas/การตรวจอื่นตามอาการและความเสี่ยง ไม่บังคับตรวจทุกอย่างเพราะหน้าสั้น",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "fasting",
          "title": "2. การเตรียมและงดอาหาร",
          "claims": [
            {
              "text": "จัดช่วงงดอาหาร/น้ำตามอายุ โรคร่วม ประวัติ regurgitation และชนิด procedure; ไม่ใช้คำสั่งอดนานแบบเดียวกับทุกตัว และไม่ถือว่าการอดอาหารทำให้ความเสี่ยง reflux หมดไป",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Patient preparation and individualized fasting, PDF file p. 45; BOAS/GI disease, PDF file pp. 398–399"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "วางแผนจัดการ GI signs ก่อน elective anesthesia; antiemetic และ acid suppression มีเป้าหมายต่างกันและไม่แทน airway protection",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Patient preparation and individualized fasting, PDF file p. 45; BOAS/GI disease, PDF file pp. 398–399"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ใช้พื้นที่สงบและลดการจับบังคับ/ความร้อน; หากไม่ทน mask ให้เลือกวิธีให้ออกซิเจนที่ stress ต่ำ โดยประเมินว่ามีประสิทธิภาพเพียงพอจริง",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Patient preparation and individualized fasting, PDF file p. 45; BOAS/GI disease, PDF file pp. 398–399"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "equipment",
          "title": "3. เตรียม airway ก่อนให้ยาสงบหรือ induction",
          "claims": [
            {
              "text": "มีผู้เฝ้าหายใจเฉพาะเคสและ clinician พร้อมจัดการ difficult airway ตั้งแต่เริ่ม sedation จนฟื้น; เตรียมออกซิเจนและอุปกรณ์ก่อนเริ่ม ไม่รอให้เกิด obstruction แล้วค่อยรวบรวม",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "เตรียม cuffed ETT หลายขนาด รวมขนาดเล็กกว่าที่คาดจากน้ำหนัก; ตรวจ cuff, laryngoscope/แสง, suction และ circuit/ventilation readiness",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "กำหนดผู้ใส่ท่อ ผู้ช่วย วิธีขอความช่วยเหลือ และทางเลือกหาก intubate/oxygenate ไม่ได้; severe BOAS หรือเคสผ่าตัด airway ต้องมีแผน emergency airway/temporary tracheostomy กับทีมที่ทำได้",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "เตรียมยาสำหรับ reinduction/reintubation ตาม protocol ที่ clinician review แล้ว และคง IV access ที่ใช้งานได้; คู่มือนี้ไม่คำนวณหรือใช้ยาให้อัตโนมัติ",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "drugs",
          "title": "4. Premedication / analgesia · เลือกตามผู้ป่วย",
          "claims": [
            {
              "text": "Balance ลด stress กับการลด pharyngeal tone: sedation อาจทำให้ airway อุดกั้น โดยเฉพาะมี stridor ก่อนให้ยา; ไม่ปล่อย sedated brachycephalic dog ไว้ลำพัง",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 3, Sedative/alpha-2 effects and airway cautions; PDF file pp. 83–87"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "BSAVA",
                  "locator": "Atropine monograph, PDF pp. 53–54; Carprofen monograph, PDF pp. 79–81; contraindications and interactions"
                },
                {
                  "source": "AAHA_BRACHY25",
                  "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "เลือก multimodal analgesia ตามความเจ็บปวดและโรคร่วม เพื่อลดความต้องการยาสลบ; เฝ้าระวัง hypoventilation, apnea, hypotension และ emesis จากยาที่เลือก",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 3, Sedative/alpha-2 effects and airway cautions; PDF file pp. 83–87"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "BSAVA",
                  "locator": "Atropine monograph, PDF pp. 53–54; Carprofen monograph, PDF pp. 79–81; contraindications and interactions"
                },
                {
                  "source": "AAHA_BRACHY25",
                  "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "Alpha-2 agonist ต้องพิจารณา respiratory/cardiovascular reserve, sedation depth และแผน rescue; ตำราเตือน airway/cardiovascular effects และ expert practice บางแห่งใช้แบบคัดเลือก จึงไม่ใช้ชื่อพันธุ์เป็นคำสั่งให้หรือห้ามยาอัตโนมัติ",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 3, Sedative/alpha-2 effects and airway cautions; PDF file pp. 83–87"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "BSAVA",
                  "locator": "Atropine monograph, PDF pp. 53–54; Carprofen monograph, PDF pp. 79–81; contraindications and interactions"
                },
                {
                  "source": "AAHA_BRACHY25",
                  "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "Anticholinergic ให้พิจารณาตาม HR, perfusion, drug context และโรคร่วม ไม่ให้ทุกรายเพราะหน้าสั้น; steroid/NSAID ต้อง review ข้อบ่งชี้และหลีกเลี่ยงการใช้ร่วมที่เพิ่มความเสี่ยง GI",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 3, Sedative/alpha-2 effects and airway cautions; PDF file pp. 83–87"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "BSAVA",
                  "locator": "Atropine monograph, PDF pp. 53–54; Carprofen monograph, PDF pp. 79–81; contraindications and interactions"
                },
                {
                  "source": "AAHA_BRACHY25",
                  "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "induction",
          "title": "5. Preoxygenation → IV induction → secure airway",
          "claims": [
            {
              "text": "Preoxygenate ก่อน induction เมื่อทำได้โดยไม่เพิ่ม stress และคง oxygen support ระหว่างเตรียมใส่ท่อ; oxygen flow และวิธีให้ขึ้นกับอุปกรณ์และผู้ป่วย",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 6, Capnography; Chapter 9 intubation confirmation; PDF file pp. 237–244, 330–336"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "เลือก IV induction ที่ titrate to effect แล้วใส่ cuffed ETT โดยทีมพร้อมทันที; หลีกเลี่ยง mask/chamber induction ที่ทำให้ช่วง airway ยังไม่ secure ยาวนาน",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 6, Capnography; Chapter 9 intubation confirmation; PDF file pp. 237–244, 330–336"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ใช้ laryngoscope และ gentle technique; หากมอง glottis ไม่ชัด ให้ขอความช่วยเหลือและใช้อุปกรณ์ที่ทีมชำนาญ แทน repeated traumatic attempts",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 6, Capnography; Chapter 9 intubation confirmation; PDF file pp. 237–244, 330–336"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ยืนยันตำแหน่งท่อด้วย capnogram และ clinical ventilation, ตรวจความลึก/cuff/circuit และยึดท่อ; ไม่ใช้ chest movement หรือ condensation อย่างเดียวเป็นหลักฐานยืนยันท่อ",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 6, Capnography; Chapter 9 intubation confirmation; PDF file pp. 237–244, 330–336"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "maintenance",
          "title": "6. ระหว่างวางยา",
          "claims": [
            {
              "text": "ติดตาม SpO₂ พร้อม signal quality, ETCO₂/capnogram, RR/ventilation, BP, ECG, temperature และ depth ตาม monitoring protocol เดิม",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 2 patient preparation, corneal protection; PDF file p. 26"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ETT/circuit อาจ kink, อุดตัน หรือเลื่อน: ดู airway pressure/chest movement/capnogram และตรวจหลังจัดท่าหรือเคลื่อนผู้ป่วย; hypoxemia ไม่ได้เกิดจาก BOAS อย่างเดียว",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 2 patient preparation, corneal protection; PDF file p. 26"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "หาก ventilation ไม่พอ ให้ support ตาม clinician assessment พร้อม reassess BP เพราะ positive-pressure ventilation มีผลต่อ venous return; ไม่กำหนด ventilator setting เดียวให้ทุกตัว",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 2 patient preparation, corneal protection; PDF file p. 26"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ป้องกันทั้ง hypo- และ hyperthermia; ดูแล corneal protection/positioning และหลีกเลี่ยงแรงกดต่อ thorax/airway พร้อมลดเวลาสลบที่ไม่จำเป็น",
              "refs": [
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "TECH",
                  "locator": "Chapter 2 patient preparation, corneal protection; PDF file p. 26"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "extubation",
          "title": "7. ก่อนถอดท่อ · อย่าดูการกลืนครั้งแรกอย่างเดียว",
          "claims": [
            {
              "text": "ประเมิน awake/airway-protective responses และความสามารถยกศีรษะเองร่วมกับ ventilation/oxygenation ที่เหมาะสม; สุนัขหน้าสั้นมักต้องชะลอ extubation มากกว่าสุนัขทั่วไป ไม่ใช้ first swallow เป็นเกณฑ์เดียว",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "คงท่อขณะยังต้องพึ่ง airway support และยังทนท่อได้ โดยเฝ้าระวังการกัดท่อ/trauma; การตัดสินใจถอดท่อต้องประเมินรายตัว ไม่รอจนต่อสู้กับท่ออย่างรุนแรง",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "เตรียม O₂, suction, ETT เดิมและขนาดเล็กลง, laryngoscope และยาสำหรับ reinduction พร้อมคนใส่ท่อก่อน extubation; คง IV access",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "เลือกท่าที่ช่วย airway และทำ recovery ในพื้นที่สงบ; สุนัขหลัง BOAS surgery ต้องประเมิน edema/bleeding และ airway change เพิ่ม ไม่ใช้เกณฑ์เดียวกับ routine neuter",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "recovery",
          "title": "8. หลังถอดท่อและเกณฑ์รับไว้ดูอาการ",
          "claims": [
            {
              "text": "เฝ้าดู respiratory effort, stridor, thoracoabdominal movement, mucous membranes, SpO₂ trend, temperature, mentation และ pain อย่างใกล้ชิด; เสียงหายใจเดิมที่ดังขึ้นหรือแรงหายใจมากขึ้นต้อง reassess",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "Oxygenation ดูดีขณะให้ออกซิเจนไม่ได้ยืนยันว่า ventilation หรือ upper airway ปลอดภัย; oxygen อย่างเดียวแก้ mechanical obstruction ไม่ได้",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "หากมี obstruction/respiratory distress ที่ไม่ดีขึ้น ให้จัดการ airway และเตรียม reintubationทันทีโดยทีมที่พร้อม; ห้ามรอให้ตัวเลขตกมากก่อนเพียงเพราะ monitor ยังดูดี",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "เคส severe BOAS, difficult airway, airway surgery, regurgitation/aspiration concern, reintubation หรือ recovery ไม่คงที่ ให้พิจารณา extended observation/ICU/referral ตามสภาพและทรัพยากร; ไม่บังคับ discharge จากเวลาที่ผ่านไปอย่างเดียว",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ก่อนส่งกลับบ้านให้ clinician ยืนยัน breathing/perfusion/temperature/alertness เหมาะสม พร้อมคำแนะนำ owner เรื่องหายใจแรง เสียงเพิ่ม อาเจียน/สำรอก ไอ ซึมหรือ collapse และวิธีติดต่อกลับ",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "rescue",
          "title": "9. เมื่อเกิดปัญหา · แยก obstruction / aspiration / depth",
          "claims": [
            {
              "text": "หากหายใจลำบากหรือ oxygenation ลด ให้ขอ help และประเมิน patient + ETT/airway/oxygen/circuit ก่อน; ในผู้ป่วยยังใส่ท่อ ให้ใช้ Airway / ETT และ Hypoxemia Full Guide ประกอบ",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                },
                {
                  "source": "RECOVER24",
                  "locator": "CPR algorithm and clinical CPA recognition"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "หลัง extubation ที่สงสัย obstruction: จัดท่าและเปิด upper airwayอย่างนุ่มนวลระหว่างเตรียม definitive airway; หากอุดกั้นต่อเนื่องหรือ ventilation/oxygenation ไม่เพียงพอ ให้ clinician reinduce/reintubate และพิจารณา emergency airway หากไม่ได้ผล",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                },
                {
                  "source": "RECOVER24",
                  "locator": "CPR algorithm and clinical CPA recognition"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "เมื่อ regurgitation: ปกป้อง airway, จัดการช่องปาก/secretionsด้วย suction อย่างเหมาะสม และประเมิน aspiration; ใช้ Regurgitation / Aspiration guide หลีกเลี่ยงการกระตุ้นอาเจียน",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                },
                {
                  "source": "RECOVER24",
                  "locator": "CPR algorithm and clinical CPA recognition"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "ไอ, หายใจเร็ว/แรง, SpO₂ ลด หรือ recovery แย่หลัง regurgitation ต้องทบทวน aspiration pneumonitis/pneumonia และ pulmonary complication; antibiotics/steroids ไม่ใช่คำสั่งอัตโนมัติจากเหตุ regurgitationครั้งเดียว",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                },
                {
                  "source": "RECOVER24",
                  "locator": "CPR algorithm and clinical CPA recognition"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "Delayed recovery ต้องตรวจ residual drugs, temperature, glucose/physiologyและ airway ไม่เรียกทุกอย่างว่าแค่ยังง่วง; หากไม่มี effective circulation ใช้ CPA guide โดยไม่รออ่านคู่มือนี้จนจบ",
              "refs": [
                {
                  "source": "TECH",
                  "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
                },
                {
                  "source": "FUND",
                  "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
                },
                {
                  "source": "RESP25",
                  "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
                },
                {
                  "source": "RECOVER24",
                  "locator": "CPR algorithm and clinical CPA recognition"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        },
        {
          "id": "evidence",
          "title": "10. หลักฐานล่าสุดและขอบเขต",
          "claims": [
            {
              "text": "Filipas et al. (2024) เป็น retrospective cohort หลัง BOAS surgery: พบ hypoxemia, reintubation, tracheostomy และ aspiration pneumonia; ใช้ย้ำการเตรียม recovery ไม่ใช้ความถี่ของกลุ่มผ่าตัดนี้แทนความเสี่ยงของสุนัขหน้าสั้นทุกตัว",
              "refs": [
                {
                  "source": "BOAS24",
                  "locator": "Original retrospective cohort, 199 BOAS-surgery cases; abstract and respiratory-complication outcomes"
                },
                {
                  "source": "BOAS25",
                  "locator": "Original retrospective study, 45 protocol cases/45 controls; Results and Clinical Significance"
                },
                {
                  "source": "AAHA_BRACHY25",
                  "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "Webb et al. (2025) เปรียบเทียบ 45 protocol cases กับ 45 controls: ไม่พบความแตกต่างอย่างมีนัยสำคัญของ major complications; จึงยังไม่ยืนยันว่า protocolชุดนั้นลดภาวะแทรกซ้อนหรือกำหนด early discharge ได้ทุกเคส",
              "refs": [
                {
                  "source": "BOAS24",
                  "locator": "Original retrospective cohort, 199 BOAS-surgery cases; abstract and respiratory-complication outcomes"
                },
                {
                  "source": "BOAS25",
                  "locator": "Original retrospective study, 45 protocol cases/45 controls; Results and Clinical Significance"
                },
                {
                  "source": "AAHA_BRACHY25",
                  "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            },
            {
              "text": "บทความ AAHA Trends ปี 2025 เป็น specialist expert commentary ไม่ใช่ guidelineหรือ official AAHA position; ข้อเสนอเรื่องเลือกยาเป็นรายบุคคลต้อง review กับสภาพผู้ป่วยและ hospital protocol",
              "refs": [
                {
                  "source": "BOAS24",
                  "locator": "Original retrospective cohort, 199 BOAS-surgery cases; abstract and respiratory-complication outcomes"
                },
                {
                  "source": "BOAS25",
                  "locator": "Original retrospective study, 45 protocol cases/45 controls; Results and Clinical Significance"
                },
                {
                  "source": "AAHA_BRACHY25",
                  "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
                }
              ],
              "status": "source-based editorial synthesis; clinician verification required"
            }
          ]
        }
      ],
      "monitor": [
        {
          "text": "ใช้ monitoring และ clinical thresholds เดิม; คู่มือนี้ไม่แก้ alarm หรือ dose calculator",
          "refs": [
            {
              "source": "FUND",
              "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
            }
          ],
          "status": "source-based editorial synthesis; clinician verification required"
        },
        {
          "text": "Recovery: effort / stridor, SpO₂ trend, temperature, mentation, pain และ aspiration signs; ส่งต่อเมื่อไม่คงที่หรือทรัพยากรไม่พอ",
          "refs": [
            {
              "source": "FUND",
              "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
            },
            {
              "source": "TECH",
              "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
            },
            {
              "source": "RESP25",
              "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
            }
          ],
          "status": "source-based editorial synthesis; clinician verification required"
        }
      ],
      "avoid": [
        {
          "text": "อย่าปล่อย sedated patient ลำพัง หรือคิดว่า O₂ อย่างเดียวแก้ obstruction ได้",
          "refs": [
            {
              "source": "FUND",
              "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
            },
            {
              "source": "TECH",
              "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
            }
          ],
          "status": "source-based editorial synthesis; clinician verification required"
        },
        {
          "text": "อย่าใช้ยา / fasting / extubation / discharge สูตรเดียวจากชื่อพันธุ์; ต้องประเมินความเสี่ยงรายตัว",
          "refs": [
            {
              "source": "FUND",
              "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
            },
            {
              "source": "FUND",
              "locator": "Patient preparation and individualized fasting, PDF file p. 45; BOAS/GI disease, PDF file pp. 398–399"
            }
          ],
          "status": "source-based editorial synthesis; clinician verification required"
        },
        {
          "text": "ไม่ใช้ steroid / antibiotic / acid suppressant / anticholinergic เป็นคำสั่งอัตโนมัติจาก guide; review ข้อบ่งชี้และ drug interactions",
          "refs": [
            {
              "source": "TECH",
              "locator": "Chapter 3, Sedative/alpha-2 effects and airway cautions; PDF file pp. 83–87"
            },
            {
              "source": "FUND",
              "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
            },
            {
              "source": "RESP25",
              "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
            },
            {
              "source": "AAHA_BRACHY25",
              "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
            }
          ],
          "status": "source-based editorial synthesis; clinician verification required"
        }
      ],
      "drugLinks": [
        "propofol",
        "alfaxalone",
        "methadone",
        "fentanyl",
        "dexmedetomidine"
      ],
      "relatedGuides": [
        "airway",
        "hypoxemia",
        "regurgitation",
        "recovery",
        "arrest"
      ],
      "references": [
        {
          "source": "FUND",
          "locator": "Chapter 18, Upper airway disease and BOAS; Table 18.6; PDF file pp. 397–399"
        },
        {
          "source": "TECH",
          "locator": "Chapter 9, Endotracheal intubation and recovery; PDF file pp. 330–336, 347–349"
        },
        {
          "source": "TECH",
          "locator": "Chapter 3, Sedative/alpha-2 effects and airway cautions; PDF file pp. 83–87"
        },
        {
          "source": "FUND",
          "locator": "Patient preparation and individualized fasting, PDF file p. 45; BOAS/GI disease, PDF file pp. 398–399"
        },
        {
          "source": "RESP25",
          "locator": "BOAS assessment and perioperative care; PDF file pp. 81–85"
        },
        {
          "source": "RESP25",
          "locator": "Aspiration pneumonia/pneumonitis; PDF file pp. 186–189"
        },
        {
          "source": "AAHA_BRACHY25",
          "locator": "Expert commentary (not formal AAHA guideline); Oxygenation/induction, monitoring and ancillary drugs"
        },
        {
          "source": "BOAS24",
          "locator": "Original retrospective cohort, 199 BOAS-surgery cases; abstract and respiratory-complication outcomes"
        },
        {
          "source": "BOAS25",
          "locator": "Original retrospective study, 45 protocol cases/45 controls; Results and Clinical Significance"
        }
      ]
    }
  ]
};
function freeze(o){if(o&&typeof o==="object"){Object.values(o).forEach(freeze);Object.freeze(o)}return o}
root.ANESVET_SPECIAL_PATIENT_KNOWLEDGE=freeze(data);
})(typeof globalThis!=="undefined"?globalThis:this);
