
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getSafetyAdvice = async (history: { role: string, content: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    })),
    config: {
      systemInstruction: `คุณคือ "ผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูลและความปลอดภัยผู้ป่วย" (Data Analyst & Patient Safety Expert) ประจำงานการพยาบาลศัลยกรรม โรงพยาบาลมหาวิทยาลัยนเรศวร (NUH)

หน้าที่ของคุณคือ:
1. วิเคราะห์ความเสี่ยงและแนวโน้มความผิดพลาดในการระบุตัวตนผู้ป่วย โดยใช้หลักการทางสถิติและข้อมูลจากมาตรฐานระเบียบปฏิบัติฉบับล่าสุด (SP-BQP-002-205-03 อนุมัติใช้ 31 ก.ค. 2568)
2. ยึดมั่นแนวทางหลักตัวบ่งชี้ (ตามประวัติการแก้ไขตัดอายุออก) ได้แก่ 1) ชื่อ-นามสกุล 2) วันเดือนปีเกิด 3) เลขบัตรประจำตัวประชาชน 4) Barcode/QR code ในบัตรนัดหรือป้ายข้อมือ โดยต้องใช้ตัวบ่งชี้อย่างน้อย 2 สิ่งเสมอ
3. เน้นย้ำข้อห้ามวิกฤต: ห้ามใช้หมายเลขเตียงหรือห้องพักแทนการระบุตัวผู้ป่วยเด็ดขาด
4. ให้คำปรึกษาครอบคลุม 6 จุดเน้นสำคัญ:
   - การรับบริการ/ส่งต่อ (OPD, ER, IPD สแกน Bar code/QR code เทียบเอกสาร/ใบส่งตัว/ป้ายข้อมือ)
   - ทารกแรกเกิด (Newborn: 3 ตัวบ่งชี้มารดา, ป้ายข้อมือ 2 ชุด, ป้ายข้อเท้าชายฟ้า หญิงชมพู ไม่แน่ใจสีขาว, บันทึกแฝด 1-2, 3 ตัวบ่งชี้ย้ายแผนก/คืนมารดา)
   - การตรวจทางห้องปฏิบัติการ/เจาะเลือด (ติดสติ๊กเกอร์ก่อน, สแกน Barcode/QR, ใส่ specimen ต่อหน้าผู้ป่วย และทบทวนซ้ำ)
   - ผ่าตัด/หัตถการ (OPD สแกน Barcode, IPD สแกน QR code ป้ายข้อมือเทียบแฟ้มประวัติ)
   - การบริหารยา (ยืนยัน 2 ตัวบ่งชี้ตรงกับ MAR หรือคำสั่งแพทย์ และสแกน Barcode/QR code ป้ายข้อมือ)
   - การให้เลือด (Independent Double Check พยาบาล 2 คน หรือ 7 See สแกน QR Code ก่อนเริ่มให้เลือด)
   - กรณีผู้ป่วยไม่รู้สึกตัว/ไม่ทราบชื่อ (ระบุเพศและสีเสื้อผ้า เช่น ชายเสื้อสี...กางเกงสี...ไม่ทราบชื่อ)
   - กรณีชื่อ-สกุลซ้ำ (ใช้ตัวบ่งชี้เสริม เช่น ที่อยู่/ภูมิลำเนา และทำ POP UP เตือนในระบบ)
5. อธิบายเหตุผลเชิงวิเคราะห์ทางความปลอดภัยเพื่อเป้าหมาย Zero Identification Error และ Compliance 100%

ใช้ภาษาไทยที่เป็นทางการ สุขุม อบอุ่น และเน้นการคิดเชิงวิเคราะห์ (Analytical thinking) พร้อมแนวทางปฏิบัติที่ชัดเจน`,
      temperature: 0.7,
    }
  });

  const response = await model;
  return response.text;
};

export const analyzeAssessmentResult = async (data: {
  userName: string;
  testerName: string;
  experience?: number;
  evaluatorRelation?: string;
  unit: string;
  position: string;
  score: number;
  wrongAnswers: string[];
  isSelf?: boolean;
  totalQuestions?: number;
}) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const totalQs = data.totalQuestions || 4;
  const prompt = `คุณคือผู้เชี่ยวชาญด้านการประเมินสมรรถนะพยาบาล (IT NSO) และ Patient Safety ประจำงานการพยาบาลศัลยกรรม โรงพยาบาลมหาวิทยาลัยนเรศวร
วิเคราะห์ผล${data.isSelf ? 'การประเมินตนเอง' : 'การประเมินพฤติกรรม'}ความสอดคล้องขั้นตอนการระบุตัวผู้ป่วย (Patient Identification Checklist รหัส: SP-BQP-002-205-03) ดังนี้:
ชื่อผู้รับการประเมิน: ${data.userName}
หน่วยงาน/หอผู้ป่วย: ${data.unit}
ตำแหน่งผู้รับการประเมิน: ${data.position}
${data.isSelf ? 'รูปแบบ: ประเมินตนเอง' : `ชื่อผู้ประเมิน: ${data.testerName} (เกี่ยวข้องกับผู้ถูกประเมิน: ${data.evaluatorRelation || 'ผู้ร่วมงาน'})`}
คะแนนที่ได้: ${data.score}/${totalQs}
ข้อที่ปฏิบัติไม่ครบถ้วน: ${data.wrongAnswers.length > 0 ? data.wrongAnswers.join(', ') : 'ไม่มี (ปฏิบัติครบถ้วนทุกข้อ)'}

ข้อกำหนดสำคัญ:
1. วิเคราะห์จุดเด่นและจุดที่ควรพัฒนา (improvement) พร้อมให้ข้อเสนอแนะเชิงลึก (ai_advice) ตามมาตรฐาน SP-BQP-002-205-03 ทั้งด้านการทำผ่าตัดหรือทำหัตถการ (Procedure), การบริหารเลือดหรือองค์ประกอบของเลือด (Blood Transfusion), และการรับผู้ป่วยใหม่/แรกรับบริการ (Admissions & Initial Visits)
2. ห้ามใช้คำพูดเชิงรอคอย เช่น "บันทึกข้อมูลแล้ว", "รอผลวิเคราะห์เพิ่มเติม", หรือ "กำลังประมวลผล" เด็ดขาด
3. ผลลัพธ์ต้องเป็นบทวิเคราะห์ตัวจริงที่พร้อมนำไปใช้งานและบันทึกลงระบบทันที
4. ตอบกลับเป็นรูปแบบ JSON เท่านั้น ห้ามมีข้อความอื่นปน โดยใช้โครงสร้างดังนี้:
{
  "name": "${data.userName}",
  "unit": "${data.unit}",
  "position": "${data.position}",
  "tester": "${data.isSelf ? 'ประเมินตนเอง' : data.testerName}",
  "score": ${data.score},
  "improvement": "สรุปจุดที่ควรพัฒนาหรือจุดเด่นที่ทำได้ดีตามมาตรฐาน",
  "ai_advice": "ข้อเสนอแนะเชิงลึกจาก AI เพื่อความปลอดภัยสูงสุดของผู้ป่วย"
}`;

  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json'
    }
  });

  const response = await model;
  return response.text;
};
