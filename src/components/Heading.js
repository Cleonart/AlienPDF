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
  Heading: (doc, title, options = {}) => {
    //* Page settings
    const pageMarginLeft = doc.options.margins.left;
    const pageMarginRight = doc.options.margins.right;
    const pageWidth = doc.page.width - pageMarginLeft - pageMarginRight;
    const halfOfPage = pageMarginLeft + pageWidth / 2;
    const widthPercent = (options.width ? options.width : 100) / 100;
    const width = pageWidth * widthPercent;
    const halfOfWidth = pageMarginLeft + width / 2;

    const lineGap = options.line_gap ? options.line_gap : undefined;
    const fontWeight = options.bold ? "Times-Bold" : "Times-Roman";
    const fontSize = options.font_size ? options.font_size : 11;
    const marginTop = options.margin ? options.margin.top : 5;
    const alignment = options.align ? options.align : "center";
    const settings = {
      align: alignment,
      width: width,
      lineGap: lineGap,
    };
    let x = doc.x;
    let y = doc.y;

    // Check for PDF styling
    x = options.pos_x ? options.pos_x : pageMarginLeft;
    y = options.pos_y ? options.pos_y : y;

    doc.font(fontWeight);
    doc.fontSize(fontSize);
    doc.text(title, x, y + marginTop, settings);

    // Iterate over the text
    // and check which text line is longer width
    let longestString = "";
    const textRecord = title.split("\n");
    textRecord.forEach((record) => {
      if (longestString.length < record.length) {
        longestString = record;
      }
    });

    // The width of text then being used to make the underline
    // if the options.underline is set to true
    const widthOfLongestString = doc.widthOfString(longestString);
    const centerString = widthOfLongestString / 2;
    const posY = doc.y;
    if (options.underline) {
      let startPositionOfX = halfOfWidth - centerString;

      //* Reconfigure the [x] position if the alignment is set to left
      if (alignment == "left") {
        startPositionOfX = pageMarginLeft;
      }

      //* Reconfigure the [x] position if the alignment is set to right
      else if (alignment == "right") {
        startPositionOfX = x + width - widthOfLongestString;
      }

      //* Draw the underline
      doc.underline(startPositionOfX, posY, widthOfLongestString, 3);
    }
  },
};
