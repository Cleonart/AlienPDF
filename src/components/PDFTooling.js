/**
 * PDFTooling.ts
 * List of function used to be used as tool and utilites in PDFKit functions
 */

export default {
  /**
   ** addPage
   ** Function to add new page
   * @param doc : PDFKit Instance
   */
  addPage: function (doc) {
    doc.addPage();
    doc.current_page = doc.current_page + 1;
    return doc;
  },

  /**
   ** switchToPage
   ** Function to switch page using custom functions
   * @param doc : PDFKit Instance
   * @param page : Page number
   */
  switchToPage: function (doc, page) {
    doc.switchToPage(page);
    doc.current_page = page;
    return doc;
  },

  /**
   ** PDFToolHeightString
   ** Function to be used when we want to know the height
   ** of the string in the PDF doc
   * @param doc : PDFKit Instance
   * @param string : Text
   * @param font_size : Font Sizes
   * @returns [Number]
   */
  PDFToolHeightString: function (doc, string, width, font_size = 11) {
    //* Config the text according to options
    doc.fontSize(font_size);
    let height = doc.heightOfString(string, {
      width: width,
    });

    return height;
  },

  /**
   ** PDFToolWidthString
   ** Function to be used when we want to know the width
   ** of the string in the PDF doc
   * @param doc : PDFKit Instance
   * @param string : Text
   * @param font_size : Font Sizes
   * @returns [Number]
   */
  PDFToolWidthString: function (doc, string, font_size = 11) {
    return doc.fontSize(font_size).widthOfString(string);
  },

  /**
   ** toolHeightString
   ** Function to be used when we want to know the height
   ** of the string in the PDF doc, but with 5 point correction
   * @param doc : PDFKit Instance
   * @param string : Text
   * @param font_size : Font Sizes
   * @returns [Number]
   */
  toolHeightString: function (doc, string, width, font_size = 11) {
    //* Config the text according to options
    doc.fontSize(font_size);
    let height = doc.heightOfString(string, {
      width: width,
    });
    return height - 5;
  },
};
