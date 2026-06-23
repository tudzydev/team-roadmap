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

---

## 🛠️ Lab 2.2: Production CI/CD Pipeline - การสแกนความปลอดภัย, Linting และการอัปโหลด Build Artifacts
**วัตถุประสงค์:** สร้างเวิร์กโฟลว์ระดับมืออาชีพที่แยกการทำงานเป็นหลายขั้นตอน (Multi-Job Pipeline), มีการตรวจสอบคุณภาพและช่องโหว่ความปลอดภัยแบบอัตโนมัติ, พร้อมส่งออก Build Artifacts สำหรับการ Deploy จริง

### 🚀 ขั้นตอนปฏิบัติ:

1. **เตรียมสภาพแวดล้อมและสคริปต์ในเครื่อง:**
   * ติดตั้งเครื่องมือช่วยจัดและตรวจสอบโค้ด ESLint:
     ```bash
     npm install eslint@8.57.0 --save-dev
     ```
   * สร้างไฟล์กำหนดกฎการตรวจย่อย `.eslintrc.json` ในรากโครงการ:
     ```json
     {
       "env": {
         "browser": true,
         "commonjs": true,
         "es2021": true,
         "node": true
       },
       "extends": "eslint:recommended",
       "parserOptions": {
         "ecmaVersion": "latest"
       },
       "rules": {
         "no-console": "warn",
         "no-unused-vars": "error"
       }
     }
     ```
   * อัปเดตคำสั่งรันใน `package.json` เพิ่มสเต็ปสำหรับการทำ Linting และ Build จำลอง:
     ```json
     "scripts": {
       "test": "jest",
       "lint": "eslint .",
       "build": "mkdir -p dist && echo '/* Build Production Code */' > dist/app.bundle.js"
     }
     ```

2. **สร้างหรือแก้ไขไฟล์กำหนด Workflow (.github/workflows/ci.yml):**
   เขียนไฟล์ YAML ใหม่ให้ทำงานแบบ Multi-Job โดยแยกเป็น Job ตรวจสอบความปลอดภัยคุณภาพ กับ Job ทดสอบสร้างไฟล์ระบบ:
   ```yaml
   name: Production CI/CD Pipeline

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     # Job ที่ 1: ตรวจสอบความสะอาดและช่องโหว่ของโปรเจกต์
     security-and-lint:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout Code
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'

         - name: Install Dependencies
           run: npm ci

         - name: Run ESLint (Linting)
           run: npm run lint

         - name: Audit Dependencies (Security Scan)
           # รันตรวจสอบเพื่อดูว่ามี Library ตัวไหนมีช่องโหว่ความปลอดภัยระดับรุนแรง (High) ขึ้นไปหรือไม่
           run: npm audit --audit-level=high

     # Job ที่ 2: ทำงานเมื่อ Job แรกผ่านแล้วเท่านั้น เพื่อรันเทสและ Build แพ็กเกจ
     build-and-test:
       runs-on: ubuntu-latest
       needs: security-and-lint # บังคับให้ผ่าน Job แรกก่อน
       steps:
         - name: Checkout Code
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'

         - name: Install Dependencies
           run: npm ci

         - name: Run Unit Tests
           run: npm test

         - name: Build Application Bundle
           run: npm run build

         - name: Upload Build Artifacts
           # อัปโหลดผลลัพธ์การ Build เพื่อเก็บไว้ดาวน์โหลดหรือไป Deploy ต่อใน CD Pipeline
           uses: actions/upload-artifact@v4
           with:
             name: production-build
             path: dist/
             retention-days: 7
   ```

3. **ผลลัพธ์และความต่างในชีวิตจริง:**
   * **ทำไมต้องระบุ `needs`?:** หากตรวจสอบ Lint หรือเจอช่องโหว่ความปลอดภัยระดับร้ายแรง Pipeline จะหยุดทำงานทันที (Fail Fast) โดยไม่เสียเวลาสร้าง Build เปล่าประโยชน์
   * **การเก็บ Artifact (`upload-artifact`):** เครื่อง Actions Container จะถูกลบทิ้งเมื่อรันเสร็จ ดังนั้นการเก็บโฟลเดอร์ `dist/` ขึ้นระบบคลาวด์ของ GitHub ช่วยให้ทีม Release นำแอปเวอร์ชันนี้ไปติดตั้งบน Host จริงได้ทันที
