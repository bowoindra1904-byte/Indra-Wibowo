import React from 'react';
import { FileText, User, Sparkles, Image as ImageIcon, Library, Trash2, Sliders } from 'lucide-react';
import { LetterState, LETTER_TEMPLATES } from '../types';
import { motion, AnimatePresence } from 'motion/react';

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

export const LetterEditor: React.FC<LetterEditorProps> = ({ 
  data, 
  onChange, 
  onGenerate, 
  isGenerating, 
  rawNotes, 
  setRawNotes, 
  activeTemplate, 
  onTemplateChange, 
  onReset 
}) => {
  const [activeTab, setActiveTab] = React.useState<'template' | 'kop' | 'atribut' | 'isi' | 'ttd'>('template');

  const updateField = (field: keyof LetterState, value: string | boolean | number) => {
    onChange({ ...data, [field]: value });
  };

  const updateSection = (index: number, content: string) => {
    const newSections = [...data.sections];
    newSections[index].content = content;
    onChange({ ...data, sections: newSections });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pr-2 custom-scrollbar">
      {/* Dashboard Custom Tab Selector */}
      <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-sm sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('template')}
          className={`flex flex-col items-center justify-center py-2.5 px-0.5 rounded-xl transition-all ${
            activeTab === 'template'
              ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-white/40'
          }`}
          title="Pilih Template Naskah"
        >
          <Library className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-bold tracking-tight truncate w-full text-center">Template</span>
        </button>
        <button
          onClick={() => setActiveTab('kop')}
          className={`flex flex-col items-center justify-center py-2.5 px-0.5 rounded-xl transition-all ${
            activeTab === 'kop'
              ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-white/40'
          }`}
          title="Kop Surat & Logo"
        >
          <ImageIcon className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-bold tracking-tight truncate w-full text-center">Kop Surat</span>
        </button>
        <button
          onClick={() => setActiveTab('atribut')}
          className={`flex flex-col items-center justify-center py-2.5 px-0.5 rounded-xl transition-all ${
            activeTab === 'atribut'
              ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-white/40'
          }`}
          title="Atribut & Penerima"
        >
          <FileText className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-bold tracking-tight truncate w-full text-center">Atribut</span>
        </button>
        <button
          onClick={() => setActiveTab('isi')}
          className={`flex flex-col items-center justify-center py-2.5 px-0.5 rounded-xl transition-all ${
            activeTab === 'isi'
              ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-white/40'
          }`}
          title="Isi Naskah & AI Helper"
        >
          <Sparkles className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-bold tracking-tight truncate w-full text-center">Isi Surat</span>
        </button>
        <button
          onClick={() => setActiveTab('ttd')}
          className={`flex flex-col items-center justify-center py-2.5 px-0.5 rounded-xl transition-all ${
            activeTab === 'ttd'
              ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-white/40'
          }`}
          title="Tanda Tangan & Penutup"
        >
          <User className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-bold tracking-tight truncate w-full text-center">Tanda Tangan</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: TEMPLATE NASKAH */}
        {activeTab === 'template' && (
          <motion.div
            key="tab-template"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  <Library className="w-4 h-4 text-indigo-500" /> Pilih jenis naskah dinas
                </h3>
                <button 
                  onClick={onReset}
                  className="text-[10px] font-bold text-rose-500 uppercase tracking-wider hover:text-rose-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100"
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
          </motion.div>
        )}

        {/* TAB 2: KOP SURAT */}
        {activeTab === 'kop' && (
          <motion.div
            key="tab-kop"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" /> Atur Kop Surat & Logo
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Upload Logo</label>
                      <div className="space-y-3">
                        {!data.logoUrl ? (
                          <div className="flex flex-col gap-2">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              id="logo-upload"
                            />
                            <label 
                              htmlFor="logo-upload"
                              className="w-full h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                            >
                              <div className="p-2 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Klik untuk Upload Logo</span>
                            </label>
                          </div>
                        ) : (
                          <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                            <img 
                              src={data.logoUrl} 
                              alt="Logo Preview" 
                              className="h-20 w-auto mx-auto object-contain"
                            />
                            <button 
                              onClick={() => updateField('logoUrl', '')}
                              className="absolute top-1 right-1 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                              title="Hapus Logo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: ATRIBUT SURAT */}
        {activeTab === 'atribut' && (
          <motion.div
            key="tab-atribut"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" /> Atribut & Desain Format
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
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kota Tempat Tanda Tangan</label>
                  <input 
                    type="text" 
                    value={data.place || ""}
                    onChange={(e) => updateField('place', e.target.value)}
                    placeholder="Contoh: Mentok"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Spasi Baris (Line Spacing)</label>
                  <select 
                    value={data.lineSpacing || 1.15}
                    onChange={(e) => updateField('lineSpacing', parseFloat(e.target.value) || 1.15)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  >
                    <option value={1.0}>1.0 (Single)</option>
                    <option value={1.15}>1.15 (Default)</option>
                    <option value={1.5}>1.5 (Standard)</option>
                    <option value={2.0}>2.0 (Double)</option>
                  </select>
                </div>

                {/* Font Family selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Font Surat</label>
                  <select 
                    value={data.fontFamily || "Times New Roman"}
                    onChange={(e) => updateField('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  >
                    <option value="Times New Roman">Times New Roman (Standard)</option>
                    <option value="Arial">Arial (Clean)</option>
                    <option value="Bookman Old Style">Bookman Old Style (Naskah Dinas)</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>

                {/* Font Size selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ukuran Font</label>
                  <select 
                    value={data.fontSize || 12}
                    onChange={(e) => updateField('fontSize', parseInt(e.target.value) || 12)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  >
                    <option value={10}>10 pt</option>
                    <option value={11}>11 pt</option>
                    <option value={12}>12 pt (Default)</option>
                    <option value={13}>13 pt</option>
                    <option value={14}>14 pt</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kepada Yth. (Penerima)</label>
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
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: ISI NASKAH & AI */}
        {activeTab === 'isi' && (
          <motion.div
            key="tab-isi"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* AI Assistant */}
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 transition-pulse" /> AI Assistant Draft
                </h3>
                <span className="text-[10px] font-bold text-indigo-300 uppercase">Powered by Gemini</span>
              </div>
              <textarea 
                placeholder="Tuliskan poin-poin surat di sini... (misal: Rapat di Mentok, bahas anggaran, hasil disetujui)"
                className="w-full h-24 px-4 py-3 bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all placeholder:text-indigo-200"
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
              />
              <button 
                onClick={onGenerate}
                disabled={isGenerating || !rawNotes}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98]"
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

            {/* Paragraph sections */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] px-1">Konten Paragraf Surat</h4>
              {data.sections.map((section, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.title || `Paragraf ${idx + 1}`}</label>
                  <textarea 
                    value={section.content}
                    onChange={(e) => updateSection(idx, e.target.value)}
                    placeholder="Ketik konten di sini atau gunakan AI untuk generate otomatis..."
                    className="w-full h-44 px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all leading-relaxed custom-scrollbar"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 5: PENANDATANGAN */}
        {activeTab === 'ttd' && (
          <motion.div
            key="tab-ttd"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Penandatanganan & Penutup
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">NIP Pejabat Menyetujui</label>
                    <input 
                      type="text" 
                      value={data.approverNip}
                      onChange={(e) => updateField('approverNip', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all font-mono"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">Jabatan Penandatangan (Kop Jabatan)</label>
                    <input 
                      type="text" 
                      value={data.approverTitle}
                      onChange={(e) => updateField('approverTitle', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kalimat Penutup / Footer</label>
                  <textarea 
                    value={data.footer}
                    onChange={(e) => updateField('footer', e.target.value)}
                    placeholder="Kalimat penutup surat..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
