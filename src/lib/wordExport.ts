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
}

async function getLogoData(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await blob.arrayBuffer();
  } catch (e) {
    console.error("Failed to fetch logo for word export", e);
    return null;
  }
}

export const exportToWord = async (data: LetterData) => {
  const logoData = data.showLogo ? await getLogoData(data.logoUrl || "") : null;
  
  const doc = new Document({
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
                     children: logoData ? [
                       new Paragraph({
                         children: [
                           new (ImageRun as any)({
                             data: new Uint8Array(logoData),
                             transformation: { width: data.logoSize || 60, height: ((data.logoSize || 60) * 1.25) },
                           }),
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
             border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 24 } },
             spacing: { after: 200 }
          }),

          // Conditional Header/Meta based on templateId
          ...(data.templateId === 'nd' || data.templateId === 'lpd' ? [
            // Layout NOTA DINAS / LPD Header
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 12 },
                bottom: { style: BorderStyle.SINGLE, size: 12 },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({ children: [
                  new TableCell({ columnSpan: 2, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.title.toUpperCase(), bold: true, size: 28 })] })] }),
                ]}),
                new TableRow({ children: [
                  new TableCell({ width: { size: 20 }, children: [new Paragraph("Kepada")] }),
                  new TableCell({ width: { size: 80 }, children: [new Paragraph({ children: [new TextRun({ text: `: ${data.recipient || ""}`, bold: true })] })] }),
                ]}),
                new TableRow({ children: [
                  new TableCell({ width: { size: 20 }, children: [new Paragraph("Dari")] }),
                  new TableCell({ width: { size: 80 }, children: [new Paragraph({ children: [new TextRun({ text: `: ${data.senderName || ""}`, bold: true })] })] }),
                ]}),
                ...(data.templateId === 'nd' ? [
                  new TableRow({ children: [
                    new TableCell({ width: { size: 20 }, children: [new Paragraph("Nomor")] }),
                    new TableCell({ width: { size: 80 }, children: [new Paragraph(`: ${data.letterNumber || ""}`)] }),
                  ]}),
                ] : []),
                new TableRow({ children: [
                  new TableCell({ width: { size: 20 }, children: [new Paragraph("Tanggal")] }),
                  new TableCell({ width: { size: 80 }, children: [new Paragraph(`: ${data.date || ""}`)] }),
                ]}),
                new TableRow({ children: [
                  new TableCell({ width: { size: 20 }, children: [new Paragraph("Hal")] }),
                  new TableCell({ width: { size: 80 }, children: [new Paragraph({ children: [new TextRun({ text: `: ${data.hal || ""}`, bold: true, underline: {}, italics: true })] })] }),
                ]}),
              ]
            }),
            new Paragraph({ spacing: { after: 400 } }),
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
                      width: { size: 60, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({ children: [new TextRun({ text: `Nomor    : ${data.letterNumber || ""}`, size: 22 })] }),
                        new Paragraph({ children: [new TextRun({ text: `Lampiran : ${data.lampiran || ""}`, size: 22 })] }),
                        new Paragraph({ children: [new TextRun({ text: `Hal      : ${data.hal || ""}`, size: 22, bold: true, underline: {} })] }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 40, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${data.place || "Mentok"}, ${data.date}`, size: 22 })] }),
                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Kepada Yth,", size: 22, bold: true })] }),
                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: data.recipient || "", size: 22, bold: true })] }),
                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "di -", size: 22 })] }),
                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Mentok", size: 22, bold: true })] }),
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
            ...section.content.split("\n").map(line => new Paragraph({
              alignment: AlignmentType.BOTH,
              children: [new TextRun({ text: line, size: 22 })],
              spacing: { after: 100 }
            }))
          ]),

          new Paragraph({ text: data.footer || "", spacing: { before: 400, after: 400 } }),

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
