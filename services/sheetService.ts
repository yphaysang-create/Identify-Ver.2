// 🟢 ใส่ URL ตัวล่าสุดที่ได้จากหน้า Google Apps Script (ที่ลงท้ายด้วย /exec) ตรงนี้ไปเลยค่ะ
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbzsQkQmnmGOm3n0wilOBbeJAnSPkv47cnyz0oFiiyBhAF8GrGAYe6YhGKZoK_JY8wIG/exec";

export interface GASAssessmentPayload {
  fullName: string;
  department: string;
  position: string;
  experience?: number;
  evaluatorRelation?: string;
  score: string;
  developmentPoint: string;
  aiRecommendation: string;
  sheetName?: string;
  staffName?: string;
}

export const saveAssessmentToGAS = async (data: GASAssessmentPayload): Promise<boolean> => {
  if (!SCRIPT_URL || SCRIPT_URL.includes("YOUR_")) {
    console.error("Google Apps Script URL is not properly configured.");
    return false;
  }
  
  try {
    // ใช้โหมด text/plain ร่วมกับ URL ที่ถูกต้องตรงไปตรงมา
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });
    
    return true;
  } catch (error) {
    console.error("Error saving assessment to Google Apps Script:", error);
    return false;
  }
};
