export default {
  PDFLeftHeader: (doc) => {
    let header = "KEPOLISISAN NEGARA REPUBLIK INDONESIA\n";
    header += "DAERAH SULAWESI UTARA\n";
    header += "DIREKTORAT SAMAPTA";
    const headerSetting = {
      width: 239,
      align: "center",
    };
    doc.fontSize(11);
    doc.text(header, headerSetting);
    doc.underline(72, 65, 239, 8);
    return doc;
  },
};
