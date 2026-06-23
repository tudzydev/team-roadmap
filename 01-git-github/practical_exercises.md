# คู่มือภาคปฏิบัติ: การจัดการ Branch และแก้ไขข้อขัดแย้ง (Git Branching & Conflict Resolution)

แบบฝึกหัดนี้มีวัตถุประสงค์เพื่อสร้างความเข้าใจในการสร้าง Branch, การทำงานร่วมกันบน GitHub และจำลองการแก้ไขข้อขัดแย้ง (Merge Conflict)

---

## 🛠️ Lab 1: การจัดการ Branch และแก้ไขข้อขัดแย้ง
**วัตถุประสงค์:** ฝึกสร้าง Branch และจัดการแก้ไขข้อขัดแย้งเมื่อรวมโค้ด (Merge Conflict) ด้วยมืออย่างถูกต้อง

### 📋 โจทย์จำลองสถานการณ์:
ทีมพัฒนา 2 คนต้องการแก้ไขโค้ดในบรรทัดเดียวกันของไฟล์ `app.js` บนสาขาหลัก ทำให้เกิด Conflict และต้องจัดการรวมโค้ดด้วยมืออย่างถูกต้อง

### 🚀 ขั้นตอนปฏิบัติ:

1. **เตรียม Repository ในเครื่อง (Local Setup):**
   ```bash
   # สร้างโฟลเดอร์โครงการใหม่และเริ่มใช้งาน Git
   mkdir git-lab-1
   cd git-lab-1
   git init
   
   # สร้างไฟล์เริ่มต้น
   echo "const version = 'v1.0.0';" > app.js
   echo "console.log('App is running...');" >> app.js
   
   # Commit แรกเข้ากิ่งหลัก
   git add app.js
   git commit -m "initial: setup app"
   ```

2. **จำลองผู้พัฒนาคนที่ 1 (แก้ไขบนกิ่งใหม่):**
   ```bash
   # สร้างและสลับไปยังกิ่งใหม่
   git switch -c feat-login
   
   # แก้ไขไฟล์ app.js (เปลี่ยนบรรทัดที่ 2 จาก console.log เดิม เป็นข้อความใหม่)
   # จากนั้นสั่ง Commit
   git add app.js
   git commit -m "feat: add login screen console logs"
   ```

3. **จำลองผู้พัฒนาคนที่ 2 (แก้ไขบนกิ่งหลัก main):**
   ```bash
   # สลับกลับมาที่กิ่ง main
   git switch main
   
   # แก้ไขไฟล์ app.js บรรทัดที่ 2 เป็นข้อความอื่นที่แตกต่างออกไป
   # จากนั้นสั่ง Commit
   git add app.js
   git commit -m "refactor: update running console logs"
   ```

4. **ทำการ Merge และเผชิญหน้ากับ Conflict:**
   ```bash
   # พยายามดึงโค้ดจากกิ่ง feat-login เข้ามายัง main
   git merge feat-login
   ```
   *จะพบข้อความแจ้งเตือนสีแดง:* `CONFLICT (content): Merge conflict in app.js. Automatic merge failed; fix conflicts and then commit the result.`

5. **แก้ไขข้อขัดแย้ง (Resolve Conflict):**
   * เปิดไฟล์ `app.js` ด้วย Text Editor จะพบสัญลักษณ์เตือนความขัดแย้ง:
     ```javascript
     const version = 'v1.0.0';
     <<<<<<< HEAD
     console.log('App is running smoothly on production!');
     =======
     console.log('Please enter username and password to log in.');
     >>>>>>> feat-login
     ```
   * **งานของคุณ:** ลบเครื่องหมายข้อขัดแย้งออกให้หมด และแก้ไขโค้ดบรรทัดดังกล่าวให้รวมความต้องการของทั้งสองคนเข้าด้วยกัน เช่น:
     ```javascript
     const version = 'v1.0.0';
     console.log('App running - Ready for login credentials.');
     ```
   * บันทึกไฟล์ และรันคำสั่งเพื่อจบการ Merge:
     ```bash
     git add app.js
     git commit -m "merge: resolve conflicts between main and feat-login"
     ```

---

## 🛠️ Lab 1.2: การใช้ Git Rebase และ Pull Request Template ในการทำงานจริง
**วัตถุประสงค์:** เรียนรู้การจัดการประวัติการ Commit ให้เป็นเส้นตรงสะอาด (Linear History) ด้วย Git Rebase และการใช้ PR Template สำหรับกระบวนการ Code Review ในองค์กร

### 📋 โจทย์จำลองสถานการณ์:
ทีมของคุณกำลังใช้รูปแบบ Trunk-Based Development หรือ Git Flow ที่เน้นความสะอาดของประวัติ Commit คุณได้รับมอบหมายให้พัฒนาฟีเจอร์การชำระเงิน (`feat/payment`) แต่ในขณะที่คุณกำลังแก้ไขไฟล์ระบบ มีเพื่อนร่วมงานแก้ไขไฟล์คอนฟิกบนกิ่งหลัก `main` และดันโค้ดขึ้นระบบไปก่อนแล้ว คุณต้องดึงงานล่าสุดจากกิ่งหลักมาปรับฐานด้วย Rebase เพื่อให้ประวัติเรียบสวยงาม และตั้งค่า Template สำหรับทำ Pull Request เพื่อรีวิวโค้ด

