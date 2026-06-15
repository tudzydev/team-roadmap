# คู่มือภาคปฏิบัติ: การสร้าง CI Pipeline ด้วย GitHub Actions

แบบฝึกหัดนี้มีวัตถุประสงค์เพื่อเขียนสคริปต์ตรวจสอบความสะอาดของโค้ด และทดสอบโค้ดแบบ Unit Test อัตโนมัติทุกครั้งที่ Push ขึ้น GitHub

---

## 🛠️ Lab 2: การสร้าง CI Pipeline ด้วย GitHub Actions
**วัตถุประสงค์:** สร้างเวิร์กโฟลว์อัตโนมัติบน GitHub ให้ทำงานทุกครั้งที่มีการเปิด Pull Request เข้าหา `main` โดยต้องรันสคริปต์ทดสอบ JavaScript

### 🚀 ขั้นตอนปฏิบัติ:

1. **สร้างโครงการ Node.js ขนาดเล็ก:**
   ```bash
   # เริ่มต้นสร้างโครงการ npm
   npm init -y
   
   # ติดตั้ง Jest (เฟรมเวิร์กสำหรับเขียนเทส)
   npm install jest --save-dev
   ```

2. **เขียนโค้ดฟังก์ชันและไฟล์ทดสอบ (Math Helper):**
   * สร้างไฟล์ **`math.js`**:
     ```javascript
     function add(a, b) {
       return a + b;
     }
     module.exports = { add };
     ```
   * สร้างไฟล์ทดสอบ **`math.test.js`**:
     ```javascript
     const { add } = require('./math');
     
     test('adds 1 + 2 to equal 3', () => {
       expect(add(1, 2)).toBe(3);
     });
     ```

3. **อัปเดตไฟล์ `package.json`:**
   * แก้ไขส่วนของ `"scripts"` ให้รันคำสั่งทดสอบของ Jest:
     ```json
     "scripts": {
       "test": "jest"
     }
     ```

4. **เขียนไฟล์นิยาม Workflow (GitHub Actions):**
   * สร้างโครงสร้างโฟลเดอร์ `.github/workflows/`
   * สร้างไฟล์ **`.github/workflows/ci.yml`**:
     ```yaml
     name: Node.js CI Pipeline
     
     on:
       push:
         branches: [ main ]
       pull_request:
         branches: [ main ]
     
     jobs:
       build-and-test:
         runs-on: ubuntu-latest
         
         steps:
           - name: Checkout Repository
             uses: actions/checkout@v4
             
           - name: Set up Node.js Environment
             uses: actions/setup-node@v4
             with:
               node-version: '20'
               cache: 'npm'
               
           - name: Install Project Dependencies
             run: npm ci
             
           - name: Run Test Suites
             run: npm test
     ```

5. **ผลลัพธ์ที่ได้รับ:** Pushing โค้ดนี้ขึ้น GitHub และทดลองส่ง PR จะสังเกตเห็นแท็บสถานะรันของเครื่องมือ GitHub Actions แสดงเครื่องหมายถูกสีเขียว (Pass) เมื่อชุดคำสั่งทำงานเสร็จสิ้น
