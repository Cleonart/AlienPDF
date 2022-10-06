export default {
  /**
   ** PDFCenterHeading
   ** Function to create title with center alignment
   ** and underline on bottom
   * @param doc : PDFKit Instance
   * @param title : Text
   * @param options : Object of options
   * @returns [Number]
   */
  PDFCenterHeading: (doc, title, options = {}) => {
    const page_width = doc.page.width;
    const margin_left = 0;
    const width = (options.width ? options.width : 100) / 100;
    const font_weight = options.bold ? "Times-Bold" : "Times-Roman";
    const font_size = options.font_size ? options.font_size : 11;
    const margin_top = options.margin ? options.margin.top : 5;
    const settings = {
      align: "center",
      width: page_width * width,
    };
    let x = doc.x;
    let y = doc.y;

    // Check for PDF styling
    x = options.pos_x ? options.pos_x : 0;
    y = options.pos_y ? options.pos_y : y;

    doc.font(font_weight);
    doc.fontSize(font_size);
    doc.text(title, x + margin_left, y + margin_top, settings);

    // Iterate over the text
    // and check which text line is longer width
    let selected_text = "";
    const get_text = title.split("\n");
    get_text.forEach((record) => {
      if (selected_text.length < record.length) {
        selected_text = record;
      }
    });

    // The width of text then being used to make the underline
    // if the options.underline is set to true
    const width_of_string = doc.widthOfString(selected_text);
    const center_string = width_of_string / 2;
    const half_of_page = page_width / 2;
    const start_point = half_of_page - center_string;
    const posY = doc.y;
    if (options.underline) {
      doc.underline(start_point, posY, width_of_string, 3);
    }
  },
};
