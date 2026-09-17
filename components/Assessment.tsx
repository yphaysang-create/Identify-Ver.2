
import React, { useState, useEffect } from 'react';
import { AssessmentQuestion } from '../types';
import { analyzeAssessmentResult } from '../services/geminiService';
import { saveAssessmentToGAS } from '../services/sheetService';
import { 
  CheckCircle, 
  ArrowRight, 
  RotateCcw, 
  BarChart2, 
  ShieldCheck, 
  UserCheck, 
  Beaker, 
  Stethoscope, 
  Droplet, 
  AlertCircle,
  Trophy,
  Medal,
  Star,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from '../types';

const BADGES: Badge[] = [
  { id: 'champion', name: 'Safety Champion', description: 'ปฏิบัติครบถ้วน 100%', icon: 'Trophy', color: 'text-yellow-500' },
  { id: 'master', name: 'Compliance Master', description: 'ปฏิบัติถูกต้องมากกว่า 90%', icon: 'Medal', color: 'text-indigo-500' },
  { id: 'guardian', name: 'Safety Guardian', description: 'ปฏิบัติถูกต้องมากกว่า 80%', icon: 'ShieldCheck', color: 'text-emerald-500' },
  { id: 'star', name: 'Rising Star', description: 'เริ่มต้นการเรียนรู้ความปลอดภัย', icon: 'Star', color: 'text-amber-500' },
];

// Questions derived directly from the latest OCR Compliance Checklist (SP-BQP-002-205-03)
const COMPLIANCE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    activity: "การทำผ่าตัดหรือทำหัตถการ (Procedure)",
    title: "ยืนยันตัวตนผู้ป่วย (Active ID)",
    question: "สอบถาม ยืนยันชื่อและสกุลและ วันเดือนปีเกิดหรือ เลขบัตรประชาชน หรือที่อยู่ หรือชื่อบิดามารดาผู้ป่วยหรือร่วมกับสแกน QR Codeป้ายข้อมือก่อนทำหัตถการหรือส่งห้องผ่าตัด",
    options: ["ปฏิบัติครบ", "ไม่ครบ", "ไม่มีข้อมูล"],
    category: 'behavior'
  },
  {
    id: 2,
    activity: "การบริหารเลือดหรือองค์ประกอบของเลือด (Blood Transfusion)",
    title: "ยืนยันตัวตนก่อนเจาะเก็บเลือด/ก่อนให้เลือด",
    question: "สอบถาม ยืนยันชื่อและสกุลและ วันเดือนปีเกิดหรือ เลขบัตรประชาชน หรือที่อยู่ หรือชื่อบิดามารดาผู้ป่วยก่อนการบริหารเลือดหรือองค์ประกอบของเลือด (Blood Transfusion) หรือตรวจสอบร่วมกับสแกน QR Codeที่ป้ายข้อมือ",
    options: ["ปฏิบัติครบ", "ไม่ครบ", "ไม่มีข้อมูล"],
    category: 'behavior'
  },
  {
    id: 3,
    activity: "การบริหารเลือดหรือองค์ประกอบของเลือด (Blood Transfusion)",
    title: "ตรวจสอบอิสระ 2 คน (Independent Double Check)",
    question: "พยาบาล 2 คนร่วมทวนสอบข้อมูลผู้ป่วย ถุงเลือด และเอกสารให้ตรงกันก่อนเริ่มให้เลือด",
    options: ["ปฏิบัติครบ", "ไม่ครบ", "ไม่มีข้อมูล"],
    category: 'behavior'
  },
  {
    id: 4,
    activity: "การรับผู้ป่วยใหม่/แรกรับบริการ (Admissions & Initial Visits)",
    title: "ระบุตัวตนแรกรับ (Initial Active ID)",
    question: "สอบถาม ชื่อและสกุลและ วันเดือนปีเกิดหรือ เลขบัตรประชาชน หรือที่อยู่ หรือชื่อบิดามารดาผู้ป่วยหรือร่วมกับสแกน QR Codeป้ายข้อมือ",
    options: ["ปฏิบัติครบ", "ไม่ครบ", "ไม่มีข้อมูล"],
    category: 'behavior'
  }
];

