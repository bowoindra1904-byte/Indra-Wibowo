export interface LetterSection {
  title: string;
  content: string;
}

export interface LetterState {
  title: string;
  recipient: string;
  sender: string;
  subject: string;
  sections: LetterSection[];
  date: string;
  senderName: string;
  senderNip: string;
  approverName: string;
  approverNip: string;
  approverTitle: string;
  showLogo: boolean;
  logoSize: number;
  logoUrl: string;
  orgName: string;
  deptName1: string;
  deptName2: string;
  addressLine1: string;
  addressLine2: string;
  letterNumber: string;
  hal: string;
  lampiran: string;
  tembusan: string;
  templateId: string;
  footer: string;
}

export const LETTER_TEMPLATES = [
  {
    id: "lpd",
    name: "Laporan Perjalanan Dinas",
    title: "LAPORAN PERJALANAN DINAS",
    footer: "Demikian laporan hasil perjalanan dinas ini disampaikan untuk menjadi maklum.",
    sections: [
      { title: "I. Dasar", content: "" },
      { title: "II. Maksud dan Tujuan", content: "" },
      { title: "III. Waktu dan Tempat", content: "" },
      { title: "IV. Hasil yang dicapai", content: "" },
      { title: "V. Kesimpulan dan Saran", content: "" }
    ]
  },
  {
    id: "st",
    name: "Surat Tugas",
    title: "SURAT TUGAS",
    footer: "Demikian untuk dilaksanakan dengan penuh tanggung jawab.",
    sections: [
      { title: "Dasar", content: "" },
      { title: "Menugaskan", content: "Kepada:\n1. Nama: ... \n2. Nama: ..." },
      { title: "Untuk", content: "" }
    ]
  },
  {
    id: "und",
    name: "Surat Undangan",
    title: "UNDANGAN",
    footer: "Demikian undangan ini disampaikan, atas kehadirannya diucapkan terima kasih.",
    sections: [
      { title: "Konten Undangan", content: "Hari/Tanggal:\nWaktu:\nTempat:\nAcara:" }
    ]
  },
  {
    id: "sp",
    name: "Surat Pengantar",
    title: "SURAT PENGANTAR",
    footer: "Disampaikan dengan hormat untuk menjadi maklum.",
    sections: [
      { title: "Naskah Dinas yang Dikirim", content: "1. ....\n2. ...." },
      { title: "Banyaknya", content: "" },
      { title: "Keterangan", content: "Disampaikan dengan hormat untuk ..." }
    ]
  },
  {
    id: "std",
    name: "Surat Teguran Disiplin",
    title: "SURAT TEGURAN DISIPLIN",
    footer: "Demikian surat teguran ini disampaikan untuk diperhatikan dan dilaksanakan.",
    sections: [
      { title: "Dasar", content: "Berdasarkan Peraturan Pemerintah Nomor 94 Tahun 2021 tentang Disiplin Pegawai Negeri Sipil, bahwa Saudara telah ..." },
      { title: "Pelanggaran", content: "Saudara didapati tidak masuk kerja/terlambat tanpa keterangan yang sah selama ..." },
      { title: "Teguran", content: "Dengan ini memberikan Teguran Lisan/Tertulis agar Saudara segera memperbaiki kinerja dan mematuhi jam kerja." }
    ]
  },
  {
    id: "nd",
    name: "Nota Dinas",
    title: "NOTA DINAS",
    footer: "Demikian disampaikan untuk menjadi maklum dan terima kasih.",
    sections: [
      { title: "", content: "Sehubungan dengan ..., bersama ini disampaikan bahwa ..." }
    ]
  },
  {
    id: "sk",
    name: "Surat Keterangan",
    title: "SURAT KETERANGAN",
    footer: "Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.",
    sections: [
      { title: "Identitas", content: "Nama: ...\nNIP: ...\nPangkat/Gol: ...\nJabatan: ..." },
      { title: "Maksud", content: "Menerangkan bahwa yang bersangkutan benar-benar ..." }
    ]
  },
  {
    id: "se",
    name: "Surat Edaran",
    title: "SURAT EDARAN",
    footer: "Demikian untuk menjadi perhatian dan dilaksanakan sebagaimana mestinya.",
    sections: [
      { title: "Tentang", content: "" },
      { title: "Latar Belakang", content: "" },
      { title: "Maksud dan Tujuan", content: "" },
      { title: "Isi Edaran", content: "" }
    ]
  },
  {
    id: "ba",
    name: "Berita Acara",
    title: "BERITA ACARA",
    footer: "Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.",
    sections: [
      { title: "Hari/Tanggal", content: "" },
      { title: "Pihak Pertama", content: "" },
      { title: "Pihak Kedua", content: "" },
      { title: "Isi Kesepakatan/Kejadian", content: "" }
    ]
  }
];

export const INITIAL_LETTER_STATE: LetterState = {
  title: "LAPORAN PERJALANAN DINAS",
  recipient: "Kepala Satuan Polisi Pamong Praja dan Pemadam Kebakaran Kabupaten Bangka Barat",
  sender: "Mustika Sari, SE",
  subject: "Laporan Perjalanan Dinas",
  sections: [
    { title: "I. Dasar", content: "" },
    { title: "II. Waktu dan Tempat", content: "" },
    { title: "III. Maksud dan Tujuan", content: "" },
    { title: "IV. Hasil yang diperoleh", content: "" }
  ],
  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  senderName: "Mustika Sari, SE",
  senderNip: "198406102010012032",
  approverName: "SETYAWAN, SP",
  approverNip: "19811126 200501 1005",
  approverTitle: "Plt. Kasat Pol PP dan Damkar",
  showLogo: true,
  logoSize: 80,
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/Lambang_Kabupaten_Bangka_Barat.png",
  orgName: "PEMERINTAH KABUPATEN BANGKA BARAT",
  deptName1: "SATUAN POLISI PAMONG PRAJA",
  deptName2: "DAN PEMADAM KEBAKARAN",
  addressLine1: "Kompleks Perkantoran Pemda Kab. Bangka Barat Dsn. Daya Baru Kec. Mentok",
  addressLine2: "Prov. Kep. Bangka Belitung 33315",
  letterNumber: "000 / ......... / SATPOL PP & PK / 2024",
  hal: "Laporan Perjalanan Dinas",
  lampiran: "-",
  tembusan: "",
  templateId: "lpd",
  footer: "Demikianlah laporan perjalanan dinas ini dibuat, untuk dipergunakan sebagaimana mestinya."
};
