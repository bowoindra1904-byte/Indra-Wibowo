import React from 'react';
import { FileText, User, Sparkles, Image as ImageIcon, Library } from 'lucide-react';
import { LetterState, LETTER_TEMPLATES } from '../types';
import { motion } from 'motion/react';

interface LetterEditorProps {
  data: LetterState;
  onChange: (data: LetterState) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  rawNotes: string;
  setRawNotes: (val: string) => void;
  activeTemplate: string;
  onTemplateChange: (id: string) => void;
  onReset: () => void;
}

export const LetterEditor: React.FC<LetterEditorProps> = ({ data, onChange, onGenerate, isGenerating, rawNotes, setRawNotes, activeTemplate, onTemplateChange, onReset }) => {
  const updateField = (field: keyof LetterState, value: string | boolean | number) => {
    onChange({ ...data, [field]: value });
  };

  const updateSection = (index: number, content: string) => {
    const newSections = [...data.sections];
    newSections[index].content = content;
    onChange({ ...data, sections: newSections });
  };

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pr-2 custom-scrollbar">
      {/* Template Menu */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
            <Library className="w-4 h-4 text-indigo-500" /> Template Naskah
          </h3>
          <button 
            onClick={onReset}
            className="text-[10px] font-bold text-rose-500 uppercase tracking-wider hover:text-rose-600 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
          >
            Bersihkan Form
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LETTER_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onTemplateChange(tpl.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                activeTemplate === tpl.id 
                  ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-100' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${activeTemplate === tpl.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className={`text-xs font-semibold ${activeTemplate === tpl.id ? 'text-indigo-900' : 'text-slate-600'}`}>{tpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-500" /> Kop Surat & Logo
        </h3>
        <div className="space-y-5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={data.showLogo}
                onChange={(e) => updateField('showLogo', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
            <span className="text-xs font-semibold text-slate-600">Tampilkan Logo Instansi</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Organisasi (Baris 1)</label>
              <input 
                type="text" 
                value={data.orgName}
                onChange={(e) => updateField('orgName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Satuan/Dinas (Baris 2)</label>
              <input 
                type="text" 
                value={data.deptName1}
                onChange={(e) => updateField('deptName1', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Satuan/Dinas (Baris 3)</label>
              <input 
                type="text" 
                value={data.deptName2}
                onChange={(e) => updateField('deptName2', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Alamat (Baris 1)</label>
              <input 
                type="text" 
                value={data.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Alamat (Baris 2)</label>
              <input 
                type="text" 
                value={data.addressLine2}
                onChange={(e) => updateField('addressLine2', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          {data.showLogo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lebar Logo (px)</label>
                <input 
                  type="number" 
                  value={data.logoSize}
                  onChange={(e) => updateField('logoSize', parseInt(e.target.value) || 80)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">URL Logo</label>
                <input 
                  type="text" 
                  value={data.logoUrl}
                  onChange={(e) => updateField('logoUrl', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4" /> Atribut Surat & Tujuan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Surat</label>
            <input 
              type="text" 
              value={data.letterNumber}
              onChange={(e) => updateField('letterNumber', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Lampiran</label>
            <input 
              type="text" 
              value={data.lampiran}
              onChange={(e) => updateField('lampiran', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Perihal (Hal)</label>
            <input 
              type="text" 
              value={data.hal}
              onChange={(e) => updateField('hal', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-bold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Kepada Yth.</label>
            <input 
              type="text" 
              value={data.recipient}
              onChange={(e) => updateField('recipient', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Tembusan (Satu per baris)</label>
            <textarea 
              value={data.tembusan}
              onChange={(e) => updateField('tembusan', e.target.value)}
              placeholder="Contoh:&#10;Bupati Bangka Barat&#10;Inspektur Daerah"
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Kalimat Penutup / Footer</label>
            <textarea 
              value={data.footer}
              onChange={(e) => updateField('footer', e.target.value)}
              placeholder="Kalimat penutup surat..."
              rows={2}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.15em] flex items-center gap-2">
            <Sparkles className="w-4 h-4 transition-pulse" /> AI Assistant
          </h3>
          <span className="text-[10px] font-bold text-indigo-300 uppercase">Powered by Gemini</span>
        </div>
        <textarea 
          placeholder="Tuliskan poin-poin surat di sini... (misal: Rapat di Mentok, bahas anggaran, hasil disetujui)"
          className="w-full h-32 px-4 py-3 bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all placeholder:text-indigo-200"
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
        />
        <button 
          onClick={onGenerate}
          disabled={isGenerating || !rawNotes}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98]"
        >
          {isGenerating ? (
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Generate Isi Otomatis
        </button>
      </div>

      {data.sections.map((section, idx) => (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.title}</label>
            <textarea 
              value={section.content}
              onChange={(e) => updateSection(idx, e.target.value)}
              className="w-full h-40 px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all leading-relaxed"
            />
          </div>
      ))}

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" /> Penandatanganan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Pembuat</label>
            <input 
              type="text" 
              value={data.senderName}
              onChange={(e) => updateField('senderName', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">NIP Pembuat</label>
            <input 
              type="text" 
              value={data.senderNip}
              onChange={(e) => updateField('senderNip', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">Pejabat Menyetujui</label>
            <input 
              type="text" 
              value={data.approverName}
              onChange={(e) => updateField('approverName', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">Jabatan Penandatangan</label>
            <input 
              type="text" 
              value={data.approverTitle}
              onChange={(e) => updateField('approverTitle', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
