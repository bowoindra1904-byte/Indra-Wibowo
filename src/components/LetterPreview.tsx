import React from 'react';
import { LetterState } from '../types';

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => {
      if (!word) return '';
      // Check if it's an academic degree (like S.IP, M.Si, S.H, S.Pd)
      if (word.includes('.') || (word === word.toUpperCase() && word.length <= 4 && isNaN(Number(word)))) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

const renderSectionContent = (content: string, lineSpacing: number) => {
  if (!content) return <span className="text-gray-400 italic">(Belum diisi)</span>;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentTableRows: string[][] = [];
  let inTable = false;

  const flushTable = (key: string | number) => {
    if (currentTableRows.length > 0) {
      // Filter out markdown divider rows like |---|---|
      const rows = currentTableRows.filter(row => {
        const joined = row.join('').trim();
        return !/^[:\-\s|]+$/.test(joined);
      });

      if (rows.length > 0) {
        // Find if we have headers
        const headers = rows[0];
        const bodyRows = rows.slice(1);

        elements.push(
          <div key={`table-${key}`} className="my-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-slate-400 text-[10pt] font-sans my-2">
              <thead>
                <tr className="bg-slate-50 border-b border-black">
                  {headers.map((cell, cellIdx) => (
                    <th key={cellIdx} className="border border-slate-400 px-3 py-2 text-left font-bold text-black align-top break-words">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-slate-300 hover:bg-slate-50">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-slate-300 px-3 py-2 text-black align-top break-words">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      currentTableRows = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    // A line belongs to a table if it contains '|' and has at least two cells
    if (trimmed.startsWith('|') || (trimmed.includes('|') && trimmed.split('|').length > 2)) {
      inTable = true;
      let parts = line.split('|');
      if (line.startsWith('|')) parts.shift();
      if (line.endsWith('|')) parts.pop();
      currentTableRows.push(parts);
    } else {
      if (inTable) {
        flushTable(index);
        inTable = false;
      }
      
      const bulletMatch = trimmed.match(/^([\u2022•\*\-])\s+(.*)$/);
      const numMatch = trimmed.match(/^([0-9a-zA-Z]+[\.\)])\s+(.*)$/);

      if (bulletMatch) {
        elements.push(
          <div key={`p-${index}`} className="flex items-start mb-2 text-justify" style={{ lineHeight: lineSpacing, paddingLeft: '1.27cm' }}>
            <span className="shrink-0 font-bold text-black" style={{ width: '0.635cm' }}>{bulletMatch[1]}</span>
            <span className="flex-1">{bulletMatch[2]}</span>
          </div>
        );
      } else if (numMatch) {
         elements.push(
           <div key={`p-${index}`} className="flex items-start mb-2 text-justify" style={{ lineHeight: lineSpacing, paddingLeft: '1.27cm' }}>
             <span className="shrink-0 font-bold text-black" style={{ width: '0.635cm' }}>{numMatch[1]}</span>
             <span className="flex-1">{numMatch[2]}</span>
           </div>
         );
      } else if (trimmed) {
         elements.push(
           <p key={`p-${index}`} className="mb-2 text-justify" style={{ lineHeight: lineSpacing, textIndent: '1.27cm' }}>
             {line}
           </p>
         );
      } else {
         elements.push(
           <p key={`p-${index}`} className="mb-2" style={{ lineHeight: lineSpacing }}>
             {"\u00A0"}
           </p>
         );
      }
    }
  });

  if (inTable) {
    flushTable('final');
  }

  return <div className="space-y-1">{elements}</div>;
};

interface LetterPreviewProps {
  data: LetterState;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({ data }) => {
  const getFontFamilyStyle = () => {
    switch (data.fontFamily) {
      case 'Arial':
        return '"Arial", "Helvetica Neue", sans-serif';
      case 'Bookman Old Style':
        return '"Bookman Old Style", "Bookman", "Georgia", serif';
      case 'Georgia':
        return '"Georgia", serif';
      case 'Courier New':
        return '"Courier New", Courier, monospace';
      case 'Times New Roman':
      default:
        return '"Times New Roman", Times, serif';
    }
  };

  const isTwoColumns = !['st', 'sk', 'std', 'se', 'ba'].includes(data.templateId || '');

  return (
    <div 
      className="bg-white shadow-2xl rounded-sm mx-auto text-black overflow-hidden break-words"
      style={{ 
        fontFamily: getFontFamilyStyle(),
        fontSize: data.fontSize ? `${data.fontSize}pt` : '12pt',
        width: '21.0cm',
        minHeight: '29.7cm',
        paddingTop: '2.0cm',
        paddingBottom: '2.0cm',
        paddingLeft: '3.0cm',
        paddingRight: '2.0cm',
        boxSizing: 'border-box'
      }}
    >
      {/* Kop Surat */}
      <div className="relative pb-1 mb-6">
        <div 
          className="grid items-center min-h-[110px] pb-2"
          style={{ 
            gridTemplateColumns: (data.showLogo && data.logoUrl) 
              ? "15% 70% 15%" 
              : "1fr"
          }}
        >
          {(data.showLogo && data.logoUrl) && (
            <div className="flex items-center justify-center">
              <img 
                src={data.logoUrl} 
                alt="Logo" 
                style={{ width: `${data.logoSize || 80}px` }}
                className="h-auto font-normal text-slate-400 text-xs"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="w-full text-center px-4">
            <h1 className="text-[14pt] font-bold uppercase leading-tight tracking-[0.02em] text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              {data.orgName}
            </h1>
            <h2 className="text-[18pt] font-bold uppercase leading-tight tracking-[0.02em] text-black mt-0.5" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              {data.deptName1}
            </h2>
            {data.deptName2 ? (
              <h2 className="text-[18pt] font-bold uppercase leading-tight tracking-[0.02em] text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                {data.deptName2}
              </h2>
            ) : null}
            <p className="text-[12pt] font-normal mt-1.5 leading-snug text-black tracking-normal" style={{ fontFamily: '"Aptos", "Segoe UI", sans-serif' }}>
              {data.addressLine1}
            </p>
            {data.addressLine2 ? (
              <p className="text-[12pt] font-normal leading-snug text-black tracking-normal" style={{ fontFamily: '"Aptos", "Segoe UI", sans-serif' }}>
                {data.addressLine2}
              </p>
            ) : null}
          </div>
          {(data.showLogo && data.logoUrl) && (
            <div />
          )}
        </div>
        {/* Garis Tebal-Tipis Kop (Kop Double Line) */}
        <div className="w-full flex flex-col gap-[1.5px] mt-1 mb-2">
          <div className="h-[3.5px] bg-black w-full" />
          <div className="h-[1px] bg-black w-full" />
        </div>
      </div>

      {/* Conditional Layouts based on templateId */}
      {data.templateId === 'nd' || data.templateId === 'lpd_tunggal' || data.templateId === 'lpd_kolektif' ? (
        /* Layout untuk NOTA DINAS / LAPORAN PERJALANAN DINAS TUNGGAL / KOLEKTIF */
        <div className="mb-8 border-b border-black pb-4">
          <h3 className="text-center font-bold text-[13pt] mb-6 uppercase tracking-wide leading-snug" style={{ fontFamily: getFontFamilyStyle() }}>{data.title}</h3>
          
          <div className="text-[11pt] font-sans" style={{ lineHeight: '1.5' }}>
            <div className="grid grid-cols-[120px_20px_1fr] py-0.5 text-black font-normal">
              <span>Kepada Yth.</span>
              <span>:</span>
              <span>{data.recipient}</span>
            </div>
            
            {data.templateId === 'lpd_kolektif' ? (
              <div className="grid grid-cols-[120px_20px_1fr] py-0.5 text-black font-normal">
                <span>Dari</span>
                <span>:</span>
                <div className="flex flex-col space-y-0.5">
                  {data.lpdMembers && data.lpdMembers.length > 0 ? (
                    data.lpdMembers.map((member, i) => (
                      <div key={i} className="flex gap-1.5 text-black font-normal">
                        <span className="w-4 shrink-0">{i + 1}.</span>
                        <span>{member.name}</span>
                      </div>
                    ))
                  ) : (
                    <span>{data.senderName}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[120px_20px_1fr] py-0.5 text-black font-normal">
                <span>Dari</span>
                <span>:</span>
                <span>{data.senderName}</span>
              </div>
            )}

            {data.templateId === 'lpd_tunggal' && (
              <div className="grid grid-cols-[120px_20px_1fr] py-0.5 text-black font-normal">
                <span>Lampiran</span>
                <span>:</span>
                <span>{data.lampiran || '-'}</span>
              </div>
            )}

            {data.templateId === 'nd' && (
              <div className="grid grid-cols-[120px_20px_1fr] py-0.5 text-black font-normal">
                <span>Nomor</span>
                <span>:</span>
                <span>{data.letterNumber}</span>
              </div>
            )}

            <div className="grid grid-cols-[120px_20px_1fr] py-0.5 text-black font-normal">
              <span>Perihal</span>
              <span>:</span>
              <span>{data.hal}</span>
            </div>

            {(data.templateId === 'lpd_kolektif' || data.templateId === 'nd') && (
              <div className="grid grid-cols-[120px_20px_1fr] py-0.5 text-black font-normal">
                <span>Tanggal</span>
                <span>:</span>
                <span>{data.date}</span>
              </div>
            )}
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
                    <div className="ml-12 text-black font-normal">
                      <p className="">Kepada Yth,</p>
                      <p className="max-w-[300px] mb-1">{data.recipient}</p>
                      <p className="mb-0">di -</p>
                      <p className="pl-6">{data.place || 'Mentok'}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-top">Hal</td>
                  <td className="align-top">:</td>
                  <td className="align-top underline">{data.hal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Body Sections */}
      <div className={`space-y-6 text-justify ${data.templateId === 'lpd_tunggal' ? 'pl-[140px]' : ''}`}>
        {data.sections.map((section, idx) => (
          <div key={idx}>
            {section.title && <h4 className="font-bold mb-2">{section.title}</h4>}
            <div className={`pl-0 ${data.templateId === 'sp' ? 'border p-4 bg-gray-50' : ''}`}>
              {renderSectionContent(section.content, data.lineSpacing || 1.15)}
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-8 mb-12 ${data.templateId === 'lpd_tunggal' ? 'pl-[140px]' : ''}`}>
        <p style={{ lineHeight: data.lineSpacing || 1.15 }}>{data.footer}</p>
      </div>

      {/* Signatures */}
      {isTwoColumns && data.templateId !== 'lpd_kolektif' && (
        <div className={`${data.templateId === 'lpd_tunggal' ? 'pl-[140px]' : 'mx-auto max-w-[85%]'    } w-full grid grid-cols-[55%_45%] gap-8 font-sans mt-12 text-black font-bold`}>
          <div />
          <div className="text-left font-bold">
            <p className="mb-2 font-bold">{data.place || 'Mentok'}, {data.date}</p>
          </div>
        </div>
      )}

      <div className={`${(data.templateId === 'lpd_tunggal' || data.templateId === 'lpd_kolektif') ? 'pl-[140px]' : 'mx-auto max-w-[85%]'} w-full grid grid-cols-[55%_45%] gap-8 ${(isTwoColumns && data.templateId !== 'lpd_kolektif') ? 'mt-2' : 'mt-12'} pb-12 font-bold text-black`}>
        {data.templateId === 'lpd_tunggal' ? (
          <>
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">Mengetahui,</p>
              <p className="mb-1 font-bold">{data.approverTitle}</p>
              <div className="h-24" />
              <p className="font-bold">{data.approverName}</p>
              {data.approverNip && <p className="text-[11.5pt] text-black mt-1 font-bold">NIP. {data.approverNip}</p>}
            </div>
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">Yang melaporkan,</p>
              <p className="mb-1 font-bold">Sekretaris,</p>
              <div className="h-24" />
              <p className="font-bold">{data.senderName}</p>
              {data.senderNip && <p className="text-[11.5pt] text-black mt-1 font-bold">NIP. {data.senderNip}</p>}
            </div>
          </>
        ) : data.templateId === 'lpd_kolektif' ? (
          <div className="col-span-2 w-full grid grid-cols-[55%_45%] gap-x-8 gap-y-1 font-sans font-bold">
            {/* Row 1: Mengetahui & Tempat/Tanggal */}
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">Mengetahui,</p>
            </div>
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">{data.place || 'Mentok'}, {data.date}</p>
            </div>

            {/* Row 2: Kasat Pol PP title & Yang Membuat */}
            <div className="text-left font-sans font-bold">
              <p className="mb-1 font-bold">{data.approverTitle}</p>
            </div>
            <div className="text-left font-sans font-bold">
              <p className="mb-1 font-bold">Yang Membuat,</p>
            </div>

            {/* Row 3: Signature Gaps & Approver Name */}
            <div className="text-left font-sans font-bold">
              <div className="h-24" />
              <p className="font-bold">{toTitleCase(data.approverName)}</p>
            </div>
            <div className="text-left font-sans flex flex-col justify-end font-bold">
              <div className="h-24" />
              <p className="font-bold invisible">Spacer</p>
            </div>

            {/* Row 4: Kasat NIP & Yang Membuat List (Starts aligned with NIP Kasat) */}
            <div className="text-left font-sans font-bold">
              {data.approverNip && <p className="text-[11.5pt] text-black mt-1 font-bold">NIP. {data.approverNip}</p>}
            </div>
            <div className="text-left font-sans pt-1 font-bold">
              <div className="space-y-4 font-bold">
                {data.lpdMembers && data.lpdMembers.length > 0 ? (
                  data.lpdMembers.map((member, i) => (
                    <div key={i} className="text-[11.5pt] flex items-start font-bold">
                      <span className="w-5 shrink-0 text-left font-bold">{i + 1}.</span>
                      <div className="font-bold">
                        <p className="font-bold text-black">{toTitleCase(member.name)}</p>
                        {member.nip && <p className="text-[11pt] text-black mt-0.5 font-bold">NIP. {member.nip}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[11.5pt] flex items-start font-bold">
                    <span className="w-5 shrink-0 text-left font-bold">1.</span>
                    <div className="font-bold">
                      <p className="font-bold text-black">{toTitleCase(data.senderName)}</p>
                      {data.senderNip && <p className="text-[11pt] text-black mt-0.5 font-bold">NIP. {data.senderNip}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : data.templateId === 'nd' ? (
          <>
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">Mengetahui/Menyetujui</p>
              <p className="mb-1 font-bold">{data.approverTitle}</p>
              <div className="h-24" />
              <p className="font-bold">{data.approverName}</p>
              {data.approverNip && <p className="text-[11.5pt] text-black mt-1 font-bold">NIP. {data.approverNip}</p>}
            </div>
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">Pelaksana Tugas,</p>
              <div className="h-24" />
              <p className="font-bold">{data.senderName}</p>
              {data.senderNip && <p className="text-[11.5pt] text-black mt-1 font-bold">NIP. {data.senderNip}</p>}
            </div>
          </>
        ) : (data.templateId === 'st' || data.templateId === 'sk' || data.templateId === 'std' || data.templateId === 'se' || data.templateId === 'ba') ? (
          <>
            <div />
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">{data.place || 'Mentok'}, {data.date}</p>
              <p className="mb-1 font-bold">{data.approverTitle}</p>
              <div className="h-24" />
              <p className="font-bold">{data.approverName}</p>
              {data.approverNip && <p className="text-[11.5pt] text-black mt-1 font-bold">NIP. {data.approverNip}</p>}
            </div>
          </>
        ) : (
          /* Default Laporan / Surat Dinas */
          <>
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">Mengetahui,</p>
              <p className="mb-1 font-bold">{data.approverTitle}</p>
              <div className="h-24" />
              <p className="font-bold">{data.approverName}</p>
              {data.approverNip && <p className="text-[11.5pt] text-black mt-1 font-bold">NIP. {data.approverNip}</p>}
            </div>
            <div className="text-left font-sans font-bold">
              <p className="mb-0.5 font-bold">Yang Membuat,</p>
              <div className="h-24" />
              <p className="font-bold">{data.senderName}</p>
              {data.senderNip && <p className="text-[11.5pt] text-black mt-1 font-bold">NIP. {data.senderNip}</p>}
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
