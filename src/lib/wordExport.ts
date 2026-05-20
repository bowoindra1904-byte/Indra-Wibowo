import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => {
      if (!word) return "";
      if (word.includes(".") || (word === word.toUpperCase() && word.length <= 4 && isNaN(Number(word)))) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

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
  lpdMembers?: Array<{ name: string; nip: string }>;
}

async function getLogoData(url: string) {
  try {
    if (!url) return null;

    // Handle data URLs directly
    if (url.startsWith("data:")) {
      const base64 = url.split(",")[1];
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

const parseContentToDocx = (
  content: string,
  lineSpacing: number,
  fontFamily?: string,
  fontSize?: number,
  leftIndent?: number,
): any[] => {
  if (!content) return [];

  const lines = content.split("\n");
  const elements: any[] = [];
  let currentTableRows: string[][] = [];
  let inTable = false;

  const flushTable = () => {
    if (currentTableRows.length > 0) {
      const rows = currentTableRows.filter((row) => {
        const joined = row.join("").trim();
        return !/^[:\-\s|]+$/.test(joined);
      });

      if (rows.length > 0) {
        const headers = rows[0];
        const bodyRows = rows.slice(1);

        elements.push(
          new Paragraph({ text: "", spacing: { before: 100, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: leftIndent ? AlignmentType.RIGHT : AlignmentType.CENTER,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
              insideHorizontal: {
                style: BorderStyle.SINGLE,
                size: 4,
                color: "CCCCCC",
              },
              insideVertical: {
                style: BorderStyle.SINGLE,
                size: 4,
                color: "CCCCCC",
              },
            },
            rows: [
              new TableRow({
                children: headers.map(
                  (cell) =>
                    new TableCell({
                      shading: { fill: "F1F5F9" },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: cell.trim(),
                              bold: true,
                              size: (fontSize || 12) * 2,
                              font: fontFamily || "Times New Roman",
                            }),
                          ],
                          spacing: { before: 100, after: 100 },
                        }),
                      ],
                    }),
                ),
              }),
              ...bodyRows.map(
                (row) =>
                  new TableRow({
                    children: row.map(
                      (cell) =>
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: cell.trim(),
                                  size: (fontSize || 12) * 2,
                                  font: fontFamily || "Times New Roman",
                                }),
                              ],
                              spacing: { before: 100, after: 100 },
                            }),
                          ],
                        }),
                    ),
                  }),
              ),
            ],
          }),
        );
      }
      currentTableRows = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith("|") ||
      (trimmed.includes("|") && trimmed.split("|").length > 2)
    ) {
      inTable = true;
      let parts = line.split("|");
      if (line.startsWith("|")) parts.shift();
      if (line.endsWith("|")) parts.pop();
      currentTableRows.push(parts);
    } else {
      if (inTable) {
        flushTable();
        inTable = false;
      }

      const bulletMatch = trimmed.match(/^([\u2022•\*\-])\s+(.*)$/);
      const numMatch = trimmed.match(/^([0-9a-zA-Z]+[\.\)])\s+(.*)$/);

      if (bulletMatch) {
        elements.push(
          new Paragraph({
            alignment: AlignmentType.BOTH,
            children: [
              new TextRun({
                text: bulletMatch[1] + "\t",
                bold: true,
                size: (fontSize || 12) * 2,
                font: fontFamily || "Times New Roman",
              }),
              new TextRun({
                text: bulletMatch[2],
                size: (fontSize || 12) * 2,
                font: fontFamily || "Times New Roman",
              }),
            ],
            indent: leftIndent 
              ? { left: 720 + leftIndent, hanging: 360 } 
              : { left: 720, hanging: 360 },
            spacing: {
              line: Math.round(lineSpacing * 240),
              after: 100,
            },
          }),
        );
      } else if (numMatch) {
        elements.push(
          new Paragraph({
            alignment: AlignmentType.BOTH,
            children: [
              new TextRun({
                text: numMatch[1] + "\t",
                bold: true,
                size: (fontSize || 12) * 2,
                font: fontFamily || "Times New Roman",
              }),
              new TextRun({
                text: numMatch[2],
                size: (fontSize || 12) * 2,
                font: fontFamily || "Times New Roman",
              }),
            ],
            indent: leftIndent 
              ? { left: 720 + leftIndent, hanging: 360 } 
              : { left: 720, hanging: 360 },
            spacing: {
              line: Math.round(lineSpacing * 240),
              after: 100,
            },
          }),
        );
      } else if (trimmed) {
        elements.push(
          new Paragraph({
            alignment: AlignmentType.BOTH,
            children: [
              new TextRun({
                text: line,
                size: (fontSize || 12) * 2,
                font: fontFamily || "Times New Roman",
              }),
            ],
            indent: leftIndent 
              ? { left: leftIndent, firstLine: 720 } 
              : { firstLine: 720 },
            spacing: {
              line: Math.round(lineSpacing * 240),
              after: 100,
            },
          }),
        );
      } else {
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: "" })],
            indent: leftIndent ? { left: leftIndent } : undefined,
            spacing: {
              after: 100,
            },
          }),
        );
      }
    }
  });

  if (inTable) {
    flushTable();
  }

  return elements;
};

