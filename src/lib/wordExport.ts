import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun } from "docx";
import { saveAs } from "file-saver";

interface LetterData {
  title: string;
  recipient: string;
  sender: string;
  subject: string;
  sections: Array<{ title: string; content: string }>;
  date: string;
  senderName: string;
  senderNip: string;
  approverName?: string;
  approverNip?: string;
  approverTitle?: string;
  showLogo?: boolean;
  logoSize?: number;
  logoUrl?: string;
  orgName?: string;
  deptName1?: string;
  deptName2?: string;
  addressLine1?: string;
  addressLine2?: string;
  letterNumber?: string;
  hal?: string;
  lampiran?: string;
  tembusan?: string;
  place?: string;
  templateId?: string;
  footer?: string;
  lineSpacing?: number;
  fontFamily?: string;
  fontSize?: number;
}

async function getLogoData(url: string) {
  try {
    if (!url) return null;
    
    // Handle data URLs directly
    if (url.startsWith('data:')) {
      const base64 = url.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    }

    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Logo fetch failed with status: ${response.status}`);
      return null;
    }
    const blob = await response.blob();
    return await blob.arrayBuffer();
  } catch (e) {
    console.error("Failed to fetch logo for word export", e);
    return null;
  }
}

const parseContentToDocx = (content: string, lineSpacing: number, fontFamily?: string, fontSize?: number): any[] => {
  if (!content) return [];

  const lines = content.split('\n');
  const elements: any[] = [];
  let currentTableRows: string[][] = [];
  let inTable = false;

  const flushTable = () => {
    if (currentTableRows.length > 0) {
      const rows = currentTableRows.filter(row => {
        const joined = row.join('').trim();
        return !/^[:\-\s|]+$/.test(joined);
      });

      if (rows.length > 0) {
        const headers = rows[0];
        const bodyRows = rows.slice(1);

        elements.push(
          new Paragraph({ text: "", spacing: { before: 100, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
            },
            rows: [
              new TableRow({
                children: headers.map(cell => new TableCell({
                  shading: { fill: "F1F5F9" },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: cell.trim(), bold: true, size: (fontSize || 12) * 2, font: fontFamily || "Times New Roman" })],
                      spacing: { before: 100, after: 100 }
                    })
                  ]
                }))
              }),
              ...bodyRows.map(row => new TableRow({
                children: row.map(cell => new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: cell.trim(), size: (fontSize || 12) * 2, font: fontFamily || "Times New Roman" })],
                      spacing: { before: 100, after: 100 }
                    })
                  ]
                }))
              }))
            ]
          })
        );
      }
      currentTableRows = [];
    }
  };

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') || (trimmed.includes('|') && trimmed.split('|').length > 2)) {
      inTable = true;
      let parts = line.split('|');
      if (line.startsWith('|')) parts.shift();
      if (line.endsWith('|')) parts.pop();
      currentTableRows.push(parts);
    } else {
      if (inTable) {
        flushTable();
        inTable = false;
      }
      elements.push(
        new Paragraph({
          alignment: AlignmentType.BOTH,
          children: [new TextRun({ text: line, size: (fontSize || 12) * 2, font: fontFamily || "Times New Roman" })],
          spacing: {
            line: Math.round(lineSpacing * 240),
            after: 100
          }
        })
      );
    }
  });

  if (inTable) {
    flushTable();
  }

  return elements;
};

export const exportToWord = async (data: LetterData) => {
  let logoBuffer: Uint8Array | null = null;
  if (data.showLogo && data.logoUrl) {
    const arrayBuffer = await getLogoData(data.logoUrl);
    if (arrayBuffer) {
      logoBuffer = new Uint8Array(arrayBuffer);
    }
  }
  
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: data.fontFamily || "Times New Roman",
            size: (data.fontSize || 12) * 2,
          }
        }
      }
    },
    sections: [
      {
        properties: {},
        children: [
          // Kop Surat using Table for layout
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
               top: { style: BorderStyle.NONE },
               bottom: { style: BorderStyle.NONE },
               left: { style: BorderStyle.NONE },
               right: { style: BorderStyle.NONE },
               insideHorizontal: { style: BorderStyle.NONE },
               insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                   new TableCell({
                     width: { size: 15, type: WidthType.PERCENTAGE },
                     children: logoBuffer ? [
                       new Paragraph({
                         children: [
                           new ImageRun({
                             data: logoBuffer,
                             transformation: { 
                               width: data.logoSize || 60, 
                               height: Math.round((data.logoSize || 60) * 1.2) 
                             },
                           } as any),
                         ],
                       }),
                     ] : [],
                   }),
                   new TableCell({
                     width: { size: 85, type: WidthType.PERCENTAGE },
                     children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: data.orgName || "", bold: true, size: 28 }),
                          ],
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: data.deptName1 || "", bold: true, size: 24 }),
                          ],
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: data.deptName2 || "", bold: true, size: 24 }),
                          ],
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: data.addressLine1 || "", size: 18 }),
                          ],
                        }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: data.addressLine2 || "", size: 18 }),
                          ],
                        }),
                     ],
                   }),
                ],
              }),
            ],
          }),
          new Paragraph({
             border: { bottom: { color: "auto", space: 1, style: BorderStyle.DOUBLE, size: 24 } },
             spacing: { after: 200 }
          }),

          // Conditional Header/Meta based on templateId
          ...(data.templateId === 'nd' || data.templateId === 'lpd' ? [
            // Layout NOTA DINAS / LPD Header (Non-Table)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [new TextRun({ text: data.title.toUpperCase(), bold: true, size: 28 })],
            }),
            new Paragraph({
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 4 },
              },
              spacing: { before: 200, after: 400 },
              children: [
                new TextRun({ text: `Kepada     : ${data.recipient || ""}`, bold: true, size: 22, break: 1 }),
                new TextRun({ text: `Dari       : ${data.senderName || ""}`, bold: true, size: 22, break: 1 }),
                ...(data.templateId === 'nd' ? [
                  new TextRun({ text: `Nomor      : ${data.letterNumber || ""}`, size: 22, break: 1 }),
                ] : []),
                new TextRun({ text: `Tanggal    : ${data.date || ""}`, size: 22, break: 1 }),
                new TextRun({ text: `Hal        : ${data.hal || ""}`, bold: true, italics: true, underline: {}, size: 22, break: 1 }),
                new TextRun({ text: "", break: 1 }), // Extra spacing inside border at bottom
              ],
            }),
          ] : 
(data.templateId === 'st' || data.templateId === 'sk' || data.templateId === 'std') ? [
            // Layout SURAT TUGAS / KETERANGAN
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 200 },
              children: [new TextRun({ text: data.title.toUpperCase(), bold: true, size: 28, underline: {} })],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              children: [new TextRun({ text: `Nomor : ${data.letterNumber || ""}`, size: 22 })],
            }),
          ] : [
            // Layout DEFAULT (Surat Dinas / Laporan)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              children: [new TextRun({ text: data.title.toUpperCase(), bold: true, size: 28 })],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                 top: { style: BorderStyle.NONE },
                 bottom: { style: BorderStyle.NONE },
                 left: { style: BorderStyle.NONE },
                 right: { style: BorderStyle.NONE },
                 insideHorizontal: { style: BorderStyle.NONE },
                 insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 55, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({ children: [new TextRun({ text: `Nomor    : ${data.letterNumber || ""}`, size: 22 })] }),
                        new Paragraph({ children: [new TextRun({ text: `Lampiran : ${data.lampiran || ""}`, size: 22 })] }),
                        new Paragraph({ children: [new TextRun({ text: `Hal      : ${data.hal || ""}`, size: 22, bold: true, underline: {} })] }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 45, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `${data.place || "Mentok"}, ${data.date}`, size: 22 })], spacing: { after: 200 } }),
                        new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Kepada Yth,", size: 22, bold: true })] }),
                        new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.recipient || "", size: 22 })] }),
                        new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "di -", size: 22 })] }),
                        new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.place || "Mentok", size: 22, bold: true })], indent: { left: 400 } }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({ spacing: { after: 400 } }),
          ]),

          // Sections
          ...data.sections.flatMap((section) => [
            ...(section.title ? [
              new Paragraph({
                spacing: { before: 200, after: 100 },
                children: [new TextRun({ text: section.title, bold: true })],
              })
            ] : []),
            ...parseContentToDocx(section.content, data.lineSpacing || 1.15, data.fontFamily, data.fontSize)
          ]),

          new Paragraph({ 
            text: data.footer || "", 
            spacing: { 
              before: 400, 
              after: 400,
              line: Math.round((data.lineSpacing || 1.15) * 240)
            } 
          }),

          // Signatures
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
             borders: {
               top: { style: BorderStyle.NONE },
               bottom: { style: BorderStyle.NONE },
               left: { style: BorderStyle.NONE },
               right: { style: BorderStyle.NONE },
               insideHorizontal: { style: BorderStyle.NONE },
               insideVertical: { style: BorderStyle.NONE },
            },
            rows: (data.templateId === 'nd' || data.templateId === 'lpd') ? [
              new TableRow({
                children: [
                  new TableCell({ 
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Mengetahui/Menyetujui,", size: 22 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.approverTitle || "", bold: true, size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.approverName || "", bold: true, underline: {}, size: 22 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `NIP ${data.approverNip || ""}`, size: 22 })] }),
                    ]
                  }),
                  new TableCell({ 
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Mentok, ${data.date}`, italics: true, size: 22 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pelaksana Tugas,", bold: true, size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.senderName || "", bold: true, underline: {}, size: 22 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `NIP ${data.senderNip || ""}`, size: 22 })] }),
                    ]
                  }),
                ],
              }),
            ] : (data.templateId === 'st' || data.templateId === 'sk' || data.templateId === 'std' || data.templateId === 'se' || data.templateId === 'ba') ? [
              new TableRow({
                children: [
                  new TableCell({ children: [] }),
                  new TableCell({ 
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.approverTitle || "", bold: true, size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.approverName || "", bold: true, underline: {}, size: 22 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `NIP ${data.approverNip || ""}`, size: 22 })] }),
                    ]
                  }),
                ],
              }),
            ] : [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Mengetahui,")] }),
                  new TableCell({ children: [new Paragraph({ text: `${data.place || "Mentok"}, ${data.date}`, alignment: AlignmentType.RIGHT })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(data.approverTitle || "")] }),
                  new TableCell({ children: [new Paragraph({ text: "Yang Membuat", alignment: AlignmentType.RIGHT })] }),
                ],
              }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph("")] }), new TableCell({ children: [new Paragraph("")] })] }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph("")] }), new TableCell({ children: [new Paragraph("")] })] }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: data.approverName || "", bold: true, underline: {} })] }),
                      new Paragraph({ text: `NIP ${data.approverNip || ""}` }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.senderName, bold: true, underline: {} })] }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, text: `NIP ${data.senderNip}` }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          ...(data.tembusan ? [
            new Paragraph({ text: "", spacing: { before: 400 } }),
            new Paragraph({
              children: [new TextRun({ text: "Tembusan kepada Yth :", bold: true, underline: {} })],
              spacing: { after: 100 },
            }),
            ...data.tembusan.split('\n').filter(l => l.trim()).map((line, i) => 
              new Paragraph({
                children: [new TextRun({ text: `${i + 1}. ${line}`, size: 20 })],
              })
            )
          ] : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title}.docx`);
};
