// * Import necessary components
import pdfcore from "pdfkit";
import PDFLeftHeader from "./src/components/PDFLeftHeader.js";
import PDFCenterHeading from "./src/components/PDFCenterHeading.js";
import PDFTooling from "./src/components/PDFTooling.js";
import PDFTable from "./src/components/PDFTable.js";

const PDFKit = {
  doc: undefined,

  ...PDFLeftHeader,
  ...PDFCenterHeading,
  ...PDFTooling,
  ...PDFTable,

  /**
   * * create
   * * Function to create new PDFKit instance
   * @param {*} options
   * @returns {Instance(pdfkit)}
   */
  create: function (options) {
    this.doc = new pdfcore(options);
    return this.doc;
  },

  PDFSuratTugasRightHeader: function (doc, options, data) {
    let width = 250;
    const x = 350;
    doc.x = x;
    doc.y = doc.opt.margins.top;
    let y = doc.y;

    let pdfKitRow = {
      width: width,
      x: x,
      margins: {
        left: 70,
        top: 0,
      },
    };

    let PDFKitRowLeftColumn = {
      width: 20,
      align: "left",
      font_size: 10,
    };

    // Judul Lampiran Surat Perintah
    const header_top = "LAMPIRAN SURAT PERINTAH  DIR SAMAPTA";
    doc.fontSize(10).text(header_top, {
      width: width,
      align: "justify",
    });
    doc.underline(350, y + 3, 207, 8);

    // Nomor Surat Perintah
    PDFKit.PDFRow(doc, pdfKitRow, [
      {
        label: "NOMOR",
        ...PDFKitRowLeftColumn,
      },
      {
        label: ":",
        width: 5,
        align: "center",
        font_size: 10,
      },
      {
        label: data.nomor_sprint || "BELUM TERBIT",
        width: 75,
        align: "justify",
        font_size: 10,
      },
    ]);
    y = doc.y;
    doc.underline(350, 50, 207, 8);

    doc.y = doc.y - 8;
    PDFKit.PDFRow(doc, pdfKitRow, [
      {
        label: "TANGGAL",
        ...PDFKitRowLeftColumn,
      },
      {
        label: ":",
        width: 5,
        align: "center",
        font_size: 10,
      },
      {
        label: "      " + options.month.toUpperCase() + " " + options.year,
        width: 75,
        align: "justify",
        font_size: 10,
      },
    ]);
    doc.underline(350, y - 5, 207, 8);

    const header_mid = data.nomor_sprint;
    const header_mid_w = this.PDFToolWidthString(doc, header_top, 11);
    const header_bottom = options.month + " " + options.year;
    return doc;
  },

  PDFTable: (doc) => {
    const page_width = doc.page.width / 100;
    const table_dist = {
      headers: [
        {
          label: "Name",
          property: "name",
          width: page_width * 10,
          renderer: null,
        },
      ],
      datas: [
        {
          name: {
            label: "Testing Nested",
            options: { fontSize: 11 },
          },
        },
        {
          name: {
            label: "Testing Nested",
            options: { fontSize: 11 },
          },
        },
      ],
    };

    const table = {
      headers: [
        {
          label: "Name",
          property: "name",
          width: page_width * 10,
          renderer: null,
        },
        {
          label: "Description",
          property: "description",
          width: page_width * 20,
          renderer: null,
        },
        {
          label: "Price 1",
          property: "price1",
          width: page_width * 20,
          renderer: null,
        },
        { label: "Price 2", property: "price2", width: 100, renderer: null },
        {
          label: "Price 3",
          property: "price3",
          width: 50,
        },
        {
          label: "Price 4",
          property: "price4",
          width: 50,
          renderer: async (
            value,
            indexColumn,
            indexRow,
            row,
            rectRow,
            rectCell
          ) => {
            // const y = doc.y;
            // doc.y = y - 15;
            // doc.table(table_dist, {
            //   hideHeader: true,
            // });
            return "tes";
          },
        },
      ],
      datas: [
        {
          name: {
            label: "Display",
            options: { fontSize: 11 },
          },
          description: "This is data from me",
          price1: "$1",
          price3: "3",
          price2: "$2",
          price4: "4",
        },
        {
          name: {
            label: "Display",
            options: { fontSize: 11 },
          },
          description: "This is data from me",
          price1: "$1",
          price3: "3",
          price2: "$2",
          price4: "4",
        },
      ],
    };
    // the magic
    doc.table(table, {
      hideHeader: true,
      divider: {
        header: { disabled: true, width: 2, opacity: 0 },
        horizontal: { disabled: true, width: 1, opacity: 1 },
      },
      prepareHeader: () => doc.font("Times-Roman").fontSize(11),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Times-Roman").fontSize(11);
      },
    });

    return doc;
  },

  PDFSignatureAdvance: (doc, options = {}, label = {}) => {
    doc.x = options.x ? options.x : 0;
    doc.y = options.y ? options.y : 0;
    const x = doc.x;
    const y = doc.y;

    doc.text("Dikeluarkan di    : " + label.place);
    doc.text("Pada tanggal       :     " + label.month + " " + label.year);
    doc.underline(x, doc.y - 4, options.width || 200, 3);
    doc.text(label.department, {
      width: options.width || 200,
      align: "center",
    });
    doc.moveDown(4);
    doc.text(label.name, {
      width: options.width || 200,
      align: "center",
    });
    doc.underline(x, doc.y - 4, options.width || 200, 3);
    doc.text(label.rank, {
      width: options.width || 200,
      align: "center",
    });
  },

  /**
   *
   * @param doc
   * @param options
   * @param string_data
   */
  PDFRow: (doc, options, string_data) => {
    let x = options.margins.left;
    if (options.x) {
      x = options.x;
    }

    let y = doc.y + (options.margins.top || 0);
    const page_width = options.width;
    const breakpoint = doc.breakpoint;
    let instance = doc.font("Times-Roman");

    if (y >= breakpoint) {
      doc.addPage();
      doc.x = 0;
      doc.y = doc.opt.margins.top || 0;
      y = doc.y;
    }

    string_data.forEach((element) => {
      let p_width = (page_width * element.width) / 100;
      if (typeof element.label === "string") {
        let text_label = element.label;
        if (element.bold) {
          instance = instance.font("Times-Bold");
        }
        instance.fontSize(element.font_size).text(text_label, x, y, {
          width: p_width,
          align: element.align,
        });
      } else if (typeof element.label === "object") {
        doc.y = y;
        let reference_x = x;
        let local_x = x;
        let local_y = y;
        element.label.forEach((record) => {
          if (typeof record == "string") {
            instance.fontSize(11);
            instance.text(record, local_x, undefined, {
              width: p_width,
              align: element.align,
            });
            doc.y = doc.y + 5;
          } else if (typeof record == "object") {
            let height_string = 0;
            record.forEach((record_nested) => {
              //* Set font size and text
              instance.fontSize(record_nested.font_size || 11);
              instance.text(record_nested.label, local_x, local_y, {
                width: (p_width * record_nested.width) / 100,
                align: record_nested.align,
              });

              const h_string = instance.heightOfString(record_nested.label, {
                width: (p_width * record_nested.width) / 100,
                align: element.align,
              });
              if (h_string > height_string) {
                height_string = h_string;
              }
              local_x += (p_width * record_nested.width) / 100;
            });
            local_x = reference_x;
            local_y += height_string + 5;
          }
        });
      }
      x += (page_width * element.width) / 100;
    });
    doc.moveDown();
  },

  /** PDF Table Functionality */
};

export default PDFKit;