### 🚀 ขั้นตอนปฏิบัติ:

1. **สร้าง Pull Request Template (ในเครื่องคุณก่อน):**
   * สร้างโครงสร้างโฟลเดอร์ชื่อ `.github` ในโปรเจกต์ `git-lab-1` (หากยังไม่มี)
   * สร้างไฟล์ชื่อ **`pull_request_template.md`** ภายใต้โฟลเดอร์ `.github/` ด้วยข้อความดังนี้:
     ```markdown
     ## 📝 Description
     - อธิบายการเปลี่ยนแปลงที่คุณทำที่นี่...
     
     ## 🧪 How Has This Been Tested?
     - [ ] Unit Tests
     - [ ] Manual Tested (Chrome / Safari)
     
     ## 📌 Checklist
     - [ ] โค้ดผ่านการจัดฟอร์แมตแล้ว
     - [ ] ไม่มี console.log ค้างสำหรับ Production
     - [ ] อัปเดตเอกสารประกอบแล้ว (ถ้ามี)
     ```
   * บันทึกไฟล์และ Commit ขึ้นเก็บไว้ในโปรเจกต์ก่อน:
     ```bash
     git add .github/pull_request_template.md
     git commit -m "chore: add PR template for code review process"
     ```

2. **สร้างกิ่งและแก้ไขไฟล์ระบบ:**
   * แยกกิ่งใหม่สำหรับทำระบบชำระเงิน:
     ```bash
     git switch -c feat/payment
     ```
   * แก้ไขไฟล์ `app.js` โดยการจำลองเพิ่มพอร์ตหรือฟังก์ชันใหม่ เช่น เพิ่มบรรทัดนี้ลงไป:
     ```javascript
     const paymentGateways = ['Stripe', 'Paypal'];
     console.log('Payment gateways initialized...');
     ```
   * บันทึกไฟล์และทำการ Commit:
     ```bash
     git add app.js
     git commit -m "feat: add payment gateway selection support"
     ```

3. **จำลองการอัปเดตกิ่งหลัก `main` โดยผู้พัฒนารายอื่น:**
   * สลับกลับมาที่กิ่งหลัก:
     ```bash
     git switch main
     ```
   * ทำการแก้ไขคอนฟิกระบบในไฟล์ `app.js` บรรทัดเดียวกัน เพื่อสร้างกรณีทับซ้อน (Conflict) เช่น แก้ไขเป็น:
     ```javascript
     const version = 'v1.1.0';
     console.log('App running - Safe Mode Activated.');
     ```
   * บันทึกไฟล์และทำการ Commit บนกิ่ง `main`:
     ```bash
     git add app.js
     git commit -m "chore: update app version to 1.1.0 and enable safe mode"
     ```

4. **รวมประวัติการพัฒนาโดยใช้ Git Rebase (แทนการ Merge):**
   * สลับกลับไปที่กิ่งฟีเจอร์ของคุณ:
     ```bash
     git switch feat/payment
     ```
   * ใช้คำสั่ง Rebase เพื่อเลื่อนฐาน Commit ของเราไปอยู่บนสุดของกิ่ง `main` ล่าสุด:
     ```bash
     git rebase main
     ```
   * *จะเกิด Conflict ขึ้น:* เนื่องจากไฟล์ `app.js` ถูกแก้ไขพร้อมกันทั้งสองฝั่ง

5. **แก้ไข Rebase Conflict และทำงานต่อ:**
   * เปิดไฟล์ `app.js` ใน Text Editor และรวมโค้ดให้ถูกต้อง (รักษาการอัปเดตเวอร์ชันบน `main` และการเพิ่ม Payment บนกิ่งเราไว้ด้วยกัน)
   * หลังจากแก้ไขเสร็จ ให้เตรียมไฟล์และสั่งให้ Rebase ดำเนินการต่อ:
     ```bash
     git add app.js
     git rebase --continue
     ```
   * *หากมี Conflict เพิ่มเติมให้แก้แบบเดิม หากเสร็จแล้วประวัติ Commit ของกิ่ง `feat/payment` จะเรียงต่อท้าย `main` อย่างเป็นระเบียบ*

6. **ผลักโค้ดขึ้น GitHub แบบปลอดภัย:**
   * หากคุณเคยส่งกิ่งนี้ขึ้น GitHub ไปก่อน Rebase ประวัติในเครื่องกับบนเซิร์ฟเวอร์จะไม่ตรงกัน คุณต้องใช้คำสั่ง force push แบบปลอดภัย:
     ```bash
     git push origin feat/payment --force-with-lease
     ```
     *(คำสั่ง `--force-with-lease` จะตรวจสอบก่อนว่ามีใครแอบแก้ไขโค้ดบนกิ่งนั้นบนเซิร์ฟเวอร์โดยที่เรายังไม่มีในเครื่องหรือไม่ ช่วยป้องกันการเขียนทับงานของคนอื่น)*
