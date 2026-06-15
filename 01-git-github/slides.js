// Fallback slides data for offline use (CORS file:// fallback)

const gitGithubMarkdown = `---
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

# เจาะลึกการใช้งาน Git & GitHub
## จาก Local Commits สู่การทำงานร่วมกันอย่างมืออาชีพ

**คู่มือสำหรับนักพัฒนาเพื่อความเข้าใจโครงสร้างและกระบวนการพัฒนาสมัยใหม่**

---

## 1. สถาปัตยกรรมของ Git: 3 พื้นที่หลัก
Git คือ **ระบบควบคุมเวอร์ชันแบบกระจายศูนย์ (DVCS)** บันทึกการเปลี่ยนแปลงไฟล์ผ่าน 3 พื้นที่หลักในเครื่องคอมพิวเตอร์ก่อนเชื่อมข้อมูลขึ้นรีโมทเซิร์ฟเวอร์:

*   **Working Directory:** พื้นที่ทำงานปัจจุบันของคุณ (ไฟล์ที่กำลังแก้ไขอยู่บนเครื่อง)
*   **Staging Area (Index):** พื้นที่จัดเตรียมและตรวจสอบความเรียบร้อยก่อนทำการ Commit
*   **Local Repository (\`.git\`):** แหล่งเก็บประวัติการแก้ไขในเครื่องคุณที่เสร็จสมบูรณ์แล้ว (แก้ไขไม่ได้)
*   **Remote Repository (GitHub):** แหล่งเก็บโค้ดส่วนกลางสำหรับแบ่งปันและใช้งานร่วมกันในทีม

---

## 1. วงจรการทำงานของ Git (Git Workflows)
แผนภาพจำลองการเคลื่อนย้ายไฟล์และสถานะต่างๆ ในการควบคุมเวอร์ชันโค้ด:

\`\`\`
+-------------------------------------------------------------+
|                     Local Machine                           |
|  [Working Directory] -> git add -> [Staging Area (Index)]   |
|         |                                 |                 |
|    git checkout                      git commit             |
|         v                                 v                 |
|  [Files on Disk]               [Local Repository (.git)]    |
+-------------------------------------------------------------+
                            |
                      git push / pull
                            v
                [Remote Repository (GitHub)]
\`\`\`

---

## 2. คำสั่ง Git พื้นฐาน: เริ่มต้นและดูสถานะ
*   \`git init\` : เริ่มสร้าง Git Repository ใหม่ในโฟลเดอร์ปัจจุบัน
*   \`git clone <url>\` : ดาวน์โหลด Repository พร้อมประวัติการเปลี่ยนแปลงทั้งหมดลงเครื่อง
*   \`git status\` : ตรวจสอบสถานะการแก้ไขไฟล์ใน Working Directory
*   \`git log --oneline --graph\` : แสดงประวัติการ Commit เป็นกราฟิกเส้นตรงช่วยให้เข้าใจลำดับเหตุการณ์

---

## 2. คำสั่ง Git พื้นฐาน: บันทึกและจัดการ Branch
*   \`git add <file>\` : นำไฟล์ที่แก้ไขไปเตรียมไว้ในพื้นที่จัดเตรียม (Staging Area)
*   \`git commit -m "feat: login"\` : บันทึกข้อมูลที่เตรียมไว้ลงใน Local Repository
*   \`git switch -c <branch>\` : สร้าง branch ใหม่พร้อมกับสลับไปใช้งานทันที
*   \`git merge <branch>\` : รวมประวัติการทำงานของ branch อื่นเข้ากับ branch ปัจจุบัน
*   \`git rebase <branch>\` : ย้าย commit ปัจจุบันไปต่อท้าย commit ล่าสุดของ base branch (ช่วยให้ประวัติเป็นเส้นตรง)

---

## 3. การจัดการ Branch ในการทำงานจริง
การแยกสาขาช่วยให้ทีมทำงานขนานกันได้โดยไม่กระทบสายหลัก (Production-ready branch)

โครงสร้างสาขาหลักตามมาตรฐานสากล:
*   **main / master:** เก็บโค้ดที่ผ่านการทดสอบสมบูรณ์และรันบนระบบจริง (Production)
*   **develop:** กิ่งศูนย์รวมงานที่พัฒนาเสร็จเพื่อเตรียมทดสอบขั้นถัดไป (Staging/QA)
*   **feature/*:** กิ่งพัฒนาฟีเจอร์ย่อย แยกอิสระตามแต่ละงาน
*   **release/*:** กิ่งจัดเตรียมเวอร์ชันถัดไปเพื่อตรวจทานรอบสุดท้ายก่อนขึ้นจริง
*   **hotfix/*:** กิ่งพิเศษแก้ไขข้อผิดพลาดร้ายแรงบนระบบ Production อย่างเร่งด่วน

---

## 3. จำลองการทำงานของ Branch (Git Branch Simulator)
จำลองขั้นตอนการสร้าง branch, commit, merge, และ release บน lanes ต่างๆ:

\`\`\`
[จำลองการทำงานของ Branch]
\`\`\`

---

## 3. เจาะลึก Feature Branch: พัฒนาฟีเจอร์ใหม่
ใช้เพื่อเขียนโค้ดสำหรับงานหนึ่งๆ (User Story / Task) แยกอิสระเพื่อป้องกันไม่ให้กระทบผู้อื่น

*   **เมื่อใดที่สร้าง:** แยกสาขาออกจากกิ่ง \`develop\`
*   **รูปแบบการตั้งชื่อ:** \`feature/ชื่อภาษาอังกฤษสั้นๆ\` หรือ \`feature/เลขรหัสงาน-ชื่อย่อ\`
    *   *ตัวอย่าง:* \`feature/login-page\`, \`feature/issue-456-payment\`
*   **วงจรคำสั่งการทำงานจริง:**
    \`\`\`bash
    git switch develop                     # กลับมาที่กิ่งหลักสำหรับการพัฒนา
    git pull origin develop                # อัปเดตโค้ดล่าสุดจากเซิร์ฟเวอร์
    git switch -c feature/login-page       # สร้างและสลับมาพัฒนาฟีเจอร์
    # ... เขียนโค้ด ทำการ add และ commit ...
    git push origin feature/login-page     # อัปโหลดกิ่งงานเพื่อเปิด Pull Request (PR)
    \`\`\`

---

## 3. เจาะลึก Release Branch: เตรียมตัวปล่อยระบบ
ใช้เมื่อฟีเจอร์สำหรับเวอร์ชันนั้นๆ พัฒนาเสร็จครบถ้วน เพื่อทำการตรวจบั๊กและเตรียมเอกสารปล่อยแอป

*   **เมื่อใดที่สร้าง:** แยกจากกิ่ง \`develop\` เมื่อทุกฟีเจอร์พร้อมนำขึ้นระบบ
*   **รูปแบบการตั้งชื่อ:** \`release/vเลขเวอร์ชัน\` (เช่น \`release/v1.2.0\`, \`release/v2.0.0\`)
*   **วงจรคำสั่งการทำงานจริง:**
    \`\`\`bash
    git switch develop
    git switch -c release/v1.2.0           # แยกกิ่งเตรียมทดสอบรอบสุดท้าย
    # ... แก้ไขบั๊กย่อยที่พบระหว่างการทดสอบในกิ่งนี้ ...
    git commit -m "fix: resolve minor dashboard overflow"
    # เมื่อเสร็จสิ้น: รวมโค้ดเข้าทั้ง main (ติด Tag) และ develop
    git switch main && git merge release/v1.2.0
    git tag -a v1.2.0 -m "Release version 1.2.0"
    git switch develop && git merge release/v1.2.0
    \`\`\`

---

## 3. เจาะลึก Hotfix Branch: แก้ไขด่วนบนระบบจริง
ใช้เมื่อพบข้อผิดพลาดร้ายแรง (Critical Bug / Crash) บนระบบโปรดักชันที่ต้องแก้ทันที รอรอบ Release ปกติไม่ได้

*   **เมื่อใดที่สร้าง:** แยกสาขาออกจากกิ่ง \`main\` โดยตรง
*   **รูปแบบการตั้งชื่อ:** \`hotfix/ชื่อบั๊กภาษาอังกฤษ\` หรือ \`hotfix/vเวอร์ชันย่อย\`
    *   *ตัวอย่าง:* \`hotfix/login-crash\`, \`hotfix/v1.2.1\`
*   **วงจรคำสั่งการทำงานจริง:**
    \`\`\`bash
    git switch main
    git pull origin main
    git switch -c hotfix/login-crash       # แยกจาก main มาแก้บั๊กทันที
    # ... ทำการแก้ไขปัญหา คอนเฟิร์มการทำงาน ...
    git commit -m "fix: prevent crash when token is null"
    # นำโค้ดรวมกลับเข้า main เพื่อ deploy และ develop เพื่อไม่ให้บั๊กกลับมาอีก
    git switch main && git merge hotfix/login-crash && git tag -a v1.2.1
    git switch develop && git merge hotfix/login-crash
    \`\`\`

---

## 3. สรุปแนวปฏิบัติการตั้งชื่อ Branch ในชีวิตจริง
การตั้งชื่อกิ่งที่เป็นระเบียบช่วยให้ระบุวัตถุประสงค์และติดตามงานง่ายขึ้นมาก

| ประเภทกิ่ง | Base Branch | Merge Target | ตัวอย่างชื่อกิ่งที่แนะนำ |
| :--- | :--- | :--- | :--- |
| **Feature** | \`develop\` | \`develop\` | \`feature/auth-login\`, \`feature/issue-99-cart\` |
| **Bugfix** | \`develop\` | \`develop\` | \`bugfix/reset-password-ui\`, \`bugfix/cart-math\` |
| **Release** | \`develop\` | \`main\` & \`develop\` | \`release/v1.3.0\`, \`release/v2.1.0-rc1\` |
| **Hotfix** | \`main\` | \`main\` & \`develop\` | \`hotfix/db-connection-leak\`, \`hotfix/v1.3.1\` |
| **Docs/Chore**| \`develop\` | \`develop\` | \`docs/update-readme\`, \`chore/bump-deps\` |

---

## 3. การ Merge และข้อขัดแย้ง (Conflicts)
*   **Fast-Forward Merge:** Base branch ไม่มีการเปลี่ยนแปลงหลังแยกสาขา Git จะเลื่อนตัวชี้ไปข้างหน้าทันที
*   **3-Way Merge:** สอง Branch แก้ไขแยกจากกัน Git จะรวมโค้ดและสร้าง \"Merge Commit\" ใหม่ให้อัตโนมัติ
*   **การแก้ไข Conflict (ข้อขัดแย้ง):** เกิดขึ้นเมื่อมีการแก้ไขไฟล์ในบรรทัดเดียวกัน
    1. Git จะหยุด Merge ชั่วคราว ให้เปิดไฟล์นั้นเพื่อเลือกโค้ดส่วนที่ต้องการเก็บไว้
    2. ลบเครื่องหมายแบ่งข้อขัดแย้งออกให้หมด (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`)
    3. บันทึกไฟล์และใช้คำสั่ง \`git add\` และ \`git commit\` เพื่อทำการรวมโค้ดให้เสร็จสิ้น

---

## 4. กระบวนการทำงานร่วมกัน: Pull Request (PR)
Pull Request คือ **ด่านตรวจคุณภาพโค้ด** ก่อนรวมเข้าสู่สายหลัก (Production) ช่วยระบุการทำ Code Review และรันการทดสอบอัตโนมัติ

\`\`\`
[สร้าง Branch] ➔ [Push ไป Remote] ➔ [เปิด PR] ➔ [ผ่านการทดสอบ CI] ➔ [รีวิว & อนุมัติ] ➔ [Merge เข้า Main]
\`\`\`

---

## 4. โมเดลการจัดการ Branch ยอดนิยม
1.  **GitHub Flow:** มี branch หลักคือ \`main\` เพียงอย่างเดียว
    *   สร้าง feature branch ➔ เปิด PR ➔ รีวิว ➔ merge ➔ Deploy ทันที
    *   *เหมาะสำหรับ:* ระบบที่ปล่อยเวอร์ชันบ่อยและทำ Continuous Deployment
2.  **Git Flow:** โครงสร้างมีระเบียบสูง แยกตามสัดส่วนชัดเจน
    *   มีกิ่งแยกเฉพาะ (\`main\`, \`develop\`, \`feature/*\`, \`release/*\`, \`hotfix/*\`)
    *   *เหมาะสำหรับ:* โปรเจกต์ที่มีรอบการปล่อยซอฟต์แวร์ที่แน่นอน (Release Cycle)
3.  **Trunk-Based Development:** รวมงานย่อยสั้นๆ เข้าสู่ \`main\` ตรงๆ หลายครั้งต่อวัน
    *   *เหมาะสำหรับ:* หลีกเลี่ยงกิ่งค้างยาว และลดปัญหาข้อขัดแย้งของโค้ดสะสม (Merge Conflicts)

---

## 5. Workflows: Feature Branching vs. Trunk-Based

ทำไมทีมส่วนใหญ่ถึงเลือก Trunk-Based Development แทนที่กระบวนการ Feature-Branching แบบดั้งเดิม (เช่น Git Flow)?

| คุณลักษณะ | Git Flow (Feature) | Trunk-Based (TBD) |
| :--- | :--- | :--- |
| **อายุ Branch** | ยาวนาน (หลายวัน, สัปดาห์ หรือเดือน) | สั้นมาก (น้อยกว่า 24-48 ชั่วโมง) |
| **ความถี่ Merge** | ไม่บ่อย (รวมโค้ดทีละก้อนใหญ่) | บ่อยครั้ง (หลายครั้งต่อวัน) |
| **ความเร็ว Deploy** | ช้า (ต้องรอรอบปล่อยรวมเป็นชุด) | รวดเร็วมาก (Continuous Deployment) |
| **Merge Conflict** | สูง (มักเกิด Merge Hell จากโค้ดต่างกันมาก) | ต่ำ (โค้ดมีขนาดเล็กและรวมเข้าบ่อยทุกวัน) |
| **ปัจจัยสำคัญ** | การจัดการรอบอนุมัติที่เข้มงวด | ระบบ CI/CD ที่ไว และการใช้ **Feature Flags** |

---

## 5. ปรัชญาหลักในการทำงานของ Branching Workflows
*   **Git Flow / GitHub Flow (เน้นความปลอดภัย)**
    *   เน้นการแยกสภาพแวดล้อมออกจากกัน (Branch Isolation)
    *   ควบคุมคุณภาพอย่างเข้มงวดก่อนปล่อยซอฟต์แวร์สู่สายหลัก
    *   *เหมาะกับ:* Open-source หรืองานที่ต้องตรวจสอบสูง
*   **Trunk-Based (เน้นความเร็ว)**
    *   เน้นความรวดเร็วในการรวมโค้ด (Integration Speed) เข้าแกนกลาง
    *   *เหมาะกับ:* ทีม DevOps ประสิทธิภาพสูงที่ต้องการความคล่องตัว

---

## 6. Git สำหรับใช้งานจริง: Self Project (ลุยเดี่ยว)
เน้นความเร็ว ความเรียบง่าย และเก็บประวัติเพื่อสำรองข้อมูล

*   **Workflow**: เขียนโค้ดและ Commit ตรงเข้าสู่กิ่งหลัก \`main\` ได้โดยตรง
*   **Best Practices**:
    1.  **ตั้งค่า \`.gitignore\`**: ซ่อนไฟล์ขยะและคีย์ความลับ (\`node_modules/\`, \`.env\`)
    2.  **ตั้งคอมมิตตามแบบแผน (Conventional Commits)**: เช่น \`feat: ...\`, \`fix: ...\`
    3.  **ปักป้ายเวอร์ชัน (Semantic Tagging)**: เช่น \`git tag -a v1.0.0\` เพื่อล็อกเวอร์ชัน

---

## 7. Git สำหรับใช้งานจริง: Team Project (ทำร่วมกับทีม)
เน้นการรีวิวป้องกันโค้ดทับกัน และรักษาความเสถียรของแอปพลิเคชัน

*   **Workflow**: ใช้ **Feature Branching + Pull Request (PR)** รีวิวโค้ดก่อนรวมเข้ากิ่งหลัก
*   **Best Practices**:
    1.  **ตั้งชื่อกิ่งมาตรฐาน**: เช่น \`feat/user-login\`, \`fix/db-leak\`, \`docs/readme\`
    2.  **เปิดการป้องกัน Branch (Branch Protection)**: บล็อกการ Push เข้า main ตรงๆ
    3.  **Squash and Merge**: ยุบคอมมิตฟุ่มเฟือยให้เหลือ 1 สาระสำคัญตอนรวม PR
    4.  **Rebase ก่อนดึง PR**: ดึงโค้ดล่าสุดจาก main มา rebase เข้ากิ่งตัวเองบ่อยๆ

---

## 8. Git สำหรับใช้งานจริง: Enterprise Project (องค์กรใหญ่)
เน้นความปลอดภัย การกำกับดูแล สเกลระบบ และ CI/CD อัตโนมัติ 100%

*   **Workflow**: **Trunk-Based Development** (ซ่อนงานที่ยังไม่เสร็จหลัง **Feature Flags**)
*   **Best Practices**:
    1.  **เจ้าของโค้ด (CODEOWNERS)**: กำหนดผู้ดูแลระบบที่จำเป็นต้องเป็นคนอนุมัติแต่ละโฟลเดอร์
    2.  **การเซ็นรับรอง (Signed Commits)**: บังคับเซ็นลายเซ็นดิจิทัล (GPG/SSH) ยืนยันตัวตน
    3.  **ความจุใหญ่ (Git LFS)**: ฝากไฟล์ assets หนักๆ ไว้ภายนอก ป้องกันประวัติขนาดบวม
    4.  **CI/CD Gate**: บล็อกการรวมโค้ดหากสแกน Security หรือเทสไม่ผ่าน 100%

---

## 9. ภาคปฏิบัติ Lab 1: การจัดการ Branch & แก้ไข Conflict
การทำงานร่วมกันโดยแก้ไขโค้ดบรรทัดเดียวกันในไฟล์ \`app.js\`

1. **เตรียมโค้ดเริ่มต้น**:
   * สร้างโฟลเดอร์โครงการ รัน \`git init\`
   * สร้างไฟล์ \`app.js\` เขียนโค้ดเริ่มต้น ➔ Commit เข้ากิ่งหลัก \`main\`
2. **จำลองข้อขัดแย้ง (Merge Conflict)**:
   * คนที่ 1: แยกกิ่ง \`feat-login\` แก้ไขไฟล์บรรทัดที่ 2 ➔ Commit
   * คนที่ 2: กลับมาที่กิ่ง \`main\` แก้ไขไฟล์บรรทัดที่ 2 เป็นคำอื่น ➔ Commit
3. **การแก้ไขข้อขัดแย้ง (Conflict Resolution)**:
   * รัน \`git merge feat-login\` ในกิ่ง \`main\`
   * เปิดไฟล์ \`app.js\` ลบสัญลักษณ์ \`<<<<<<<\`, \`=======\`, \`>>>>>>>\`
   * แก้ไขโค้ดที่ทับซ้อนกันให้สมบูรณ์ รัน \`git add\` และ \`git commit\`
`;

const defaultSlidesMarkdown = gitGithubMarkdown; // default is Git & GitHub