export const exportToWord = async (data: LetterData) => {
  const bodyIndent = data.templateId === "lpd_tunggal" ? 1905 : undefined;
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
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 Width (8.27 in) in dxa
              height: 16838, // A4 Height (11.69 in) in dxa
            },
            margin: {
              top: 1134, // 2 cm in dxa
              bottom: 1134, // 2 cm in dxa
              left: 1701, // 3 cm in dxa (for binding/formal spacing)
              right: 1134, // 2 cm in dxa
            },
          },
        },
        children: [
          // Kop Surat using Table for layout with double bottom border line
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE }, // Set to NONE to let the cell bottom borders cleanly draw without overlapping double rendering
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: logoBuffer
                  ? [
                      new TableCell({
                        width: { size: 15, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: {
                            style: BorderStyle.THIN_THICK_MEDIUM_GAP,
                            size: 24,
                            color: "000000",
                          },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 0, after: 120 },
                            children: [
                              new ImageRun({
                                data: logoBuffer,
                                transformation: {
                                  width: data.logoSize || 60,
                                  height: Math.round(
                                    (data.logoSize || 60) * 1.2,
                                  ),
                                },
                              } as any),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 70, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: {
                            style: BorderStyle.THIN_THICK_MEDIUM_GAP,
                            size: 24,
                            color: "000000",
                          },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 0, after: 20, line: 240 },
                            children: [
                              new TextRun({
                                text: (data.orgName || "").toUpperCase(),
                                bold: true,
                                size: 28,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 0, after: 20, line: 240 },
                            children: [
                              new TextRun({
                                text: (data.deptName1 || "").toUpperCase(),
                                bold: true,
                                size: 36,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                          ...(data.deptName2
                            ? [
                                new Paragraph({
                                  alignment: AlignmentType.CENTER,
                                  spacing: { before: 0, after: 20, line: 240 },
                                  children: [
                                    new TextRun({
                                      text: (
                                        data.deptName2 || ""
                                      ).toUpperCase(),
                                      bold: true,
                                      size: 36,
                                      font: "Times New Roman",
                                    }),
                                  ],
                                }),
                              ]
                            : []),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                              before: 0,
                              after: data.addressLine2 ? 20 : 120,
                              line: 200,
                            },
                            children: [
                              new TextRun({
                                text: data.addressLine1 || "",
                                size: 24,
                                font: "Aptos",
                                color: "000000",
                              }),
                            ],
                          }),
                          ...(data.addressLine2
                            ? [
                                new Paragraph({
                                  alignment: AlignmentType.CENTER,
                                  spacing: { before: 0, after: 120, line: 200 },
                                  children: [
                                    new TextRun({
                                      text: data.addressLine2 || "",
                                      size: 24,
                                      font: "Aptos",
                                      color: "000000",
                                    }),
                                  ],
                                }),
                              ]
                            : []),
                        ],
                      }),
                      new TableCell({
                        width: { size: 15, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: {
                            style: BorderStyle.THIN_THICK_MEDIUM_GAP,
                            size: 24,
                            color: "000000",
                          },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 0, after: 0 },
                            children: [],
                          }),
                        ],
                      }),
                    ]
                  : [
                      new TableCell({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: {
                            style: BorderStyle.THIN_THICK_MEDIUM_GAP,
                            size: 24,
                            color: "000000",
                          },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 0, after: 20, line: 240 },
                            children: [
                              new TextRun({
                                text: (data.orgName || "").toUpperCase(),
                                bold: true,
                                size: 28,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 0, after: 20, line: 240 },
                            children: [
                              new TextRun({
                                text: (data.deptName1 || "").toUpperCase(),
                                bold: true,
                                size: 36,
                                font: "Times New Roman",
                              }),
                            ],
                          }),
                          ...(data.deptName2
                            ? [
                                new Paragraph({
                                  alignment: AlignmentType.CENTER,
                                  spacing: { before: 0, after: 20, line: 240 },
                                  children: [
                                    new TextRun({
                                      text: (
                                        data.deptName2 || ""
                                      ).toUpperCase(),
                                      bold: true,
                                      size: 36,
                                      font: "Times New Roman",
                                    }),
                                  ],
                                }),
                              ]
                            : []),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                              before: 0,
                              after: data.addressLine2 ? 20 : 120,
                              line: 200,
                            },
                            children: [
                              new TextRun({
                                text: data.addressLine1 || "",
                                size: 24,
                                font: "Aptos",
                                color: "000000",
                              }),
                            ],
                          }),
                          ...(data.addressLine2
                            ? [
                                new Paragraph({
                                  alignment: AlignmentType.CENTER,
                                  spacing: { before: 0, after: 120, line: 200 },
                                  children: [
                                    new TextRun({
                                      text: data.addressLine2 || "",
                                      size: 24,
                                      font: "Aptos",
                                      color: "000000",
                                    }),
                                  ],
                                }),
                              ]
                            : []),
                        ],
                      }),
                    ],
              }),
            ],
          }),
          new Paragraph({
            text: "",
            spacing: { before: 100, after: 100 },
          }),

          // Conditional Header/Meta based on templateId
          ...(data.templateId === "nd" ||
          data.templateId === "lpd_tunggal" ||
          data.templateId === "lpd_kolektif"
            ? [
                // Layout NOTA DINAS / LPD Header
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 240 },
                  children: [
                    new TextRun({
                      text: data.title.toUpperCase(),
                      bold: true,
                      size: (data.fontSize || 12) * 2 + 4,
                      font: data.fontFamily || "Times New Roman",
                    }),
                  ],
                }),
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: 8,
                      color: "000000",
                    }, // standard bottom line
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                  },
                  rows: [
                    // Row 1: Kepada Yth.
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 18, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { line: 360, before: 40, after: 40 },
                              children: [
                                new TextRun({
                                  text: "Kepada Yth.",
                                  size: (data.fontSize || 12) * 2,
                                  font: data.fontFamily || "Times New Roman",
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 3, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { line: 360, before: 40, after: 40 },
                              children: [
                                new TextRun({
                                  text: ":",
                                  size: (data.fontSize || 12) * 2,
                                  font: data.fontFamily || "Times New Roman",
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 79, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { line: 360, before: 40, after: 40 },
                              children: [
                                new TextRun({
                                  text: data.recipient || "",
                                  size: (data.fontSize || 12) * 2,
                                  font: data.fontFamily || "Times New Roman",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    // Row 2: Dari
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 18, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { line: 360, before: 40, after: 40 },
                              children: [
                                new TextRun({
                                  text: "Dari",
                                  size: (data.fontSize || 12) * 2,
                                  font: data.fontFamily || "Times New Roman",
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 3, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { line: 360, before: 40, after: 40 },
                              children: [
                                new TextRun({
                                  text: ":",
                                  size: (data.fontSize || 12) * 2,
                                  font: data.fontFamily || "Times New Roman",
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 79, type: WidthType.PERCENTAGE },
                          children: [
                            ...(data.templateId === "lpd_kolektif"
                              ? (data.lpdMembers || []).map(
                                  (m, i) =>
                                    new Paragraph({
                                      spacing: {
                                        line: 360,
                                        before: 20,
                                        after: 20,
                                      },
                                      children: [
                                        new TextRun({
                                          text: `${i + 1}. ${m.name}`,
                                          size: (data.fontSize || 12) * 2,
                                          font:
                                            data.fontFamily ||
                                            "Times New Roman",
                                        }),
                                      ],
                                    }),
                                )
                              : [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: data.senderName || "",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ]),
                          ],
                        }),
                      ],
                    }),
                    // Row 3: Lampiran
                    ...(data.templateId === "lpd_tunggal"
                      ? [
                          new TableRow({
                            children: [
                              new TableCell({
                                width: { size: 18, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: "Lampiran",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new TableCell({
                                width: { size: 3, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: ":",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new TableCell({
                                width: { size: 79, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: data.lampiran || "-",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ]
                      : []),
                    // Row 4: Nomor
                    ...(data.templateId === "nd"
                      ? [
                          new TableRow({
                            children: [
                              new TableCell({
                                width: { size: 18, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: "Nomor",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new TableCell({
                                width: { size: 3, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: ":",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new TableCell({
                                width: { size: 79, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: data.letterNumber || "",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ]
                      : []),
                    // Row 5: Perihal
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 18, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { line: 360, before: 40, after: 40 },
                              children: [
                                new TextRun({
                                  text: "Perihal",
                                  size: (data.fontSize || 12) * 2,
                                  font: data.fontFamily || "Times New Roman",
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 3, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { line: 360, before: 40, after: 40 },
                              children: [
                                new TextRun({
                                  text: ":",
                                  size: (data.fontSize || 12) * 2,
                                  font: data.fontFamily || "Times New Roman",
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 79, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { line: 360, before: 40, after: 40 },
                              children: [
                                new TextRun({
                                  text: data.hal || "",
                                  size: (data.fontSize || 12) * 2,
                                  font: data.fontFamily || "Times New Roman",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    // Row 6: Tanggal
                    ...(data.templateId === "lpd_kolektif" ||
                    data.templateId === "nd"
                      ? [
                          new TableRow({
                            children: [
                              new TableCell({
                                width: { size: 18, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: "Tanggal",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new TableCell({
                                width: { size: 3, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: ":",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              new TableCell({
                                width: { size: 79, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({
                                    spacing: {
                                      line: 360,
                                      before: 40,
                                      after: 40,
                                    },
                                    children: [
                                      new TextRun({
                                        text: data.date || "",
                                        size: (data.fontSize || 12) * 2,
                                        font:
                                          data.fontFamily || "Times New Roman",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ]
                      : []),
                  ],
                }),
              ]
            : data.templateId === "st" ||
                data.templateId === "sk" ||
                data.templateId === "std"
              ? [
                  // Layout SURAT TUGAS / KETERANGAN
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200 },
                    children: [
                      new TextRun({
                        text: data.title.toUpperCase(),
                        bold: true,
                        size: (data.fontSize || 12) * 2 + 4,
                        underline: {},
                        font: data.fontFamily || "Times New Roman",
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [
                      new TextRun({
                        text: `Nomor : ${data.letterNumber || ""}`,
                        size: (data.fontSize || 12) * 2,
                        font: data.fontFamily || "Times New Roman",
                      }),
                    ],
                  }),
                ]
              : [
                  // Layout DEFAULT (Surat Dinas / Laporan)
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [
                      new TextRun({
                        text: data.title.toUpperCase(),
                        bold: true,
                        size: (data.fontSize || 12) * 2 + 4,
                        font: data.fontFamily || "Times New Roman",
                      }),
                    ],
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
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `Nomor    : ${data.letterNumber || ""}`,
                                    size: (data.fontSize || 12) * 2,
                                    font: data.fontFamily || "Times New Roman",
                                  }),
                                ],
                              }),
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `Lampiran : ${data.lampiran || ""}`,
                                    size: (data.fontSize || 12) * 2,
                                    font: data.fontFamily || "Times New Roman",
                                  }),
                                ],
                              }),
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `Hal      : ${data.hal || ""}`,
                                    size: (data.fontSize || 12) * 2,
                                    underline: {},
                                    font: data.fontFamily || "Times New Roman",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                  new TextRun({
                                    text: `${data.place || "Mentok"}, ${data.date}`,
                                    size: (data.fontSize || 12) * 2,
                                    font: data.fontFamily || "Times New Roman",
                                  }),
                                ],
                                spacing: { after: 200 },
                              }),
                              new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                  new TextRun({
                                    text: "Kepada Yth,",
                                    size: (data.fontSize || 12) * 2,
                                    font: data.fontFamily || "Times New Roman",
                                  }),
                                ],
                              }),
                              new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                  new TextRun({
                                    text: data.recipient || "",
                                    size: (data.fontSize || 12) * 2,
                                    font: data.fontFamily || "Times New Roman",
                                  }),
                                ],
                              }),
                              new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                  new TextRun({
                                    text: "di -",
                                    size: (data.fontSize || 12) * 2,
                                    font: data.fontFamily || "Times New Roman",
                                  }),
                                ],
                              }),
                              new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                  new TextRun({
                                    text: data.place || "Mentok",
                                    size: (data.fontSize || 12) * 2,
                                    font: data.fontFamily || "Times New Roman",
                                  }),
                                ],
                                indent: { left: 400 },
                              }),
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
            ...(section.title
              ? [
                  new Paragraph({
                    spacing: { before: 200, after: 100 },
                    indent: bodyIndent ? { left: bodyIndent } : undefined,
                    children: [
                      new TextRun({
                        text: section.title,
                        bold: true,
                        size: (data.fontSize || 12) * 2,
                        font: data.fontFamily || "Times New Roman",
                      }),
                    ],
                  }),
                ]
              : []),
            ...parseContentToDocx(
              section.content,
              data.lineSpacing || 1.15,
              data.fontFamily,
              data.fontSize,
              bodyIndent,
            ),
          ]),

          new Paragraph({
            text: data.footer || "",
            indent: bodyIndent ? { left: bodyIndent } : undefined,
            spacing: {
              before: 400,
              after: 400,
              line: Math.round((data.lineSpacing || 1.15) * 240),
            },
          }),

          // Signatures Table (Clean, borderless grid with standard font sizing & uppercase bold names)
          new Table({
            width: { size: data.templateId === "lpd_tunggal" ? 100 : 85, type: WidthType.PERCENTAGE },
            alignment: data.templateId === "lpd_tunggal" ? AlignmentType.LEFT : AlignmentType.CENTER,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows:
              data.templateId === "lpd_tunggal"
                ? [
                    new TableRow({
                      children: [
                        new TableCell({ width: { size: 21, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [] })] }),
                        new TableCell({ width: { size: 43, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [] })] }),
                        new TableCell({
                          width: { size: 36, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `${data.place || "Mentok"}, ${data.date}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                          ],
                        }),
                      ],
                    }),
                    new TableRow({
                      children: [
                        new TableCell({ width: { size: 21, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [] })] }),
                        new TableCell({
                          width: { size: 43, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Mengetahui,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverTitle || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                            new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                            new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                            new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverName || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            ...(data.approverNip ? [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.approverNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                          ],
                        }),
                        new TableCell({
                          width: { size: 36, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Yang melaporkan,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Sekretaris,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                            new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                            new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                            new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.senderName || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            ...(data.senderNip ? [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.senderNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                          ],
                        }),
                      ],
                    }),
                  ]
                : data.templateId === "lpd_kolektif"
                  ? [
                      // Row 1: Mengetahui & Tempat/Tanggal
                      new TableRow({
                        children: [
                          new TableCell({
                            width: { size: 55, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Mengetahui,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            ],
                          }),
                          new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `${data.place || "Mentok"}, ${data.date}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            ],
                          }),
                        ],
                      }),
                      // Row 2: Kasat Pol PP & Yang Membuat
                      new TableRow({
                        children: [
                          new TableCell({
                            width: { size: 55, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverTitle || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            ],
                          }),
                          new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Yang Membuat,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            ],
                          }),
                        ],
                      }),
                      // Row 3: Signature Space & Approver Name
                      new TableRow({
                        children: [
                          new TableCell({
                            width: { size: 55, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                              new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                              new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                              new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: toTitleCase(data.approverName || ""), bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                            ],
                          }),
                          new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [
                              new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                              new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                              new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                              new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                            ],
                          }),
                        ],
                      }),
                      // Row 4: NIP Kasat & Yang Membuat Members List
                      new TableRow({
                        children: [
                          new TableCell({
                            width: { size: 55, type: WidthType.PERCENTAGE },
                            children: [
                              ...(data.approverNip ? [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.approverNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : [new Paragraph({ children: [] })]),
                            ],
                          }),
                          new TableCell({
                            width: { size: 45, type: WidthType.PERCENTAGE },
                            children: [
                              ...(data.lpdMembers && data.lpdMembers.length > 0 ? (
                                data.lpdMembers.map((member, i) => [
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `${i + 1}. ${toTitleCase(member.name)}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  ...(member.nip ? [new Paragraph({ indent: { left: 240 }, alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${member.nip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                ]).flat()
                              ) : [
                                new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `1. ${toTitleCase(data.senderName)}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                ...(data.senderNip ? [new Paragraph({ indent: { left: 240 }, alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.senderNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                              ]),
                            ],
                          }),
                        ],
                      }),
                    ]
                  : data.templateId === "nd"
                    ? [
                        new TableRow({
                          children: [
                            new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [] })] }),
                            new TableCell({
                              width: { size: 45, type: WidthType.PERCENTAGE },
                              children: [
                                new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `Mentok, ${data.date}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                              ],
                            }),
                          ],
                        }),
                        new TableRow({
                          children: [
                            new TableCell({
                              width: { size: 55, type: WidthType.PERCENTAGE },
                              children: [
                                new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Mengetahui/Menyetujui,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverTitle || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverName || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                ...(data.approverNip ? [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.approverNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                              ],
                            }),
                            new TableCell({
                              width: { size: 45, type: WidthType.PERCENTAGE },
                              children: [
                                new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Pelaksana Tugas,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.senderName || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                ...(data.senderNip ? [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.senderNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                              ],
                            }),
                          ],
                        }),
                      ]
                    : data.templateId === "st" ||
                        data.templateId === "sk" ||
                        data.templateId === "std" ||
                        data.templateId === "se" ||
                        data.templateId === "ba"
                      ? [
                          new TableRow({
                            children: [
                              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [] }),
                              new TableCell({
                                width: { size: 45, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `${data.place || "Mentok"}, ${data.date}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverTitle || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverName || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  ...(data.approverNip ? [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.approverNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                                ],
                              }),
                            ],
                          }),
                        ]
                      : [
                          new TableRow({
                            children: [
                              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [] })] }),
                              new TableCell({
                                width: { size: 45, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `${data.place || "Mentok"}, ${data.date}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                ],
                              }),
                            ],
                          }),
                          new TableRow({
                            children: [
                              new TableCell({
                                width: { size: 55, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Mengetahui,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverTitle || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.approverName || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  ...(data.approverNip ? [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.approverNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                                ],
                              }),
                              new TableCell({
                                width: { size: 45, type: WidthType.PERCENTAGE },
                                children: [
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Yang Membuat,", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ children: [new TextRun({ text: "", size: (data.fontSize || 12) * 2 })] }),
                                  new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: data.senderName || "", bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] }),
                                  ...(data.senderNip ? [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `NIP. ${data.senderNip}`, bold: true, size: (data.fontSize || 12) * 2, font: data.fontFamily || "Times New Roman" })] })] : []),
                                ],
                              }),
                            ],
                          }),
                        ],
          }),
          ...(data.tembusan
            ? [
                new Paragraph({ text: "", spacing: { before: 400 } }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Tembusan kepada Yth :",
                      bold: true,
                      underline: {},
                      size: (data.fontSize || 12) * 2,
                      font: data.fontFamily || "Times New Roman",
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                ...data.tembusan
                  .split("\n")
                  .filter((l) => l.trim())
                  .map(
                    (line, i) =>
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${i + 1}. ${line}`,
                            size: (data.fontSize || 12) * 2 - 2,
                            font: data.fontFamily || "Times New Roman",
                          }),
                        ],
                      }),
                  ),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title}.docx`);
};
