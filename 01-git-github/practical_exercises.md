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
