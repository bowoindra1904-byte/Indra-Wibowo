import React, { useState } from 'react';
import { LetterEditor } from './components/LetterEditor';
import { LetterPreview } from './components/LetterPreview';
import { INITIAL_LETTER_STATE, LetterState, LETTER_TEMPLATES } from './types';
import { exportToWord } from './lib/wordExport';
import { FileText, Download, Sparkles, LayoutGrid, Eye, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<LetterState>(() => {
    const saved = localStorage.getItem('letter_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_LETTER_STATE;
      }
    }
    return INITIAL_LETTER_STATE;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<'both' | 'editor' | 'preview'>('both');
  const [rawNotes, setRawNotes] = useState(() => localStorage.getItem('raw_notes') || "");
  const [activeTemplate, setActiveTemplate] = useState(LETTER_TEMPLATES[0].id);

  // Persistence
  React.useEffect(() => {
    localStorage.setItem('letter_data', JSON.stringify(data));
  }, [data]);

  React.useEffect(() => {
    localStorage.setItem('raw_notes', rawNotes);
  }, [rawNotes]);

  const handleTemplateChange = (templateId: string) => {
    const template = LETTER_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setActiveTemplate(templateId);
      setData(prev => ({
        ...prev,
        title: template.title,
        templateId: templateId,
        footer: template.footer || "",
        sections: template.sections.map(s => ({ ...s }))
      }));
    }
  };

  const handleReset = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data dan kembali ke awal?")) {
      setData({ ...INITIAL_LETTER_STATE });
      setRawNotes("");
      setActiveTemplate(LETTER_TEMPLATES[0].id);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.title,
          rawNotes: rawNotes,
          context: { recipient: data.recipient },
          sections: data.sections
        }),
      });
      const result = await response.json();
      if (result.sections) {
        setData(prev => ({ ...prev, sections: result.sections }));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 font-display tracking-tight">E-Surat Bangka Barat</h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Tata Naskah Dinas Digital</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex bg-slate-100 p-1 rounded-xl border border-slate-200 mr-4">
            <button 
              onClick={() => setView('both')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'both' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Split View
            </button>
            <button 
               onClick={() => setView('editor')}
               className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'editor' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Editor
            </button>
            <button 
               onClick={() => setView('preview')}
               className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Preview
            </button>
          </div>
          
          <button 
            onClick={() => exportToWord(data)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Word</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">
          {/* Editor Column */}
          {(view === 'both' || view === 'editor') && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex-1 p-6 overflow-hidden ${view === 'both' ? 'max-w-[500px] border-r border-gray-200' : 'max-w-4xl mx-auto w-full'}`}
            >
              <LetterEditor 
                data={data} 
                onChange={setData} 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                rawNotes={rawNotes}
                setRawNotes={setRawNotes}
                activeTemplate={activeTemplate}
                onTemplateChange={handleTemplateChange}
                onReset={handleReset}
              />
            </motion.div>
          )}

          {/* Preview Column */}
          {(view === 'both' || view === 'preview') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 bg-slate-200/40 p-6 overflow-y-auto pattern-grid"
            >
              <div className="max-w-[800px] mx-auto pb-12">
                <div className="flex items-center justify-between mb-4 text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
                  <span>Draft Live Preview</span>
                  <span>A4 Format (210 x 297 mm)</span>
                </div>
                <div className="shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)]">
                  <LetterPreview data={data} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Mobile Toggle */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setView(view === 'preview' ? 'editor' : 'preview')}
          className="bg-gray-900 text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
        >
          {view === 'preview' ? <FileText /> : <Eye />}
        </button>
      </div>

      <style>{`
        .pattern-grid {
          background-image: radial-gradient(#cbd5e1 0.7px, transparent 0.7px);
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
}
