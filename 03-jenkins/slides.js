// Fallback slides data for offline use (CORS file:// fallback)

const jenkinsMarkdown = `---
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

# เจาะลึกการใช้งาน Jenkins CI/CD (Upcoming)
## การตั้งค่าเซิร์ฟเวอร์และระบบ Pipeline อัตโนมัติในระดับองค์กร

**บทเรียนถัดไป: เตรียมสร้าง Jenkinsfile และบูรณาการแอปพลิเคชันของคุณ**

---

## 1. Jenkins คืออะไร? (Introduction)
Jenkins คือ **เครื่องมือสำหรับทำระบบอัตโนมัติแบบ Open-source (Automation Server)** ที่ช่วยประสานกระบวนการประกอบร่างโค้ด (Build) ทดสอบ (Test) และส่งต่อซอฟต์แวร์ (Deploy)

*   **ขับเคลื่อนด้วยปลั๊กอิน (Plugin-Driven)**: มีระบบนิเวศน์ปลั๊กอินขนาดใหญ่ รองรับการทำงานกับเครื่องมือและคลาวด์ทุกค่าย
*   **นิยามด้วยโค้ด (Pipeline as Code)**: เขียนควบคุมกระบวนการทั้งหมดลงในไฟล์ \`Jenkinsfile\`
*   **ติดตั้งและบริหารจัดการเอง (Self-Hosted)**: ทำงานบนเครื่องคอมพิวเตอร์หรือเครื่องเซิร์ฟเวอร์ส่วนตัวของคุณ

---

## 2. โครงสร้างเบื้องต้นของ Jenkinsfile (Declarative Pipeline)
ตัวอย่างโครงสร้างมาตรฐานในการเขียนสคริปต์ควบคุม Jenkins Pipeline:

\`\`\`groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
            }
        }
    }
}
\`\`\`
---

## 3. สิ่งที่เราจะได้เรียนรู้ในบทถัดไป
*   การติดตั้ง Jenkins Server และ Jenkins Agent (Master & Agent nodes)
*   การเขียน Jenkinsfile (Declarative vs Scripted Pipeline)
*   การเชื่อมต่อ Webhook จาก GitHub เพื่อเริ่มรัน Jenkins อัตโนมัติเมื่อเกิดการ Push
*   การนำภาพรวมของ Jenkins เชื่อมต่อแจ้งเตือนเข้าสู่แชนเนล Discord/Slack
\`;