interface AssessmentProps {
  isSelfAssessment?: boolean;
}

const Assessment: React.FC<AssessmentProps> = ({ isSelfAssessment = false }) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for Pre-assessment form
  const [userName, setUserName] = useState('');
  const [unit, setUnit] = useState('');
  const [position, setPosition] = useState('');
  const [testerName, setTesterName] = useState(isSelfAssessment ? 'ประเมินตนเอง' : '');
  const [evaluatorRelation, setEvaluatorRelation] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [points, setPoints] = useState(0);

  const isPnOrNa = Boolean(
    position && (
      position.toUpperCase().includes('PN') || 
      position.toUpperCase().includes('NA') ||
      position.includes('ผู้ช่วยพยาบาล') ||
      position.includes('พยาบาลเทคนิค')
    )
  );

  // ตำแหน่ง PN และ NA ประเมิน 2 กิจกรรมเท่านั้น: การทำผ่าตัดหรือทำหัตถการ (Procedure) และ การรับผู้ป่วยใหม่/แรกรับบริการ (Admissions & Initial Visits)
  const activeQuestions = isPnOrNa 
    ? COMPLIANCE_QUESTIONS.filter(q => 
        (q.activity?.includes('ผ่าตัด') || q.activity?.includes('Procedure') || 
         q.activity?.includes('รับผู้ป่วย') || q.activity?.includes('Admissions')) &&
        !q.activity?.includes('เลือด') && !q.activity?.includes('Blood')
      )
    : COMPLIANCE_QUESTIONS;

  // Sync testerName if isSelfAssessment property changes or mounts
  useEffect(() => {
    if (isSelfAssessment) {
      setTesterName('ประเมินตนเอง');
      setEvaluatorRelation('ตนเอง');
    } else if (testerName === 'ประเมินตนเอง') {
      setTesterName('');
      setEvaluatorRelation('');
    }
  }, [isSelfAssessment]);

  // Auto-submit when assessment is finished
  useEffect(() => {
    if (showResult && submitStatus === 'idle' && !isSubmitting) {
      handleSubmit();
    }
  }, [showResult]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelfAssessment) {
      if (userName && unit && position) {
        setTesterName('ประเมินตนเอง');
        setEvaluatorRelation('ตนเอง');
        setCurrentStep(0);
      }
    } else {
      if (testerName && unit && evaluatorRelation && userName && position) {
        setCurrentStep(0);
      }
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateRawScore = () => {
    let score = 0;
    answers.forEach((ans) => {
      if (ans === 0) score += 1;
    });
    return score;
  };

  const calculateCompliancePercentage = () => {
    let totalScore = 0;
    let validAnswersCount = 0;

    answers.forEach((ans) => {
      if (ans === 2) return; // Skip "ไม่มีข้อมูล"
      
      validAnswersCount++;
      if (ans === 0) totalScore += 100;
    });

    if (validAnswersCount === 0) return 0;
    return Math.round(totalScore / validAnswersCount);
  };

  const calculatePointsAndBadges = (percentage: number) => {
    let earnedPoints = percentage * 10;
    if (percentage === 100) earnedPoints += 500; // Bonus for perfect score
    
    const newBadges: Badge[] = [];
    if (percentage === 100) newBadges.push(BADGES[0]);
    if (percentage >= 90) newBadges.push(BADGES[1]);
    if (percentage >= 80) newBadges.push(BADGES[2]);
    if (percentage > 0) newBadges.push(BADGES[3]);

    setPoints(earnedPoints);
    setEarnedBadges(newBadges);
    return { earnedPoints, newBadges };
  };

  const getWrongAnswers = () => {
    return answers
      .map((ans, idx) => {
        if (ans === 1) {
          return `ข้อ ${activeQuestions[idx].id} [${activeQuestions[idx].title}]: ไม่ครบ`;
        }
        return null;
      })
      .filter(Boolean) as string[];
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    const rawScore = calculateRawScore();
    const complianceRate = calculateCompliancePercentage();
    calculatePointsAndBadges(complianceRate);
    const wrongAnswers = getWrongAnswers();
    
    // Prepare expert fallbacks in case AI is offline or has issues
    const defaultImprovement = wrongAnswers.length > 0 ? wrongAnswers.join(', ') : "ไม่มีข้อปฏิบัติที่ผิดพลาด ปฏิบัติได้ครบถ้วนสมบูรณ์ 100%";
    let defaultAiAdvice = "การปฏิบัติงานถูกต้องสอดคล้องตามมาตรฐาน SP-BQP-002-205-03";
    
    if (complianceRate === 100) {
      defaultAiAdvice = "จากการประเมินผู้รับการประเมินปฏิบัติงานระบุตัวตนผู้ป่วยได้ดีเยี่ยมครบถ้วนร้อยละ 100 สอดคล้องตามมาตรฐาน SP-BQP-002-205-03 แนะนำให้ปฏิบัติดีอย่างต่อเนื่องและเป็นโมเดลต้นแบบ (Safety Idol) ประจำหน่วยงานเพื่อบรรลุเป้าหมาย Zero Identification Error ต่อไป";
    } else if (complianceRate >= 90) {
      defaultAiAdvice = "ผ่านเกณฑ์ระดับปฏิบัติงานดีเยี่ยม (Compliance Score ระดับสูงพิเศษ) พบโอกาสพัฒนายืนยันตัวตนในบางส่วนเท่านั้น ควรเน้นย้ำความตระหนักรู้เฉพาะจุดเพื่อความปลอดภัยขั้นสูงสุดในการดูแลผู้ป่วย";
    } else if (complianceRate >= 80) {
      defaultAiAdvice = "ระดับการระบุตัวตนมีความถูกต้องอยู่ในเกณฑ์ยอมรับได้ ควรทบทวนความเข้าใจในจุดที่คลาดเคลื่อนให้ครบถ้วนก่อนการปฏิบัติหน้าที่ และรักษาวินัยความระมัดระวังในการดูแลผู้ป่วยโดยสแกนหรือตรวจสอบชื่อ-สกุล วันเกิด/เลขบัตรประชาชน ร่วมด้วยทุกครั้ง";
    } else {
      defaultAiAdvice = "ระดับความถูกต้องในการระบุตัวตนต่ำกว่าเกณฑ์มาตรฐานความปลอดภัยของทีมการพยาบาล สมควรได้รับการแนะแนวทางปฏิบัติ (Re-training) ตาม SOP-SP-BQP-002-205-03 จากหัวหน้าหอผู้ป่วยหรือ Clinical Mentor ด้านการพยาบาลศัลยกรรม และทบทวนขั้นตอนอย่างใกล้ชิดเพื่อพัฒนาตนเอง";
    }

    let finalImprovement = defaultImprovement;
    let finalAiAdvice = defaultAiAdvice;

    // 1. Fetch deep analysis from AI first
    try {
      const aiResponse = await analyzeAssessmentResult({
        userName,
        testerName: isSelfAssessment ? 'ประเมินตนเอง' : testerName,
        evaluatorRelation: isSelfAssessment ? 'ตนเอง' : evaluatorRelation,
        unit,
        position,
        experience: 0,
        score: rawScore,
        wrongAnswers,
        isSelf: isSelfAssessment,
        totalQuestions: activeQuestions.length
      });
      
      if (aiResponse) {
        const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedAnalysis = JSON.parse(cleanJson);
        finalImprovement = parsedAnalysis.improvement || defaultImprovement;
        finalAiAdvice = parsedAnalysis.ai_advice || defaultAiAdvice;
      }
    } catch (aiError) {
      console.error("AI Analysis error, using expert system default:", aiError);
    }

    // Set the complete analysis result to state so the UI updates natively with actual reports
    setAiAnalysis({
      improvement: finalImprovement,
      ai_advice: finalAiAdvice
    });

    // 2. Save complete analytical data to Google Sheet immediately (Ensures no placeholder rows exist)
    try {
      const validCount = answers.filter(a => a !== 2).length;
      const scoreString = `${rawScore}/${validCount || activeQuestions.length} (${complianceRate}%)`;

      const success = await saveAssessmentToGAS({
        fullName: userName,
        department: unit,
        position: position,
        staffName: isSelfAssessment ? 'ประเมินตนเอง' : testerName,
        evaluatorRelation: isSelfAssessment ? 'ตนเอง' : evaluatorRelation,
        experience: 0,
        score: scoreString,
        developmentPoint: finalImprovement,
        aiRecommendation: finalAiAdvice,
        sheetName: isSelfAssessment ? "self assessment" : "Identify"
      });

      if (success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Submission to Google Apps Script failed:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const complianceRate = calculateCompliancePercentage();

  const chartData = [
    { name: 'สอดคล้อง (Compliance)', value: complianceRate, color: '#6366f1' }, // indigo-500
    { name: 'ความเสี่ยง (Gap)', value: 100 - complianceRate, color: '#f1f5f9' }, // slate-100
  ];

  const getStepIcon = (index: number) => {
    const q = activeQuestions[index];
    if (q?.activity?.includes('ผ่าตัด') || q?.activity?.includes('Procedure')) return <Stethoscope size={24} />;
    if (q?.activity?.includes('เลือด') || q?.activity?.includes('Blood')) return <Droplet size={24} />;
    if (q?.activity?.includes('รับผู้ป่วย') || q?.activity?.includes('Admissions')) return <UserCheck size={24} />;
    return <ShieldCheck size={24} />;
  };

  // Pre-assessment Form
  if (currentStep === -1) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/60 border border-indigo-100/80 animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/40 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-sky-100 via-indigo-100 to-purple-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <UserCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              {isSelfAssessment ? 'ข้อมูลผู้ประเมินตนเอง' : 'ข้อมูลการประเมินพฤติกรรม'}
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {isSelfAssessment ? 'โปรดระบุข้อมูลส่วนตัวของท่านเพื่อบันทึกผลการประเมินตนเอง' : 'โปรดระบุข้อมูลผู้ประเมินและผู้รับการประเมินเพื่อบันทึกผลพฤติกรรม'}
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-6 relative z-10">
            {!isSelfAssessment ? (
              <div className="space-y-5">
                {/* 1. ข้อมูลผู้ประเมิน */}
                <div className="bg-gradient-to-br from-indigo-50/70 via-sky-50/40 to-white p-5 rounded-3xl border border-indigo-100 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-indigo-100/80">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">1</span>
                    <h3 className="font-bold text-indigo-950 text-sm">ข้อมูลผู้ประเมิน</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                      ชื่อผู้ประเมิน <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      required
                      type="text" 
                      value={testerName}
                      onChange={(e) => setTesterName(e.target.value)}
                      placeholder="ระบุชื่อ-นามสกุล ผู้ประเมิน"
                      className="w-full p-3.5 bg-white border border-indigo-100 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                        หน่วยงาน <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        required
                        type="text" 
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="เช่น ศัลยกรรมชาย"
                        className="w-full p-3.5 bg-white border border-indigo-100 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                        เกี่ยวข้องกับผู้ถูกประเมิน <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        required
                        value={evaluatorRelation}
                        onChange={(e) => setEvaluatorRelation(e.target.value)}
                        className="w-full p-3.5 bg-white border border-indigo-100 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium text-slate-700"
                      >
                        <option value="" disabled>เลือกความเกี่ยวข้อง</option>
                        <option value="ผู้ร่วมงาน">ผู้ร่วมงาน</option>
                        <option value="หัวหน้าเวร">หัวหน้าเวร</option>
                        <option value="หัวหน้าหอ">หัวหน้าหอ</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. ข้อมูลผู้ถูกประเมิน */}
                <div className="bg-gradient-to-br from-purple-50/70 via-pink-50/40 to-white p-5 rounded-3xl border border-purple-100 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-purple-100/80">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">2</span>
                    <h3 className="font-bold text-purple-950 text-sm">ข้อมูลผู้ถูกประเมิน</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                      ชื่อผู้ถูกประเมิน <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      required
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="ระบุชื่อ-นามสกุล ผู้ถูกประเมิน"
                      className="w-full p-3.5 bg-white border border-purple-100 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                      ตำแหน่ง <span className="text-rose-500">*</span>
                    </label>
                    <select 
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full p-3.5 bg-white border border-purple-100 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm font-medium text-slate-700"
                    >
                      <option value="" disabled>เลือกตำแหน่ง</option>
                      <option value="RN">RN (พยาบาลวิชาชีพ)</option>
                      <option value="PN">PN (พยาบาลเทคนิค)</option>
                      <option value="NA">NA (ผู้ช่วยพยาบาล)</option>
                    </select>
                  </div>
                </div>
                {isPnOrNa && (
                  <div className="p-3 bg-sky-50/80 border border-sky-100 rounded-2xl text-xs text-sky-900 flex items-start gap-2 shadow-xs">
                    <span className="text-sm">📌</span>
                    <div>
                      <span className="font-bold">ตำแหน่ง {position}:</span> ประเมิน 2 กิจกรรมตามเกณฑ์มาตรฐาน ได้แก่ <strong>การทำผ่าตัดหรือทำหัตถการ (Procedure)</strong> และ <strong>การรับผู้ป่วยใหม่/แรกรับบริการ (Admissions & Initial Visits)</strong>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    ชื่อ-นามสกุล ของตนเอง <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="ระบุชื่อ-นามสกุล"
                    className="w-full p-4 bg-slate-50/80 border border-indigo-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">หน่วยงาน <span className="text-rose-500">*</span></label>
                    <input 
                    required
                    type="text" 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="เช่น ศัลยกรรมชาย"
                    className="w-full p-4 bg-slate-50/80 border border-indigo-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">ตำแหน่ง <span className="text-rose-500">*</span></label>
                  <select 
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-4 bg-slate-50/80 border border-indigo-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all"
                  >
                    <option value="" disabled>เลือกตำแหน่ง</option>
                    <option value="RN">RN (พยาบาลวิชาชีพ)</option>
                    <option value="PN">PN (พยาบาลเทคนิค)</option>
                    <option value="NA">NA (ผู้ช่วยพยาบาล)</option>
                  </select>
                </div>
              </div>
              {isPnOrNa && (
                <div className="p-3 bg-sky-50/80 border border-sky-100 rounded-2xl text-xs text-sky-900 flex items-start gap-2 shadow-xs">
                  <span className="text-sm">📌</span>
                  <div>
                    <span className="font-bold">ตำแหน่ง {position}:</span> ประเมิน 2 กิจกรรมตามเกณฑ์มาตรฐาน ได้แก่ <strong>การทำผ่าตัดหรือทำหัตถการ (Procedure)</strong> และ <strong>การรับผู้ป่วยใหม่/แรกรับบริการ (Admissions & Initial Visits)</strong>
                  </div>
                </div>
              )}
            </div>
          )}
            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white rounded-2xl font-bold hover:opacity-95 transition-all shadow-lg shadow-indigo-200 active:scale-95 cursor-pointer mt-4"
            >
              {isSelfAssessment ? 'เริ่มทำแบบประเมินตนเอง' : 'เริ่มการประเมิน'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const getBadgeIcon = (iconName: string, color: string) => {
    switch(iconName) {
      case 'Trophy': return <Trophy className={color} size={24} />;
      case 'Medal': return <Medal className={color} size={24} />;
      case 'ShieldCheck': return <ShieldCheck className={color} size={24} />;
      case 'Star': return <Star className={color} size={24} />;
      default: return <Zap className={color} size={24} />;
    }
  };

  if (showResult) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 animate-fadeIn max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32"></div>
        <header className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <BarChart2 size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">
            {isSelfAssessment ? 'ผลการประเมินตนเอง' : 'ดัชนีความสอดคล้อง (Compliance Index)'}
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {isSelfAssessment 
              ? `ผู้ประเมินตนเอง: ${userName} • หน่วยงาน: ${unit} (${position})` 
              : `ผู้ถูกประเมิน: ${userName} (${position}) • ผู้ประเมิน: ${testerName} (${evaluatorRelation || 'ผู้ร่วมงาน'}) • หน่วยงาน: ${unit}`
            }
          </p>
          
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="bg-amber-50 px-4 py-2 rounded-full border border-amber-100 flex items-center gap-2">
              <Zap className="text-amber-500" size={18} />
              <span className="font-bold text-amber-700">{points} Points Earned</span>
            </div>
          </div>
        </header>

        {/* Badges Section */}
        {earnedBadges.length > 0 && (
          <div className="mb-10 relative z-10">
            <h4 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Badges Earned</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 animate-bounce-subtle">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    {getBadgeIcon(badge.icon, badge.color)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{badge.name}</p>
                    <p className="text-[10px] text-slate-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-10 items-center mb-10 relative z-10">
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-black text-slate-800 tracking-tighter">{complianceRate}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Compliance</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border-2 ${complianceRate >= 90 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                {complianceRate >= 90 ? <ShieldCheck className="text-emerald-600" /> : <AlertCircle className="text-amber-600" />}
                <h4 className={`font-bold ${complianceRate >= 90 ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {complianceRate >= 90 ? 'ระดับความปลอดภัยสูงมาก' : 'ต้องการการปรับปรุงพฤติกรรม'}
                </h4>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                {aiAnalysis ? (
                  <>
                    <div>
                      <p className="font-bold text-slate-800">ประเด็นที่ควรพัฒนา:</p>
                      <p>{aiAnalysis.improvement}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">คำแนะนำเชิงลึกจาก AI:</p>
                      <p>{aiAnalysis.ai_advice}</p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 py-2 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              {isSubmitting && (
                <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl text-center font-bold flex items-center justify-center gap-2 animate-pulse">
                  <RotateCcw className="animate-spin" size={20} /> กำลังบันทึกข้อมูลอัตโนมัติ...
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl text-center font-bold flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> บันทึกข้อมูลลง Google Sheet สำเร็จ
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-rose-100 text-rose-700 rounded-2xl text-center font-bold flex flex-col gap-2">
                  <span>เกิดข้อผิดพลาดในการบันทึกข้อมูล</span>
                  <button 
                    onClick={handleSubmit}
                    className="text-xs underline font-normal hover:text-rose-900 transition-colors"
                  >
                    ลองใหม่อีกครั้ง
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
          <button 
            onClick={() => {
              setCurrentStep(-1);
              setAnswers([]);
              setShowResult(false);
              setSubmitStatus('idle');
              setTesterName(isSelfAssessment ? 'ประเมินตนเอง' : '');
              setEvaluatorRelation(isSelfAssessment ? 'ตนเอง' : '');
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white rounded-2xl font-bold hover:opacity-95 transition-all shadow-lg shadow-indigo-200 active:scale-95 cursor-pointer"
          >
            <RotateCcw size={20} />
            {isSelfAssessment ? 'เริ่มทำประเมินตนเองใหม่' : 'เริ่มต้นประเมินใหม่'}
          </button>
          <p className="text-[10px] text-slate-400 max-w-[200px] text-center sm:text-left font-medium">
            *ผลการประเมินนี้อ้างอิงจาก Compliance Checklist งานพยาบาลศัลยกรรม NUH
          </p>
        </div>
      </div>
    );
  }

  const question = activeQuestions[currentStep];

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">
          {isSelfAssessment ? 'แบบประเมินตนเอง (Self-Assessment)' : 'แบบประเมินพฤติกรรม (Behavior Assessment)'}
        </h2>
        <p className="text-slate-500 font-medium">
          {isSelfAssessment 
            ? 'ทบทวนและตรวจสอบความสอดคล้องตามมาตรฐานการระบุตัวตนผู้ป่วยด้วยตนเอง' 
            : 'ตรวจสอบและรักษาระดับมาตรฐานพฤติกรรมการระบุตัวตนผู้ป่วยประจำทีม (Compliance Check)'
          } (SOP-SP-BQP-002-205-03)
        </p>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              {getStepIcon(currentStep)}
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Section {currentStep + 1}</p>
              <p className="text-slate-400 text-xs font-bold uppercase">Compliance Audit</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-800">{currentStep + 1}</span>
            <span className="text-slate-300 font-bold"> / {activeQuestions.length}</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/80 shadow-inner">
          <div 
            className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 h-full transition-all duration-700 ease-out" 
            style={{ width: `${((currentStep + 1) / activeQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/60 border border-indigo-100/80 animate-slideUp relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500"></div>

        {/* Activity & Section indicator */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`inline-flex items-center rounded-full font-black shadow-sm transition-all ${
            question.activity?.includes('ผ่าตัด') || question.activity?.includes('Procedure')
              ? 'px-4 py-1.5 text-sm sm:text-base bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-300 ring-2 ring-orange-200'
              : question.activity?.includes('เลือด') || question.activity?.includes('Blood')
              ? 'px-4 py-1.5 text-sm sm:text-base bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 text-white shadow-rose-300 ring-2 ring-rose-200'
              : question.activity?.includes('รับผู้ป่วย') || question.activity?.includes('Admissions')
              ? 'px-4 py-1.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-blue-300 ring-2 ring-blue-200'
              : 'px-4 py-1.5 text-sm sm:text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-indigo-300 ring-2 ring-indigo-200'
          }`}>
            {question.activity}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            ข้อ {currentStep + 1} จาก {activeQuestions.length}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 leading-snug">
          {question.title}
        </h3>
        
        <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-indigo-100/60 mb-8">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {question.question}
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full text-left p-5 sm:p-6 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center justify-between group active:scale-[0.98] ${
                index === 0 
                ? 'bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border-emerald-200/80 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white shadow-xs' 
                : index === 1
                ? 'bg-gradient-to-r from-amber-50/60 to-rose-50/50 border-amber-200/70 hover:border-amber-400 hover:bg-amber-100/60 text-slate-800 shadow-xs'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100 text-slate-600 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  index === 0 
                    ? 'bg-emerald-100 text-emerald-700 group-hover:bg-white group-hover:text-emerald-600' 
                    : index === 1
                    ? 'bg-amber-100 text-amber-700 group-hover:bg-amber-200'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {index === 0 ? '✓' : index === 1 ? '✗' : '-'}
                </span>
                <span className="font-bold text-lg">{option}</span>
              </div>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors group-hover:scale-110 ${
                index === 0 ? 'border-emerald-200 group-hover:border-white' : 'border-slate-200'
              }`}>
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>

        {currentStep > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setAnswers(answers.slice(0, -1));
                setCurrentStep(currentStep - 1);
              }}
              className="text-xs text-slate-400 hover:text-indigo-600 font-semibold flex items-center gap-1 transition-colors"
            >
              ← ย้อนกลับไปข้อก่อนหน้า
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-slate-400">
        <ShieldCheck size={14} className="text-indigo-400" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Data Analysis & Safety Verification System</p>
      </div>
    </div>
  );
};

export default Assessment;
