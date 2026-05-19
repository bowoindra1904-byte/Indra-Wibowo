import React from 'react';
import { LetterState } from '../types';

interface LetterPreviewProps {
  data: LetterState;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({ data }) => {
  return (
    <div className="bg-white shadow-2xl rounded-sm p-12 min-h-[1100px] w-full max-w-[800px] mx-auto text-[11pt] font-serif leading-relaxed text-gray-900 overflow-hidden break-words">
      {/* Kop Surat */}
      <div className="border-b-4 border-double border-black pb-3 mb-8 relative flex items-center min-h-[120px] font-sans">
        {data.showLogo && (
          <div className="absolute left-0 top-0 bottom-0 w-24 flex items-center justify-center">
            <img 
              src={data.logoUrl} 
              alt="Logo" 
              style={{ width: `${data.logoSize}px` }}
              className="h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className={`w-full text-center ${data.showLogo ? 'pl-24' : ''}`}>
          <h1 className="text-[14pt] font-bold uppercase leading-tight tracking-tight">{data.orgName}</h1>
          <h2 className="text-[12pt] font-bold uppercase leading-tight">{data.deptName1}</h2>
          <h2 className="text-[12pt] font-bold uppercase leading-tight">{data.deptName2}</h2>
          <p className="text-[9pt] font-normal mt-1 leading-tight">{data.addressLine1}</p>
          <p className="text-[9pt] font-normal leading-tight">{data.addressLine2}</p>
        </div>
      </div>

      {/* Conditional Layouts based on templateId */}
      {data.templateId === 'nd' || data.templateId === 'lpd' ? (
        /* Layout untuk NOTA DINAS atau LAPORAN PERJALANAN DINAS */
        <div className="mb-8 border-t-2 border-b-2 border-black py-2">
          <h3 className="text-center font-bold text-[14pt] mb-4 uppercase">{data.title}</h3>
          <div className="space-y-1 text-[11pt]">
            <div className="flex">
              <span className="w-24 shrink-0">Kepada</span>
              <span className="w-4 shrink-0">:</span>
              <span className="font-bold">{data.recipient}</span>
            </div>
            <div className="flex">
              <span className="w-24 shrink-0">Dari</span>
              <span className="w-4 shrink-0">:</span>
              <span className="font-bold">{data.senderName}</span>
            </div>
            {data.templateId === 'nd' && (
              <div className="flex">
                <span className="w-24 shrink-0">Nomor</span>
                <span className="w-4 shrink-0">:</span>
                <span>{data.letterNumber}</span>
              </div>
            )}
            <div className="flex">
              <span className="w-24 shrink-0">Tanggal</span>
              <span className="w-4 shrink-0">:</span>
              <span>{data.date}</span>
            </div>
            <div className="flex">
              <span className="w-24 shrink-0">Hal</span>
              <span className="w-4 shrink-0">:</span>
              <span className="font-bold underline italic">{data.hal}</span>
            </div>
          </div>
        </div>
      ) :
 (data.templateId === 'st' || data.templateId === 'sk' || data.templateId === 'std' || data.templateId === 'se' || data.templateId === 'ba') ? (
        /* Layout untuk SURAT TUGAS / KETERANGAN / TEGURAN / EDARAN / BERITA ACARA */
        <div className="text-center mb-8">
          <h3 className="font-bold uppercase text-[12pt] underline">{data.title}</h3>
          <p className="text-[11pt]">Nomor : {data.letterNumber}</p>
          {data.templateId === 'se' && data.hal && <p className="mt-2 font-bold uppercase italic">TENTANG<br/>{data.hal}</p>}
        </div>
      ) : (
        /* Layout Default (Surat Dinas / Laporan) */
        <>
          <div className="text-center mb-6">
            <h3 className="font-bold uppercase text-[12pt]">{data.title}</h3>
          </div>

          <div className="mb-8">
            <table className="w-full text-[11pt]">
              <tbody>
                <tr>
                  <td className="w-24 align-top">Nomor</td>
                  <td className="w-4 align-top">:</td>
                  <td className="align-top">{data.letterNumber}</td>
                  <td className="text-right align-top">{data.place}, {data.date}</td>
                </tr>
                <tr>
                  <td className="align-top">Lampiran</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{data.lampiran}</td>
                  <td rowSpan={2} className="w-[45%] align-top pt-4">
                    <div className="ml-12">
                      <p className="font-bold">Kepada Yth,</p>
                      <p className="max-w-[300px] mb-1">{data.recipient}</p>
                      <p className="mb-0">di -</p>
                      <p className="pl-6 font-bold">{data.place || 'Mentok'}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-top">Hal</td>
                  <td className="align-top">:</td>
                  <td className="align-top font-bold underline">{data.hal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Body Sections */}
      <div className="space-y-6 text-justify">
        {data.sections.map((section, idx) => (
          <div key={idx}>
            {section.title && <h4 className="font-bold mb-2">{section.title}</h4>}
            <div className={`pl-0 whitespace-pre-wrap ${data.templateId === 'sp' ? 'border p-4 bg-gray-50' : ''}`}>
              {section.content || <span className="text-gray-400 italic">(Belum diisi)</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 mb-12">
        <p>{data.footer}</p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-12 pb-12">
        {data.templateId === 'nd' || data.templateId === 'lpd' ? (
          <>
            <div className="text-center font-sans">
              <p className="mb-1 uppercase font-bold">Mengetahui/Menyetujui</p>
              <p className="mb-1 uppercase font-bold">{data.approverTitle}</p>
              <div className="h-24" />
              <p className="font-bold underline uppercase">{data.approverName}</p>
              <p>NIP {data.approverNip}</p>
            </div>
            <div className="text-center font-sans">
              <p className="mb-1 italic">Mentok, {data.date}</p>
              <p className="mb-1 uppercase font-bold">Pelaksana Tugas,</p>
              <div className="h-24" />
              <p className="font-bold underline uppercase">{data.senderName}</p>
              <p>NIP {data.senderNip}</p>
            </div>
          </>
        ) : (data.templateId === 'st' || data.templateId === 'sk' || data.templateId === 'std' || data.templateId === 'se' || data.templateId === 'ba') ? (
          <>
            <div />
            <div className="text-center font-sans">
              <p className="mb-1 uppercase font-bold">{data.approverTitle}</p>
              <div className="h-24" />
              <p className="font-bold underline uppercase">{data.approverName}</p>
              <p>NIP {data.approverNip}</p>
            </div>
          </>
        ) : (
          /* Default Laporan / Surat Dinas */
          <>
            <div>
              <p className="mb-1">Mengetahui,</p>
              <p className="mb-16">{data.approverTitle}</p>
              <p className="font-bold underline uppercase">{data.approverName}</p>
              <p>NIP {data.approverNip}</p>
            </div>
            <div className="text-right">
              <p className="mb-1">{data.place || 'Mentok'}, {data.date}</p>
              <p className="mb-16">Yang Membuat</p>
              <p className="font-bold underline uppercase">{data.senderName}</p>
              <p>NIP {data.senderNip}</p>
            </div>
          </>
        )}
      </div>

      {/* Tembusan */}
      {data.tembusan && (
        <div className="mt-4 text-[10pt] border-t border-gray-100 pt-4">
          <p className="font-bold underline">Tembusan kepada Yth :</p>
          <div className="ml-4 mt-1 whitespace-pre-wrap">
            {data.tembusan.split('\n').filter(l => l.trim()).map((line, i) => (
              <p key={i}>{i + 1}. {line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
