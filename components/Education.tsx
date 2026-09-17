
import React from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, Video, FileText, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';

const Education: React.FC = () => {
  const videoLinks = [
    { ward: 'หอผู้ป่วย ENT', url: 'https://drive.google.com/file/d/1iRWgBHImC8dfAkmtryOCQy6T3bBWJKMv/view?usp=sharing' },
    { ward: 'หอผู้ป่วย VIP Ortho', url: 'https://drive.google.com/file/d/1tPstWlRJrvOMHHLOD7PN6C9eSLuRYiPM/view?usp=sharing' },
    { ward: 'หอผู้ป่วย Surg1', url: 'https://drive.google.com/file/d/1h7CMYjdGaPqnkUnjFIU5HjewIBA9kHwK/view?usp=sharing' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <span>SOP: SP-BQP-002-205-03</span>
          <span className="text-[10px] text-indigo-500 font-normal">| อนุมัติใช้ 31 ก.ค. 2568</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Identify ดีไม่มีผิดพลาด</h2>
        <p className="text-slate-600 font-medium">
          ระเบียบปฏิบัติ: การระบุตัวผู้ป่วย (Patient Identification) • งานการพยาบาลศัลยกรรม คณะแพทยศาสตร์ มหาวิทยาลัยนเรศวร
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white via-white to-sky-50/70 p-6 rounded-3xl shadow-sm border border-sky-100 hover:shadow-xl hover:border-sky-300 transition-all group">
          <div className="w-12 h-12 bg-sky-100/80 text-sky-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-800">เป้าหมายและเกณฑ์ชี้วัด (Goals & KPIs)</h3>
          <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full shadow-md shadow-sky-500/50 mt-2"></div>
              <span className="font-medium">จำนวนอุบัติการณ์การระบุตัวตนผิดพลาดเป็น <strong>"ศูนย์" (Zero Error)</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full shadow-md shadow-sky-500/50 mt-2"></div>
              <span className="font-medium">ร้อยละการปฏิบัติตามแนวทางการระบุตัวผู้ป่วย โดยตรวจสอบจากระบบการสแกน Bar code/QR code <strong>100%</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full shadow-md shadow-sky-500/50 mt-2"></div>
              <span className="font-medium">ป้องกันการระบุตัวผู้ป่วยผิดพลาดในทุกขั้นตอนการบริการ (ทุกหัตถการ/ทุกแผนก)</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-white via-white to-purple-50/70 p-6 rounded-3xl shadow-sm border border-purple-100 hover:shadow-xl hover:border-purple-300 transition-all group">
          <div className="w-12 h-12 bg-purple-100/80 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
            <CheckCircle2 size={28} />
          </div>
          <h3 className="text-xl font-bold mb-1 text-slate-800">ใช้ตัวบ่งชี้อย่างน้อย 2 สิ่ง</h3>
          <p className="text-rose-500 text-xs mb-3 font-semibold">⚠️ ห้ามใช้หมายเลขเตียงหรือห้องพักแทนการระบุตัวผู้ป่วยเด็ดขาด</p>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            {[
              '1. ชื่อ-นามสกุล',
              '2. วัน เดือน ปีเกิด',
              '3. เลขบัตรประชาชน',
              '4. Barcode/QR code',
            ].map((item) => (
              <div key={item} className="p-2.5 rounded-xl text-xs font-bold border transition-all text-center bg-white/90 text-slate-700 border-purple-100 hover:bg-purple-50 hover:border-purple-200 shadow-xs">
                {item}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            *ข้อมูลป้ายข้อมือ: ชื่อ-สกุล, ว/ด/ป เกิด, อายุ, เลขบัตรประชาชน, ประวัติแพ้ยา, Barcode/QR Code (ตรวจสอบความถูกต้องกับบัตรประชาชน/บัตรมีรูปก่อนบันทึก)
          </p>
        </div>
      </section>

      <div className="bg-white rounded-[2.5rem] border border-indigo-100/80 shadow-xl shadow-indigo-100/40 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-white p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300/20 blur-[80px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black flex items-center gap-3 drop-shadow-xs">
                <FileText size={28} className="text-white" /> ขั้นตอนการปฏิบัติงานมาตรฐาน (SOP Checklist)
              </h3>
              <p className="text-indigo-100 text-sm mt-1 font-medium">
                อ้างอิง 6 จุดเน้นการระบุตัวผู้ป่วยตามระเบียบปฏิบัติ SP-BQP-002-205-03 (31 ก.ค. 2568)
              </p>
            </div>
            <span className="inline-block px-3.5 py-1.5 bg-white/25 rounded-full text-xs font-bold text-white border border-white/30 backdrop-blur-md self-start md:self-auto shadow-xs">
              6 Core Clinical Practices
            </span>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">1</div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">การรับบริการ & ตรวจสอบแรกรับ (OPD / ER / IPD)</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  สแกน Bar code หรือใช้ 2 ตัวบ่งชี้เปรียบเทียบกับแฟ้มประวัติ/Visit slip/ใบส่งตัว สำหรับ ER สอบถามชื่อ-สกุล/วันเกิดแรกรับและสแกน Bar code กรณีผู้ป่วยใน (IPD) สแกน Bar code ป้ายข้อมือเทียบแฟ้มประวัติทุกขั้นตอน (ห้ามใช้เลขเตียง)
                </p>
              </div>
            </div>
            <div className="flex gap-5 group p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/70 border-2 border-emerald-300 shadow-md shadow-emerald-500/10 transition-all hover:shadow-xl hover:border-emerald-400">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-emerald-500/25">2</div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white mb-2 tracking-wide uppercase shadow-sm">
                  Lab Specimen Collection
                </span>
                <h4 className="font-black text-emerald-950 text-xl sm:text-2xl tracking-tight leading-snug">
                  การเก็บสิ่งส่งตรวจทางห้องปฏิบัติการ (Lab Specimen Collection)
                </h4>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed font-medium">
                  ติดสติกเกอร์ระบุชื่อ-สกุล วันเกิด เลขบัตรประชาชน ที่อุปกรณ์เก็บสิ่งส่งตรวจ สแกน Bar code/QR code ป้ายข้อมือเทียบกับอุปกรณ์ เก็บ specimen ต่อหน้าผู้ป่วย และทวนสอบความถูกต้องกับ Sticker ติด Container อีกครั้ง
                </p>
              </div>
            </div>
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">3</div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">การผ่าตัดหรือการทำหัตถการ (Procedure)</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  ผู้ป่วยนอก (OPD) สแกน Bar code เทียบแฟ้มประวัติ ส่วนผู้ป่วยใน (IPD) สแกน QR code ระบุตัวผู้ป่วยเทียบกับป้ายข้อมือและแฟ้มประวัติก่อนเข้าห้องผ่าตัดหรือก่อนทำหัตถการทุกครั้ง
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex gap-5 group p-5 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100/70 border-2 border-indigo-300 shadow-md shadow-indigo-500/10 transition-all hover:shadow-xl hover:border-indigo-400">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-600/25">4</div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white mb-2 tracking-wide uppercase shadow-sm">
                  Drug Administration
                </span>
                <h4 className="font-black text-indigo-950 text-xl sm:text-2xl tracking-tight leading-snug">
                  การบริหารยา (Drug Administration)
                </h4>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed font-medium">
                  ยืนยันชื่อ-นามสกุล, วันเดือนปีเกิด หรือ เลขบัตรประชาชน หรือที่อยู่ ตรงกับแบบบันทึกการให้ยา (MAR) หรือคำสั่งแพทย์ก่อนให้ยาทุกครั้ง และยืนยันตัวตนผู้ป่วยร่วมกับสแกน Bar code/QR code ป้ายข้อมือ (กรณีสื่อสารไม่ได้)
                </p>
              </div>
            </div>
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 font-black border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">5</div>
              <div>
                <h4 className="font-bold text-violet-800 text-lg">การให้เลือดและองค์ประกอบของเลือด (Blood Transfusion)</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  ตรวจสอบคำสั่งในระบบ HIS ตรวจสอบชนิด จำนวน ชื่อ-สกุล เลขบัตรประชาชน และทำ Independent Double Check (พยาบาล 2 คน) หรือ 7 See พร้อมสแกน QR Code ก่อนเริ่มให้เลือดทุกครั้ง
                </p>
              </div>
            </div>
            <div className="flex gap-5 group">
              <div className="flex-shrink-0 w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 font-black border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">6</div>
              <div>
                <h4 className="font-bold text-violet-800 text-lg">การระบุตัวทารกแรกเกิด & กรณีเฉพาะ (Newborn & Specific Cases)</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  ใช้ 3 ตัวบ่งชี้ (ชื่อ-สกุลมารดา, ว/ด/ป เกิด, อายุ) ป้ายข้อมือ 2 ชุด ป้ายข้อเท้าชายสีฟ้า หญิงสีชมพู (ระบุลำดับแฝด 1, 2) และกรณีผู้ป่วยชื่อ-สกุลซ้ำให้ใช้ตัวบ่งชี้เสริม เช่น ที่อยู่/ภูมิลำเนา พร้อมทำ POP UP แจ้งเตือนในระบบ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/50 p-8 rounded-[2.5rem] border border-indigo-100/80 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
        <h3 className="text-xl font-bold text-indigo-950 mb-8 flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
            <Video size={22} />
          </div>
          สื่อวิดีโอประกอบการเรียนรู้ (Clip VDO)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {videoLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/95 p-5 rounded-2xl border border-indigo-100/80 hover:border-purple-300 hover:shadow-lg hover:shadow-indigo-100/60 transition-all group flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-gradient-to-tr group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all shadow-xs">
                  <Video size={18} />
                </div>
                <span className="text-sm font-bold text-slate-700">{link.ward}</span>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </a>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-rose-50/90 to-pink-50/60 border border-rose-200/70 p-6 rounded-3xl flex items-start gap-4 shadow-xs">
          <AlertCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="text-rose-900 font-bold mb-1">หลักการ Independent Double Check (7 See)</h4>
            <p className="text-rose-800 text-sm leading-relaxed font-normal">
              การให้เลือด ยาความเสี่ยงสูง หรือหัตถการสำคัญ ต้องตรวจเช็ก 2 คน (Double check) หากอยู่เวรคนเดียว ให้ทบทวนซ้ำด้วยตนเองอย่างเป็นระบบ เว้นช่วงเวลา แล้วตรวจซ้ำเสมือนเป็นคนที่ 2 พร้อมลงลายมือชื่อกำกับ
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/60 border border-amber-200/80 p-6 rounded-3xl flex items-start gap-4 shadow-xs">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="text-amber-950 font-bold mb-1">กรณีผู้ป่วยไม่สามารถระบุตัวตนได้ (ไม่รู้สึกตัว/ฉุกเฉิน)</h4>
            <p className="text-amber-900 text-sm leading-relaxed font-normal">
              กำหนดให้ระบุเพศและสีเครื่องแต่งกาย เช่น <em>“ชายเสื้อสี...กางเกงสี...ไม่ทราบชื่อ ไม่ทราบนามสกุล”</em> และรีบทวนสอบกับญาติหรือเอกสารประจำตัวทันทีที่สามารถติดต่อได้
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
