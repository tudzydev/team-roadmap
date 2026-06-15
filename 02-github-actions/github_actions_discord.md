# คู่มือ: การตั้งค่า GitHub Actions CI ให้แจ้งเตือนผ่าน Discord

คู่มือนี้จะสอนวิธีกำหนดค่า GitHub Actions CI pipeline ให้ส่งข้อความแจ้งเตือนผลลัพธ์การรัน (รันผ่าน / รันล้มเหลว) ตรงไปยังแชนเนล Discord ของทีมคุณ

---

## 🔌 ขั้นตอนที่ 1: การสร้าง Webhook URL บน Discord
ก่อนอื่นเราต้องมีที่อยู่ (URL) ลับของห้องสนทนาบน Discord เพื่อให้ GitHub Actions สามารถส่งข้อมูลเข้ามาได้:

1. เปิดแอป Discord ไปยังแชนเนลที่ต้องการรับแจ้งเตือน
2. คลิกปุ่ม **ฟันเฟือง (Edit Channel)** ข้างแชนเนลนั้น ➔ เลือกเมนู **Integrations**
3. คลิกที่ **Webhooks** ➔ คลิกปุ่ม **Create Webhook** (หรือ **New Webhook**)
4. คุณสามารถตั้งชื่อและเลือกรูปโปรไฟล์ของบอทได้ตามต้องการ (เช่น "GitHub Actions CI")
5. คลิกปุ่ม **Copy Webhook URL** เพื่อคัดลอกที่อยู่เก็บไว้ (เช่น `https://discord.com/api/webhooks/12345/abcde...`)

---

## 🔑 ขั้นตอนที่ 2: การเก็บ Webhook URL บน GitHub Secrets
ห้ามนำ Webhook URL ไปเขียนลงในไฟล์โค้ดตรงๆ เพราะอาจส่งผลให้บุคคลอื่นขโมยสิทธิ์และส่งข้อความแปลกปลอมเข้ามาได้ ให้เก็บไว้ในระบบความปลอดภัยของ GitHub:

1. เปิดหน้า Repository ของคุณบนเว็บไซต์ GitHub
2. ไปที่เมนู **Settings** (แถบเมนูด้านบน)
3. เมนูด้านซ้ายเลือก **Secrets and variables** ➔ คลิกเมนูย่อย **Actions**
4. คลิกปุ่ม **New repository secret** (ปุ่มสีเขียว)
5. กรอกรายละเอียดดังนี้:
   * **Name:** `DISCORD_WEBHOOK`
   * **Secret:** *วาง URL ที่คัดลอกมาจาก Discord ในขั้นตอนที่ 1*
6. คลิกปุ่ม **Add secret** เพื่อบันทึกค่าความลับ

---

## ⚡ ขั้นตอนที่ 3: การเขียนสคริปต์ Workflow บน GitHub Actions

สร้างไฟล์เวิร์กโฟลว์ตามตัวอย่างด้านล่าง โดยนำไปบันทึกไว้ที่โฟลเดอร์ `.github/workflows/ci.yml` ของโปรเจกต์คุณ

### 💡 วิธีที่ 1: ใช้ Action สำเร็จรูปใน GitHub Marketplace (แนะนำ - สวยงามและมีสถานะสีแจ้งเตือนชัดเจน)
วิธีนี้จะใช้ปลั๊กอิน `sarisia/actions-status-discord` เพื่อวาดการ์ดแสดงผลสีเขียว (ผ่าน) หรือสีแดง (ล้มเหลว) บน Discord พร้อมลิงก์กลับมายัง GitHub:

```yaml
name: CI Pipeline with Discord

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-notify:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4
        
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Run Jest Test Suites
        run: npm test
        
      # ส่งการแจ้งเตือนสถานะผลงานไปยัง Discord
      - name: Send Discord Status Notification
        uses: sarisia/actions-status-discord@v1
        if: always() # ให้ทำงานเสมอไม่ว่าขั้นตอนการเทสก่อนหน้าจะผ่านหรือล้มเหลว
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          status: ${{ job.status }}
          title: "CI Pipeline Build Report"
          description: "ผลการทดสอบโค้ดบนกิ่ง ${{ github.ref_name }} (Commit: ${{ github.sha }})"
          color: 0x0969da
```

---

### 💡 วิธีที่ 2: ส่งด้วยคำสั่ง `curl` (เบาและไม่ต้องการปลั๊กอินภายนอก)
หากไม่ต้องการพึ่งพาโค้ดของผู้อื่น สามารถส่งคำสั่ง POST Request ผ่าน `curl` เพื่อส่งข้อความสั้นๆ ได้ทันที:

```yaml
      # แทรกไว้ท้ายไฟล์ Workflow
      - name: Discord Notification via curl
        if: always() # รันเสมอ
        run: |
          # กำหนดสีข้อความตามสถานะ
          STATUS="${{ job.status }}"
          EMOJI="✅"
          if [ "$STATUS" != "success" ]; then
            EMOJI="❌"
          fi
          
          # ยิง POST เข้า Webhook
          curl -H "Content-Type: application/json" \
               -X POST \
               -d "{\"content\": \"$EMOJI **GitHub Actions CI Report**\\nStatus: **$STATUS**\\nBranch: \`${{ github.ref_name }}\`\\nCommit: \`${{ github.sha }}\`\"}" \
               ${{ secrets.DISCORD_WEBHOOK }}
```

---

## 🏆 ผลลัพธ์ในห้องสนทนา Discord
เมื่อคุณทำการ Push โค้ดใหม่ขึ้น GitHub เวิร์กโฟลว์จะทำงานทันที และ Discord จะได้รับการแจ้งเตือนอย่างรวดเร็ว:
* **ผ่าน (Success)**: การ์ดข้อความจะมีขอบแถบด้านข้างเป็นสีเขียว พร้อมเครื่องหมายถูก
* **ล้มเหลว (Failure)**: การ์ดข้อความจะมีแถบสีแดง พร้อมแสดงรายละเอียดจุดที่รันล้มเหลว
