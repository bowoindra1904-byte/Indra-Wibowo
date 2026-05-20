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
  lineSpacing: number;
  place: string;
  fontFamily: string;
  fontSize: number;
  lpdType?: 'tunggal' | 'kolektif';
  lpdMembers?: { name: string; nip: string; }[];
}

export const LETTER_TEMPLATES = [
  {
    id: "lpd_tunggal",
    name: "LPD (Tunggal)",
    title: "LAPORAN HASIL PERJALANAN DINAS",
    footer: "Demikian Laporan Hasil Perjalanan Dinas ini disampaikan, terimakasih.",
    sections: [
      { title: "I. DASAR PELAKSANAAN TUGAS", content: "Surat Tugas Plt. Kepala Satuan Polisi Pamong Praja Dan Pemadam Kebakaran Nomor : 800.1.11.1/4/ST/SATPOLPPPK/2026 tanggal 21 Januari 2026 untuk Koordinasi Terkait Implementasi Produk Hukum Daerah Dengan Berlakunya KUHP Nomor 1 Tahun 2023 Ke Satuan Polisi Pamong Praja Kabupaten Bangka Di Sungailiat." },
      { title: "II. MAKSUD DAN TUJUAN", content: "Koordinasi tersebut dilakukan untuk mengetahui sejauh mana Satuan Polisi Pamong Praja Kabupaten Bangka melakukan langkah-langkah strategi apa saja sejak diberlakukannya KUHP Nomor 1 Tahun 2023." },
      { title: "III. SASARAN", content: "Dalam rangka menyamakan persepsi dan implementasi sejak diberlakukannya KUHP Nomor 1 Tahun 2023 guna sebagai referensi dan acuan untuk meningkatkan kualitas dan penegakan hukum oleh Polisi Pamong Praja dan Pemadam Kebakaran Kabupaten Bangka Barat." },
      { title: "IV. PEMBAHASAN", content: "Dari perjalanan dinas ini dapat dilaporkan hal-hal sebagai berikut:\n1. Bahwa pada kesempatan tersebut, diterima oleh Kasubbag. Perencanaan dan Pelaporan Sdr. Dolly Seprianto, S.IP., M.M. Sdr. Dolly Seprianto, S.IP., M.M menyampaikan permohonan maaf bila pimpinan/Pejabat di Pol PP Kabupaten Bangka sedang melakukan Dinas ke luar Kota;\n2. Dan selanjutnya kami menyampaikan maksud dan tujuan berkoordinasi terkait sejauh mana Satuan Polisi Pamong Praja Kabupaten Bangka melakukan langkah-langkah srategi apa saja sejak diberlakukannya KUHP Nomor 1 Tahun 2023;\n3. Bahwa Kasubbag. Perencanaan dan Pelaporan Sdr. Dolly Seprianto, S.IP., M.M menjelaskan, saat ini sedang melakukan inventarisasi seluruh Produk hukum yang tidak sesuai dan bertentangan serta menyesuaikan dengan perubahan-perubahan yang ada dalam KUHP terbaru;\n4. Bahwa saat ini juga Satuan Polisi Pamong Praja Kabupaten Bangka meningkatkan koordinasi dengan instansi Pusat dalam hal ini Kementerian Dalam Negeri Republik Indonesia dikarenakan Kemendagri memiliki peran sebagai pembina Satpol PP dalam hal Pembinaan, Pengembangan Kapasitas, dan koordinasi dengan instansi lainnya." },
      { title: "V. KESIMPULAN DAN SARAN", content: "1. Satuan Polisi Pamong Praja Dan Pemadam Kebakaran Bangka Barat perlu segera meningkatkan koordinasi guna memastikan bahwa implementasi KUHP terbaru berjalan efektif dan efisien.\n2. Satuan Polisi Pamong Praja Dan Pemadam Kebakaran Bangka Barat perlu mengkaji Peraturan Turunan (Peraturan Pemerintah dan Peraturan Menteri) dan mengupdate pengetahuan dan keterampilan dalam hal memahami perubahan-perubahan yang ada dalam KUHP terbaru untuk bagaimana implementasinya dalam tugas sehari-hari." },
      { title: "VI. PENUTUP", content: "" }
    ]
  },
  {
    id: "lpd_kolektif",
    name: "LPD (Kolektif / Tim)",
    title: "LAPORAN PERJALANAN DINAS",
    footer: "Demikian laporan kegiatan pengamanan Operasi Pasar Murah di Kecamatan Tempilang ini disusun sebagai bentuk pertanggungjawaban pelaksanaan tugas Satuan Polisi Pamong Praja. Diharapkan kegiatan serupa ke depannya dapat terus berjalan dengan aman, tertib, dan memberikan manfaat nyata bagi masyarakat.",
    sections: [
      { title: "I. DASAR", content: "• Surat tugas Kepala SATPOL PP dan Pemadam Kebakaran Kabupaten Bangka Barat Nomor : 800.1.11.1/ 145 /ST /SATPOLPPPK/2026. Tanggal 03 Februari 2026\n• Kegiatan Pencegahan Gangguan Ketentraman dan Ketertiban Umum Melalui Deteksi Dini dan Cegah Dini, Pembinaan dan Penyuluhan, Pelaksanaan Patroli, Pengamanan. Dan pengawalan berdasarkan Peraturan Daerah Kabupaten Bangka Barat Nomor 05 Tahun 2020 atas Perubahan tentang Ketertiban Umum yaitu Kegiatan BKO Pengamanan Operasi Pasar Murah yang digelar oleh Pemerintah Kabupaten Bangka Barat melalui Dinas Koperasi, UKM dan Perdagangan Kab. Bangka Barat di wilayah Kecamatan Tempilang." },
      { title: "II. WAKTU DAN TEMPAT", content: "• 06:30 WIB s/d Selesai di Lapangan Gedung Serbaguna Kecamatan Tempilang" },
      { title: "III. MAKSUD DAN TUJUAN", content: "• Untuk menjaga terlaksana dan berjalannya Peraturan Daerah Kabupaten Bangka Barat.\n• Terciptanya dan terjaganya ketentraman dan ketertiban selama kegiatan ini berlangsung\n• Mengantisipasi terjadinya gangguan ketertiban, seperti antrean tidak tertib, kerumunan berlebihan, dan potensi konflik antar masyarakat.\n• Mendukung kelancaran distribusi bahan kebutuhan pokok kepada masyarakat.\n• Memberikan rasa aman dan nyaman bagi masyarakat serta panitia penyelenggara." },
      { title: "IV. HASIL YANG DIPEROLEH", content: "Pada hari ini Tanggal 03 Februari 2026 Tim Satpol PP PP Satpol PP Kabupaten Bangka Barat Melaksanakan pengamanan kegiatan Operasi Pasar Murah yang digelar oleh Pemerintah Kabupaten Bangka Barat melalui Dinas Koperasi, UKM dan Perdagangan Kab. Bangka Barat di wilayah Kecamatan Tempilang. Kegiatan pengamanan dilaksanakan oleh personel Satuan Polisi Pamong Praja, yang dipimpin secara langsung oleh Kabid dan Kasi Trantibum yang dilakukan oleh Satpol PP antara lain:\n1. Melakukan pengamanan di sekitar lokasi kegiatan Operasi Pasar Murah.\n2. Mengatur ketertiban antrian masyarakat agar tetap tertib dan teratur.\n3. Mengimbau masyarakat untuk mematuhi aturan dan arahan panitia.\n4. Mengantisipasi potensi kericuhan atau gangguan ketertiban selama kegiatan berlangsung.\n5. Berkoordinasi dengan pihak kecamatan, panitia penyelenggara, dan instansi terkait guna memastikan kegiatan berjalan lancar.\n\nSecara umum, kegiatan Operasi Pasar Murah di Kecamatan Tempilang berjalan dengan aman, tertib, dan lancar. Kehadiran personel Satpol PP mampu menciptakan situasi kondusif, sehingga masyarakat dapat memperoleh kebutuhan pokok dengan tertib dan nyaman tanpa adanya gangguan ketertiban yang berarti." }
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
  title: "LAPORAN HASIL PERJALANAN DINAS",
  recipient: "Plt. Kepala Satuan Polisi Pamong Praja Dan Pemadam Kebakaran",
  sender: "Sekretaris Dinas Satuan Polisi Pamong Praja Dan Pemadam Kebakaran",
  subject: "Laporan Perjalanan Dinas",
  sections: [
    { title: "I. DASAR PELAKSANAAN TUGAS", content: "Surat Tugas Plt. Kepala Satuan Polisi Pamong Praja Dan Pemadam Kebakaran Nomor : 800.1.11.1/4/ST/SATPOLPPPK/2026 tanggal 21 Januari 2026 untuk Koordinasi Terkait Implementasi Produk Hukum Daerah Dengan Berlakunya KUHP Nomor 1 Tahun 2023 Ke Satuan Polisi Pamong Praja Kabupaten Bangka Di Sungailiat." },
    { title: "II. MAKSUD DAN TUJUAN", content: "Koordinasi tersebut dilakukan untuk mengetahui sejauh mana Satuan Polisi Pamong Praja Kabupaten Bangka melakukan langkah-langkah strategi apa saja sejak diberlakukannya KUHP Nomor 1 Tahun 2023." },
    { title: "III. SASARAN", content: "Dalam rangka menyamakan persepsi dan implementasi sejak diberlakukannya KUHP Nomor 1 Tahun 2023 guna sebagai referensi dan acuan untuk meningkatkan kualitas dan penegakan hukum oleh Polisi Pamong Praja dan Pemadam Kebakaran Kabupaten Bangka Barat." },
    { title: "IV. PEMBAHASAN", content: "Dari perjalanan dinas ini dapat dilaporkan hal-hal sebagai berikut:\n1. Bahwa pada kesempatan tersebut, diterima oleh Kasubbag. Perencanaan dan Pelaporan Sdr. Dolly Seprianto, S.IP., M.M. Sdr. Dolly Seprianto, S.IP., M.M menyampaikan permohonan maaf bila pimpinan/Pejabat di Pol PP Kabupaten Bangka sedang melakukan Dinas ke luar Kota;\n2. Dan selanjutnya kami menyampaikan maksud dan tujuan berkoordinasi terkait sejauh mana Satuan Polisi Pamong Praja Kabupaten Bangka melakukan langkah-langkah srategi apa saja sejak diberlakukannya KUHP Nomor 1 Tahun 2023;\n3. Bahwa Kasubbag. Perencanaan dan Pelaporan Sdr. Dolly Seprianto, S.IP., M.M menjelaskan, saat ini sedang melakukan inventarisasi seluruh Produk hukum yang tidak sesuai dan bertentangan serta menyesuaikan dengan perubahan-perubahan yang ada dalam KUHP terbaru;\n4. Bahwa saat ini juga Satuan Polisi Pamong Praja Kabupaten Bangka meningkatkan koordinasi dengan instansi Pusat dalam hal ini Kementerian Dalam Negeri Republik Indonesia dikarenakan Kemendagri memiliki peran sebagai pembina Satpol PP dalam hal Pembinaan, Pengembangan Kapasitas, dan koordinasi dengan instansi lainnya." },
    { title: "V. KESIMPULAN DAN SARAN", content: "1. Satuan Polisi Pamong Praja Dan Pemadam Kebakaran Bangka Barat perlu segera meningkatkan koordinasi guna memastikan bahwa implementasi KUHP terbaru berjalan efektif dan efisien.\n2. Satuan Polisi Pamong Praja Dan Pemadam Kebakaran Bangka Barat perlu mengkaji Peraturan Turunan (Peraturan Pemerintah dan Peraturan Menteri) dan mengupdate pengetahuan dan keterampilan dalam hal memahami perubahan-perubahan yang ada dalam KUHP terbaru untuk bagaimana implementasinya dalam tugas sehari-hari." },
    { title: "VI. PENUTUP", content: "Demikian Laporan Hasil Perjalanan Dinas ini disampaikan, terimakasih." }
  ],
  date: "22 Januari 2026",
  senderName: "Indra Saputra, S.H., M.H",
  senderNip: "19840610 201001 2 032",
  approverName: "Setyawan, SP",
  approverNip: "19811126 200501 1005",
  approverTitle: "Plt. Kepala",
  showLogo: true,
  logoSize: 80,
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/Lambang_Kabupaten_Bangka_Barat.png",
  orgName: "PEMERINTAH KABUPATEN BANGKA BARAT",
  deptName1: "SATUAN POLISI PAMONG PRAJA",
  deptName2: "DAN PEMADAM KEBAKARAN",
  addressLine1: "Kompleks Perkantoran Pemerintah Daerah Kab. Bangka Barat Pal 4 Mentok, Kode Pos 33351",
  addressLine2: "Telepon (0715) 351110, Surat Elektronik: satpolpppk@bangkabaratkab.go.id",
  letterNumber: "800.1.11.1 / 4 / ST / SATPOLPPPK / 2026",
  hal: "Laporan Perjalanan Dinas.",
  lampiran: "1 (satu) berkas",
  tembusan: "",
  templateId: "lpd_tunggal",
  footer: "",
  lineSpacing: 1.15,
  place: "Mentok",
  fontFamily: "Times New Roman",
  fontSize: 12,
  lpdType: "tunggal",
  lpdMembers: [
    { name: "Isfani, S.I.P", nip: "19700504 200903 1 001" },
    { name: "Ardian, S.E", nip: "19780812 201001 1 015" },
    { name: "Tamrin", nip: "19760326 200604 1 008" },
    { name: "Samhudi Ishak", nip: "19800103 200701 1 003" },
    { name: "Fauzi Mukti", nip: "19831017 200701 1 003" },
    { name: "Ridho. B. P", nip: "19910807 202012 1 005" },
    { name: "Kamidi", nip: "NIPPPKPW.198503142025211062" },
    { name: "Dodhy. S", nip: "NIPPPKPW.197811042025211034" }
  ]
};
