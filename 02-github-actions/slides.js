// Fallback slides data for offline use (CORS file:// fallback)

const githubActionsMarkdown = `---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #f5f6f8
color: #24292f
style: |
  section {
    font-family: 'Inter', sans-serif;
    padding: 40px;
  }
  h1 {
    color: #0969da;
  }
  h2 {
    color: #0969da;
    border-bottom: 2px solid #d0d7de;
  }
  footer {
    font-size: 0.5em;
    color: #57606a;
  }
  code {
    background: #afb8c133;
    color: #cf222e;
  }
  pre {
    background: #f6f8fa;
    border: 1px solid #d0d7de;
  }
---

# เจาะลึก DevOps & CI/CD ด้วย GitHub Actions
## สร้างกระบวนการทดสอบและจัดส่งซอฟต์แวร์แบบอัตโนมัติ

**คู่มือเรียนรู้กระบวนการพัฒนาซอฟต์แวร์และการสร้าง Pipeline ระดับมืออาชีพ**

---

## 1. แนวคิด DevOps และกระบวนการ CI/CD
DevOps คือการผสมผสานกระบวนการและเครื่องมือ เพื่อช่วยให้องค์กรส่งมอบซอฟต์แวร์ได้อย่างรวดเร็วและมีประสิทธิภาพสูง

*   **Continuous Integration (CI):** ตรวจสอบโค้ดอัตโนมัติ (Build, Lint, Test) ทุกครั้งที่ Push โค้ดใหม่
*   **Continuous Delivery (CD):** เตรียมโค้ดให้อยู่ในสภาพพร้อมเปิดใช้งานบน Production อัตโนมัติ (แต่สั่ง Deploy ขึ้นระบบด้วยมือ)
*   **Continuous Deployment (CD):** ติดตั้งโค้ดที่ผ่านการทดสอบขึ้นสภาพแวดล้อม Production โดยอัตโนมัติทันที

---

## 2. การทำงานของ Pipeline (CI/CD Pipeline)
แผนภาพแสดงกระบวนการเคลื่อนที่อัตโนมัติของซอฟต์แวร์ตั้งแต่ push ไปจนถึง deployment:

\`\`\`
[Push โค้ด] ➔ [CI: ตรวจโค้ด & ทดสอบ] ➔ [สร้าง Container Image] ➔ [Deploy ไปยัง Staging] ➔ [อนุมัติด้วยมือ/อัตโนมัติ] ➔ [Deploy ไปยัง Production]
\`\`\`

---

## 3. GitHub Actions: เครื่องมือจัดการ CI/CD แบบอัตโนมัติ
GitHub Actions คือแพลตฟอร์ม CI/CD ในตัวของ GitHub ทำหน้าที่เรียกใช้สคริปต์อัตโนมัติเมื่อเกิด Event ในระบบ

*   **Workflow:** กระบวนการทำงานอัตโนมัติ เขียนในรูปแบบไฟล์ YAML ในโฟลเดอร์ \`.github/workflows/\`
*   **Event:** ตัวกระตุ้นเริ่มงาน (เช่น \`push\`, \`pull_request\`, หรือใช้ตั้งเวลา \`cron\`)
*   **Runner:** เครื่องเซิร์ฟเวอร์เสมือน (Linux, Windows, macOS) ที่ทำหน้าที่รันขั้นตอนของ Workflow
*   **Job:** กลุ่มของขั้นตอนย่อยที่รันบน Runner ตัวเดียวกัน (โดยปกติแต่ละ Job สามารถรันไปพร้อมๆ กันแบบขนานได้)
*   **Step:** งานย่อยแต่ละงานใน Job (เป็นคำสั่ง shell หรือเรียกใช้งาน Action สำเร็จรูป)

---

## 4. ตัวอย่างไฟล์การทำงานของ GitHub Actions

\`\`\`yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Tests
        run: npm test
\`\`\`

---

## 5. วงจรชีวิตการทำงานฉบับสมบูรณ์ของ DevOps
เส้นทางของโค้ดตั้งแต่เริ่มพัฒนาจนถึงระบบปลายทาง (Production):

1.  **Develop (พัฒนา):** เขียนโค้ดบนเครื่องคอมพิวเตอร์ของคุณและบันทึกประวัติด้วย **Git**
2.  **Collaborate (ร่วมมือ):** Push branch ของคุณขึ้นเซิร์ฟเวอร์ และเปิด **GitHub Pull Request (PR)**
3.  **Validate (ตรวจสอบ):** **GitHub Actions** ทำงานอัตโนมัติ เช่น ตรวจโค้ด, รันชุดทดสอบ และตรวจสอบความถูกต้อง
4.  **Review (พิจารณา):** ทีมงานรีวิวโค้ดและอนุมัติให้ทำการรวมโค้ดเข้าสู่ branch \`main\`
5.  **Deploy (ติดตั้ง):** ระบบ CI/CD ทำการ Deploy ซอฟต์แวร์โดยอัตโนมัติไปยังเซิร์ฟเวอร์หรือ Cloud Environment
6.  **Monitor (เฝ้าระวัง):** เฝ้าติดตามการทำงานของระบบหลังการติดตั้งและแจ้งเตือนเมื่อเกิดปัญหา

---

## 6. ภาคปฏิบัติ Lab 2: ระบบ CI ด้วย GitHub Actions
เขียนระบบตรวจสอบและรันการทดสอบ Unit Test อัตโนมัติทุกครั้งที่ Push โค้ด

1. **เขียนโค้ดและชุดทดสอบ**:
   * เขียนฟังก์ชันทดสอบคณิตศาสตร์ลงในไฟล์ \`math.js\`
   * เขียนข้อกำหนดการทดสอบใน \`math.test.js\` และตั้งรันค่าผ่าน npm test
2. **สร้างเวิร์กโฟลว์ (Workflow Definition)**:
   * สร้างไฟล์ \`.github/workflows/ci.yml\` ด้วยคอนฟิก YAML
   * กำหนดการรันงานบน Linux container (\`ubuntu-latest\`)
3. **สเต็ปทำงานอัตโนมัติ**:
   * ดึงโค้ด ➔ ติดตั้ง node ➔ ติดตั้ง Dependency (\`npm ci\`) ➔ รันสคริปต์เทส (\`npm test\`)

---

## 7. เคล็ดลับการสร้าง CI แจ้งเตือนผ่าน Discord
เพิ่มการแจ้งเตือนผลลัพธ์ของ GitHub Actions เข้าห้องแชต Discord ของทีม

1. **สร้าง Webhook บน Discord**:
   * Channel Settings ➔ Integrations ➔ Webhooks ➔ Copy Webhook URL
2. **บันทึกคีย์ลับใน GitHub Secrets**:
   * ไปที่ Settings ➔ Secrets ➔ Actions ➔ สร้าง Secret ชื่อ \`DISCORD_WEBHOOK\`
3. **กำหนดขั้นตอนใน YAML Workflow**:
   * รันปลั๊กอิน \`sarisia/actions-status-discord\` ท้ายสุดของเวิร์กโฟลว์:
     \`\`\`yaml
     - name: Discord Notification
       uses: sarisia/actions-status-discord@v1
       if: always() # ให้รันเสมอแม้เทสล้มเหลว
       with:
         webhook: \${{ secrets.DISCORD_WEBHOOK }}
         status: \${{ job.status }}
     \`\`\`
`;
