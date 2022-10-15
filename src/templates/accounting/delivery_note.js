export default {
  labels: {
    delivery_note_title: "Surat Perjalanan",
    delivery_invoice_date: "Tanggal Invoice",
    delivery_invoice_number: "Nomor Invoice",
    delivery_invoice_for: "Invoice dibuat untuk : ",
  },

  documentTitle: "Surat Perjalanan",
  companyName: "ERP Alien",
  invoiceNumber: "ER-01099292290",
  invoiceDate: "2022-01-01",

  business: {
    name: "Alien Store",
    address: "Mars, Shandy Shore",
    phone_number: "+999111",
    email: "alienpdf@gmail.com",
  },

  client: {
    name: "Client Supplier",
    address: "Venus, Bikini Bottom",
    phone_number: "+1122321",
    email: "client_supplier@gmail.com",
  },

  tableHeader: [
    {
      label: "NO",
      key: "no",
      width: 10,
      align: "center",
    },
    {
      label: "KODE BARANG",
      key: "product_code",
      width: 30,
      align: "center",
    },
    {
      label: "NAMA BARANG",
      key: "product_name",
      width: 30,
      align: "center",
    },
    {
      label: "JUMLAH",
      key: "quantity",
      width: 15,
      align: "center",
    },
    {
      label: "KET",
      key: "description",
      width: 15,
      align: "center",
    },
  ],

  tableData: [
    {
      no: 1,
      product_code: "KD110",
      product_name: "Nama Barang 1",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 2,
      product_code: "KD111",
      product_name: "Nama Barang 2",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 3,
      product_code: "KD112",
      product_name: "Nama Barang 3",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 4,
      product_code: "KD113",
      product_name: "Nama Barang 4",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 5,
      product_code: "KD114",
      product_name: "Nama Barang 5",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 4,
      product_code: "KD113",
      product_name: "Nama Barang 4",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 5,
      product_code: "KD114",
      product_name: "Nama Barang 5",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 4,
      product_code: "KD113",
      product_name: "Nama Barang 4",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 5,
      product_code: "KD114",
      product_name: "Nama Barang 5",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 4,
      product_code: "KD113",
      product_name: "Nama Barang 4",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 5,
      product_code: "KD114",
      product_name: "Nama Barang 5",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 4,
      product_code: "KD113",
      product_name: "Nama Barang 4",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 5,
      product_code: "KD114",
      product_name: "Nama Barang 5",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 4,
      product_code: "KD113",
      product_name: "Nama Barang 4",
      quantity: 10,
      description: "Tidak ada",
    },
    {
      no: 5,
      product_code: "KD114",
      product_name: "Nama Barang 5",
      quantity: 10,
      description: "Tidak ada",
    },
  ],

  register: function (AlienPDF) {
    //* Create Doc Instance from AlienPDF
    const doc = AlienPDF.create({
      size: "A4",
      font: "Times-Roman",
      bufferPages: true,
      margins: {
        top: 35.43,
        right: 43.08,
        bottom: 15.3,
        left: 70,
      },
    });
    doc.breakpoint = 800;

    this.heading(doc, AlienPDF);
    this.headingClient(doc, AlienPDF);
    this.productTable(doc, AlienPDF);

    //* Return the instance
    return AlienPDF.endAndRead(doc);
  },

  heading: function (doc, AlienPDF) {
    /**
     * * Function to create heading for invoices
     */

    //* Create left heading
    const posY = doc.y;
    const labelLeft = `${this.labels.delivery_note_title}`;
    AlienPDF.Heading(doc, labelLeft, {
      font_size: 16,
      bold: true,
      width: 100,
      align: "left",
      pos_y: posY,
    });

    doc.y = doc.y + 1;
    let labelLeftDown = `${this.labels.delivery_invoice_number} : #${this.invoiceNumber}\n`;
    labelLeftDown += `${this.labels.delivery_invoice_date} : ${this.invoiceDate}\n`;
    AlienPDF.Heading(doc, labelLeftDown, {
      font_size: 11,
      width: 100,
      align: "left",
    });

    //* Create right heading
    doc.y = posY;
    AlienPDF.Heading(doc, `${this.business.name}`, {
      font_size: 14,
      bold: true,
      width: 100,
      align: "right",
      line_gap: 3,
    });

    doc.y = posY + 17;
    const labelRightDown = `${this.business.address}
      ${this.business.phone_number}
      ${this.business.email}`;
    AlienPDF.Heading(doc, labelRightDown, {
      font_size: 11,
      width: 100,
      align: "right",
    });

    //* Draw underline, under the heading
    const marginLeft = doc.options.margins.left;
    const marginRight = doc.options.margins.right;
    doc.y = doc.y + 10;
    doc.underline(
      marginLeft,
      doc.y,
      doc.page.width - (marginLeft + marginRight),
      3
    );
  },

  headingClient: function (doc, AlienPDF) {
    let label = `${this.labels.delivery_invoice_for}\n`;
    label += `${this.client.name}\n`;
    label += `${this.client.address}\n`;
    label += `${this.client.phone_number}\n`;
    label += `${this.client.email}`;
    doc.y = doc.y + 15;
    AlienPDF.Heading(doc, label, {
      font_size: 12,
      width: 100,
      align: "left",
      line_gap: 3,
    });
  },

  productTable: function (doc, AlienPDF) {
    let label = "Dengan hormat,\n";
    label += "Berikut terlampir daftar barang";
    AlienPDF.Heading(doc, label, {
      font_size: 11,
      width: 100,
      align: "left",
      line_gap: 3,
      margin: {
        top: 20,
      },
    });

    //* Create Table
    const marginLeft = doc.options.margins.left;
    const marginRight = doc.options.margins.right;
    const PDFTableOptions = {
      width: doc.page.width - marginLeft - marginRight,
      marginLeft: marginLeft,
      marginTop: 10,
      headerSpaceY: 15,
      headerFontSize: 10,
      rowSpaceY: 25,
    };

    AlienPDF.PDFTableKit(
      doc,
      PDFTableOptions,
      this.tableHeader,
      this.tableData || []
    );

    //* Return the doc
    return doc;
  },
};
