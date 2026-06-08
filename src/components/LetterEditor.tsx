import React from 'react';
import { 
  FileText, 
  User, 
  Sparkles, 
  Image as ImageIcon, 
  Library, 
  Trash2, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Users,
  Settings,
  Type
} from 'lucide-react';
import { LetterState, LETTER_TEMPLATES } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { logoBase64 } from '../lib/logoBase64';

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
  errorMsg?: string | null;
  setErrorMsg?: (val: string | null) => void;
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
  onReset,
  errorMsg = null,
  setErrorMsg
}) => {
  const [activeTab, setActiveTab] = React.useState<'template' | 'kop' | 'atribut' | 'isi' | 'ttd'>('template');
  
  // Collapse/Expand state for modular tools/sections
  const [openSectionId, setOpenSectionId] = React.useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSectionId(prev => prev === id ? null : id);
  };

  const updateField = (field: keyof LetterState, value: any) => {
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

  // Team members helpers for LPD Kolektif
  const addMember = () => {
    const currentMembers = data.lpdMembers || [];
    const newMembers = [...currentMembers, { name: '', nip: '' }];
    onChange({ ...data, lpdMembers: newMembers });
  };

  const updateMember = (index: number, field: 'name' | 'nip', value: string) => {
    const currentMembers = data.lpdMembers || [];
    const newMembers = currentMembers.map((m, i) => i === index ? { ...m, [field]: value } : m);
    onChange({ ...data, lpdMembers: newMembers });
  };

  const removeMember = (index: number) => {
    const currentMembers = data.lpdMembers || [];
    const newMembers = currentMembers.filter((_, i) => i !== index);
    onChange({ ...data, lpdMembers: newMembers });
  };

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pr-2 custom-scrollbar">
      {/* Dashboard Tap Navigation */}
      <div className="grid grid-cols-5 gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('template')}
          className={`flex flex-col items-center justify-center py-2.5 px-0.5 rounded-xl transition-all ${
            activeTab === 'template'
              ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50 ring-1 ring-emerald-500/5 font-bold'
              : 'text-slate-500 hover:text-emerald-600 hover:bg-white/50'
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
              ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50 ring-1 ring-emerald-500/5 font-bold'
              : 'text-slate-500 hover:text-emerald-600 hover:bg-white/50'
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
              ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50 ring-1 ring-emerald-500/5 font-bold'
              : 'text-slate-500 hover:text-emerald-600 hover:bg-white/50'
          }`}
          title="Atribut & Format"
        >
          <Sliders className="w-4 h-4 mb-1" />
          <span className="text-[9px] font-bold tracking-tight truncate w-full text-center">Atribut</span>
        </button>
        <button
          onClick={() => setActiveTab('isi')}
          className={`flex flex-col items-center justify-center py-2.5 px-0.5 rounded-xl transition-all ${
            activeTab === 'isi'
              ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50 ring-1 ring-emerald-500/5 font-bold'
              : 'text-slate-500 hover:text-emerald-600 hover:bg-white/50'
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
              ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50 ring-1 ring-emerald-500/5 font-bold'
              : 'text-slate-500 hover:text-emerald-600 hover:bg-white/50'
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  <Library className="w-4 h-4 text-emerald-500" /> Pilih Jenis Naskah Dinas
                </h3>
                <button 
                  onClick={onReset}
                  className="text-[10px] font-bold text-rose-500 uppercase tracking-wider hover:text-rose-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100 font-display"
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
                        ? 'bg-emerald-50/60 border-emerald-200 ring-1 ring-emerald-100/50' 
                        : 'bg-white border-slate-100 hover:border-slate-200/80'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${activeTemplate === tpl.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-xs font-bold ${activeTemplate === tpl.id ? 'text-emerald-950 font-display' : 'text-slate-600'}`}>{tpl.name}</span>
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
            {/* Group 1: Identitas Kop Surat (Collapsible) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection('kop-identitas')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-500" /> Identitas Kop Surat (Baris Nama & Alamat)
                </span>
                {openSectionId === 'kop-identitas' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence initial={true}>
                {openSectionId !== 'kop-identitas' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Organisasi (Baris 1)</label>
                          <input 
                            type="text" 
                            value={data.orgName}
                            onChange={(e) => updateField('orgName', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Satuan / Bidang (Baris 2)</label>
                          <input 
                            type="text" 
                            value={data.deptName1}
                            onChange={(e) => updateField('deptName1', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Seksi / Seksi Tambahan (Baris 3)</label>
                          <input 
                            type="text" 
                            value={data.deptName2}
                            onChange={(e) => updateField('deptName2', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Alamat Lengkap (Baris 1)</label>
                          <input 
                            type="text" 
                            value={data.addressLine1}
                            onChange={(e) => updateField('addressLine1', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Detail Kontak/Kode Pos (Baris 2)</label>
                          <input 
                            type="text" 
                            value={data.addressLine2}
                            onChange={(e) => updateField('addressLine2', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Group 2: Pengaturan Logo & Branding (Collapsible) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection('kop-logo')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-500" /> Logo Instansi & Branding
                </span>
                {openSectionId === 'kop-logo' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence initial={true}>
                {openSectionId !== 'kop-logo' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={data.showLogo}
                            onChange={(e) => updateField('showLogo', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-emerald-600 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">Tampilkan Logo Instansi</span>
                      </label>

                      {data.showLogo && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ukuran Logo (px)</label>
                            <input 
                              type="number" 
                              value={data.logoSize}
                              onChange={(e) => updateField('logoSize', parseInt(e.target.value) || 80)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status Logo & Integrasi</label>
                            <div className="flex items-center gap-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5">
                              <img 
                                src={logoBase64} 
                                alt="Official Logo" 
                                className="h-11 w-auto object-contain bg-white p-1 rounded-lg border border-slate-200/50"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-slate-700">Logo Bangka Barat</h4>
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase mt-1">
                                  ● Permanen Terpasang
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            {/* Group 1: Atribut Pokok Naskah (Collapsible) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection('atribut-pokok')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" /> Atribut Surat & Kelengkapan
                </span>
                {openSectionId === 'atribut-pokok' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence initial={true}>
                {openSectionId !== 'atribut-pokok' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nomor Surat</label>
                          <input 
                            type="text" 
                            value={data.letterNumber}
                            onChange={(e) => updateField('letterNumber', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-mono focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Lampiran</label>
                          <input 
                            type="text" 
                            value={data.lampiran}
                            onChange={(e) => updateField('lampiran', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Perihal (Hal)</label>
                          <input 
                            type="text" 
                            value={data.hal}
                            onChange={(e) => updateField('hal', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kota Tempat Penandatanganan</label>
                          <input 
                            type="text" 
                            value={data.place || ""}
                            onChange={(e) => updateField('place', e.target.value)}
                            placeholder="Contoh: Mentok"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tanggal Naskah</label>
                          <input 
                            type="text" 
                            value={data.date}
                            onChange={(e) => updateField('date', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Group 2: Penerima & Tembusan (Collapsible) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection('atribut-penerima')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
               >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em] flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" /> Penerima & Tembusan
                </span>
                {openSectionId === 'atribut-penerima' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence>
                {openSectionId !== 'atribut-penerima' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kepada Yth. (Penerima)</label>
                        <input 
                          type="text" 
                          value={data.recipient}
                          onChange={(e) => updateField('recipient', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tembusan kepada Yth. (Satu per baris)</label>
                        <textarea 
                          value={data.tembusan}
                          onChange={(e) => updateField('tembusan', e.target.value)}
                          placeholder="Bupati Bangka Barat&#10;Inspektur Daerah Kab. Bangka Barat"
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white custom-scrollbar"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Group 3: Desain, Font, Ukuran & Jarak Spasi (Collapsible) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection('atribut-desain')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-500" /> Tampilan Huruf & Tata Letak (Tipografi)
                </span>
                {openSectionId === 'atribut-desain' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence>
                {openSectionId !== 'atribut-desain' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Jenis Font Surat</label>
                          <select 
                            value={data.fontFamily || "Times New Roman"}
                            onChange={(e) => updateField('fontFamily', e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white font-medium"
                          >
                            <option value="Times New Roman">Times New Roman (Kearsipan)</option>
                            <option value="Arial">Arial (Sederhana/Modern)</option>
                            <option value="Bookman Old Style">Bookman Old Style (Formal)</option>
                            <option value="Georgia">Georgia (Elegan)</option>
                            <option value="Courier New">Courier New (Mesin Tik)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ukuran Huruf</label>
                          <select 
                            value={data.fontSize || 12}
                            onChange={(e) => updateField('fontSize', parseInt(e.target.value) || 12)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white font-medium"
                          >
                            <option value={10}>10 pt</option>
                            <option value={11}>11 pt</option>
                            <option value={12}>12 pt (Ukuran Standar)</option>
                            <option value={13}>13 pt</option>
                            <option value={14}>14 pt</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Spasi Baris (Spacing)</label>
                          <select 
                            value={data.lineSpacing || 1.15}
                            onChange={(e) => updateField('lineSpacing', parseFloat(e.target.value) || 1.15)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white font-medium"
                          >
                            <option value={1.0}>1.0 (Rapat)</option>
                            <option value={1.15}>1.15 (Default LPD/ND)</option>
                            <option value={1.5}>1.5 (Sedang)</option>
                            <option value={2.0}>2.0 (Double)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* TAB 4: ISI SURAT */}
        {activeTab === 'isi' && (
          <motion.div
            key="tab-isi"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Group 1: AI Helper (Collapsible) */}
            <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleSection('isi-ai')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-emerald-100/60 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 transition-pulse" /> Asisten Generator Draf AI
                </span>
                {openSectionId === 'isi-ai' ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-emerald-400" />}
              </button>
              
              <AnimatePresence>
                {openSectionId !== 'isi-ai' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 space-y-4">
                      <textarea 
                        placeholder="Tuliskan draf kasar atau poin-poin kegiatan di sini (Contoh: Pengamanan operasi pasar murah di kec. tempilang dari jam 6 pagi sampai selesai berjalan sangat kondusif, aman dan terkendali)..."
                        className="w-full h-24 px-4 py-3 bg-white/60 backdrop-blur-sm border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-sm transition-all placeholder:text-slate-300 custom-scrollbar"
                        value={rawNotes}
                        onChange={(e) => setRawNotes(e.target.value)}
                      />
                      
                      {errorMsg && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 space-y-2.5 relative">
                          <div className="flex items-start gap-2.5 pr-6">
                            <span className="text-rose-500 font-bold text-sm">⚠️</span>
                            <div>
                              <p className="font-bold text-rose-950">Gagal Menghubungi Generatif AI</p>
                              <p className="mt-1 leading-relaxed text-rose-900/85">{errorMsg}</p>
                            </div>
                          </div>
                          
                          <div className="bg-white/85 border border-rose-100/50 p-3 rounded-lg space-y-1.5 leading-relaxed text-rose-950/80 shadow-xs">
                            <p className="font-bold uppercase text-[9px] tracking-wider text-rose-900">💡 Cara Mengganti API Key Baru:</p>
                            <ol className="list-decimal list-inside space-y-1 text-[11px] font-sans">
                              <li>Klik ikon <span className="font-bold">Settings (ikon gerigi)</span> di pojok kanan/kiri atas layar Google AI Studio.</li>
                              <li>Di tab Secrets / Environment Variables, temukan nilai <code className="bg-rose-100 px-1 py-0.5 rounded text-rose-800 font-mono text-[10px]">GEMINI_API_KEY</code>.</li>
                              <li>Ganti atau masukkan kunci baru Anda yang masih aktif dari Google AI Studio.</li>
                              <li>Selesai! Jalankan generator draf lagi untuk memproses draf surat Anda.</li>
                            </ol>
                          </div>
                          
                          {setErrorMsg && (
                            <button 
                              onClick={() => setErrorMsg(null)}
                              className="absolute top-2.5 right-2 text-rose-500 hover:text-rose-800 font-bold hover:bg-rose-100 rounded-md px-2 py-0.5 text-[10px] transition-all"
                              title="Tutup pesan"
                            >
                              Tutup
                            </button>
                          )}
                        </div>
                      )}

                      <button 
                        onClick={onGenerate}
                        disabled={isGenerating || !rawNotes}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 active:scale-[0.98]"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Group 2: Penyuntingan Paragraf Langsung (Collapsible) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection('isi-paragraf')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" /> Konten Paragraf Naskah
                </span>
                {openSectionId === 'isi-paragraf' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence>
                {openSectionId !== 'isi-paragraf' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 space-y-4">
                      {data.sections.map((section, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.title || `Paragraf ${idx + 1}`}</label>
                          <textarea 
                            value={section.content}
                            onChange={(e) => updateSection(idx, e.target.value)}
                            placeholder="Tulis draf paragraf, rincian, atau buat tabel dengan format markdown..."
                            className="w-full h-40 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all leading-relaxed custom-scrollbar"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* TAB 5: TANDA TANGAN */}
        {activeTab === 'ttd' && (
          <motion.div
            key="tab-ttd"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Group 1: Daftar Pelaksana / Anggota Tim - Only for LPD Kolektif (Collapsible) */}
            {data.templateId === 'lpd_kolektif' && (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => toggleSection('ttd-pelaksana')}
                  className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em] flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" /> Daftar Anggota Tim Pelaksana ({data.lpdMembers?.length || 0} Orang)
                  </span>
                  {openSectionId === 'ttd-pelaksana' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                
                <AnimatePresence>
                  {openSectionId !== 'ttd-pelaksana' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-6 space-y-4">
                        <div className="space-y-3">
                          {(data.lpdMembers || []).map((member, i) => (
                            <div key={i} className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100 relative group/member">
                              <span className="w-5 text-xs font-bold text-slate-400">{i + 1}.</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                                <input 
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => updateMember(i, 'name', e.target.value)}
                                  placeholder="Nama Pelaksana"
                                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                                <input 
                                  type="text"
                                  value={member.nip}
                                  onChange={(e) => updateMember(i, 'nip', e.target.value)}
                                  placeholder="NIP Pelaksana"
                                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </div>
                              <button 
                                onClick={() => removeMember(i)}
                                className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                title="Hapus Anggota"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          {(!data.lpdMembers || data.lpdMembers.length === 0) && (
                            <p className="text-xs text-center text-slate-400 py-3 italic">Pencet tombol dibawah untuk menambah anggota tim</p>
                          )}
                        </div>

                        <button 
                          onClick={addMember}
                          className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:text-emerald-600 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500"
                        >
                          <Plus className="w-4 h-4" /> Tambah Anggota Tim
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Group 2: Pejabat Penandatangan & Penutup (Collapsible) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleSection('ttd-pejabat')}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em] flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" /> Penandatangan & Penutup Naskah
                </span>
                {openSectionId === 'ttd-pejabat' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence>
                {openSectionId !== 'ttd-pejabat' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.templateId !== 'lpd_kolektif' && (
                          <>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Pembuat / Pelaksana</label>
                              <input 
                                type="text" 
                                value={data.senderName}
                                onChange={(e) => updateField('senderName', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">NIP Pembuat / Pelaksana</label>
                              <input 
                                type="text" 
                                value={data.senderNip}
                                onChange={(e) => updateField('senderNip', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-mono focus:bg-white"
                              />
                            </div>
                          </>
                        )}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Pejabat Yang Menyetujui (Mengetahui)</label>
                          <input 
                            type="text" 
                            value={data.approverName}
                            onChange={(e) => updateField('approverName', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">NIP Pejabat Yang Menyetujui</label>
                          <input 
                            type="text" 
                            value={data.approverNip}
                            onChange={(e) => updateField('approverNip', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-mono focus:bg-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kop Jabatan Pengetahu/Pimpinan</label>
                          <input 
                            type="text" 
                            value={data.approverTitle}
                            onChange={(e) => updateField('approverTitle', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kalimat Penutup / Footer Naskah</label>
                        <textarea 
                          value={data.footer}
                          onChange={(e) => updateField('footer', e.target.value)}
                          placeholder="Demikian laporan perjalanan dinas ini disampaikan..."
                          rows={2}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all focus:bg-white custom-scrollbar"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
