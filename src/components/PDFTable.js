import tool from "./PDFTooling";

/**
 * * 1 Character in PDFKit is count as 5 in width and height
 * * 1 Character in PDFKit is count as 5 in width and height
 */

export default {
  //**---------------- */
  //** Util Functions  */
  //**---------------- */

  /**
   ** drawCalculateVertical
   ** Function to calculate the vertical position of alignment
   * @param param0
   * @returns
   */
  drawCalculateVertical: function ({ verticalAlign, y, heightBox, heightStr }) {
    let verticalY = y;
    if (verticalAlign == "top") {
      verticalY = y;
    } else if (verticalAlign == "center") {
      verticalY = y + heightBox / 2 - heightStr / 2;
    } else if (verticalAlign == "bottom") {
      verticalY = 0;
    }
    return verticalY;
  },

  /**
   ** drawCalculateHorizontal
   ** Function to calculate the horizontal position of alignment
   * @returns
   */
  drawCalculateHorizontal: function ({ align, x, width, spaceX = 0 }) {
    let horizontalX = x;
    let horizontalWidth = width;
    let oneSizeSpace = spaceX / 2;

    //* Check for alignment position on align = left
    if (align == "left") {
      horizontalX += oneSizeSpace;
      horizontalWidth -= spaceX;
    }

    //* Check for alignment position on align = center
    else if (align == "center") {
      horizontalX += oneSizeSpace;
      horizontalWidth -= spaceX;
    }

    //* Check for alignment position on align = right
    else if (align == "right") {
      horizontalWidth -= spaceX;
    }

    //* Return as tuple model
    return [horizontalX, horizontalWidth];
  },

  drawTextbox: function (doc, text, options) {
    //* Get default positon of element now
    //* if no position is provided, it will use
    //* default position
    let x = options.x;
    let y = options.y;
    const spaceX = options.spaceX || 0;
    const oneSideSpaceX = spaceX / 2;
    const spaceY = options.spaceY || 0;
    const align = options.align || "left";

    //* Check for width, the minimum width allowed is 5
    //* if the width is below 5, force it to be 5
    let width = options.width ? options.width : 5;
    if (width < 5) {
      width = 5;
    }

    //* Check for height, the minimum height allowed is 5
    //* if the height is below 5, force it to be 5
    let height = options.height ? options.height : 5;
    const widthOfText = tool.PDFToolWidthString(doc, text, width);
    if (height < 5) {
      height = 5;
    }

    //* Text configuration and options
    const heightWidth = width - spaceX;
    const heightOfText = tool.toolHeightString(doc, text, heightWidth);
    const isHeightTextMoreThanBox = heightOfText > height;

    //* Do a check, if the height of text is more than box, adjust the boxt
    //* to match the height of text
    let heightOfBox = height;
    if (isHeightTextMoreThanBox) {
      heightOfBox = isHeightTextMoreThanBox ? heightOfText : height;
    } else if (!isHeightTextMoreThanBox) {
      heightOfBox = height;
    }

    //* Text configuration draw and options
    //* Check for vertical alignment
    //* Vertical alignment can be used if the heightOfText < height
    let textX = x;
    let textY = y;
    let textWidth = width;
    const verticalAlign = options.vertical_align || "center";
    if (!isHeightTextMoreThanBox) {
      textY = this.drawCalculateVertical({
        verticalAlign: verticalAlign,
        y: y,
        heightBox: heightOfBox,
        heightStr: heightOfText,
      });
    }

    //* Calculate Horizontal Alignment Values
    [textX, textWidth] = this.drawCalculateHorizontal({
      align: align,
      x: textX,
      width: width,
      spaceX: options.spaceX || 0,
    });

    doc.text(text, textX, textY, {
      width: textWidth,
      align: align,
    });

    //* Draw the box
    doc.rect(x, y, width, heightOfBox);
    doc.strokeColor("#363636").stroke();
  },

  /**
   ** remapDataKey
   ** Function to matching the key from header to
   ** table data seeder
   */
  remapDataKey: function (doc, tableOptions, header) {
    const tableWidth = tableOptions.width;

    //* Remap the data for key
    let posX = tableOptions.marginLeft;
    const keyList = [];

    header.forEach((record) => {
      const parentWidth = (tableWidth * record.width) / 100;
      if (record.type == "multi") {
        const childs = record.child;
        childs.forEach((line) => {
          const chdWidth = (parentWidth * line.width) / 100;
          keyList.push({
            posX: posX,
            key: line.key,
            width: chdWidth,
          });
          posX += chdWidth;
        });
      } else {
        keyList.push({
          key: record.key,
          width: parentWidth,
          posX: posX,
        });
        posX += parentWidth;
      }
    });

    //* Finally, return the key values
    return keyList;
  },

  /**
   ** calcOverflowY
   ** Function to calculate the overflowing of y
   * @param doc
   * @param options
   * @param header
   */
  calcOverflowY: function (doc, options, dataRows = []) {
    const output = [];
    const breakpoint = doc.page.height - doc.opt.margins.bottom;
    let posY = options.y || doc.opt.margins.top;
    let page = options.current_page || 0;
    dataRows.forEach((record) => {
      let code = record.code;
      let data = record.data || [];
      let height = record.height;
      let startPosY = posY;
      let endPosY = startPosY + height;

      //* Check if endPosY is less than equal of breakpoint
      if (endPosY <= breakpoint) {
        output.push({
          code: code,
          data: data,
          page: page,
          start_y: startPosY,
          end_y: endPosY,
          height: endPosY - startPosY,
        });
        posY = endPosY;
      }

      //* Calculate the difference
      else {
        let remainingY = endPosY;
        endPosY = posY;
        while (remainingY >= breakpoint) {
          let height = breakpoint - posY;
          if (height > 0) {
            output.push({
              code: code,
              page: page,
              data: data,
              start_y: posY,
              end_y: breakpoint,
              height: height,
            });
          }
          posY = doc.opt.margins.top;
          page += 1;
          remainingY -= breakpoint;
        }
        if (remainingY > 0) {
          output.push({
            code: code,
            page: page,
            data: data,
            start_y: posY,
            end_y: remainingY,
            height: remainingY - posY,
          });
        }
        posY = remainingY;
      }
    });
    return output;
  },

  //**---------------- */
  //** Main Functions  */
  //**---------------- */

  PDFTableHeader: function (doc, options, header) {
    //* Page and Layout Settings
    const page_width = options.width || 500;
    const marginTop = options.marginTop ? options.marginTop : 10;
    const headerSpaceY = options.headerSpaceY || 5;
    const headerSpaceX = options.headerSpaceX || 5;

    //* Setting Up Positions
    let maxHeight = 0;
    const startX = options.marginLeft;
    const startY = doc.y + marginTop;
    let pos_x = startX;
    let pos_y = startY;

    //* Variable that contain the
    const textboxList = [];

    //* Build the data to be the header
    header.forEach((head) => {
      //* Version 2.0
      const type = head.type || "single";
      const widthInPercent = head.width / 100;
      const textWidth = page_width * widthInPercent;
      const strWidthPercent = head.width / 100;
      const strWidth = page_width * strWidthPercent;
      const label = head.label;
      const fontSize = head.font_size || 11;
      let heightString = tool.toolHeightString(doc, label, strWidth, fontSize);
      let verticalAlign = head.vertical_align ? head.vertical_align : "center";

      //* Header without child header
      if (type == "single") {
        textboxList.push({
          x: pos_x,
          y: pos_y,
          type: type,
          width: strWidth,
          text: label,
          vertical_align: verticalAlign,
        });
      }

      //* Header with child header
      else if (type == "multi") {
        textboxList.push({
          x: pos_x,
          y: pos_y,
          type: "parent",
          width: strWidth,
          text: label,
          vertical_align: verticalAlign,
        });

        const parent = head.child;
        const parentWidth = strWidth;
        let temporaryX = pos_x;
        let childMaxHeightString = 0;

        parent.forEach((line) => {
          const chdLabel = line.label;
          const chdWidth = (parentWidth / 100) * line.width;
          const chdHeightStr = tool.toolHeightString(doc, chdLabel, chdWidth);
          if (chdHeightStr > childMaxHeightString) {
            childMaxHeightString = chdHeightStr;
          }

          //* Add to textbox as child type
          textboxList.push({
            x: temporaryX,
            y: pos_y,
            type: "child",
            width: chdWidth,
            text: line.label,
            vertical_align: verticalAlign,
          });
          temporaryX += chdWidth;
        });

        //* Because the header have childs
        //* we need to add the parent text height
        //* with the child text height to get maximum
        //* height of string that will be used in textboxt
        heightString += childMaxHeightString;
        pos_x = temporaryX;
      }

      maxHeight = heightString > maxHeight ? heightString : maxHeight;
      pos_x += textWidth;
    });

    maxHeight += headerSpaceY;
    textboxList.forEach((record) => {
      const localX = record.x;
      const localWidth = record.width;
      const halfMaxHeight = maxHeight / 2;

      //* Draw textbox for type single
      if (record.type == "single") {
        this.drawTextbox(doc, record.text, {
          x: localX,
          y: startY,
          width: localWidth,
          height: maxHeight,
          align: "center",
          vertical_align: "center",
          spaceX: 5,
        });
      }

      //* Draw textbox for type parent
      else if (record.type == "parent") {
        this.drawTextbox(doc, record.text, {
          x: localX,
          y: startY,
          width: localWidth,
          height: halfMaxHeight,
          align: "center",
          vertical_align: "center",
          spaceX: 5,
        });
      }

      //* Draw textbox for type child
      else if (record.type == "child") {
        this.drawTextbox(doc, record.text, {
          x: localX,
          y: halfMaxHeight + startY,
          width: localWidth,
          height: halfMaxHeight,
          align: "center",
          vertical_align: "center",
          spaceX: 5,
        });
      }
    });

    //** Reset all the style */
    doc.font("Times-Roman");
    doc.y = startY + maxHeight;
  },

  PDFTableData: function (doc, options, header, data) {
    const tableWidth = options.width || doc.page.width;
    const marginLeft = options.marginLeft;

    //* Remap the data for key
    const keyList = this.remapDataKey(doc, options, header);
    const referenceY = doc.y;

    //* Register data row on table
    doc.x = marginLeft;
    const dataRows = [];
    let maxTableRowHeight = 0;
    doc.opt.margins.bottom = doc.page.height - doc.breakpoint;
  },

  PDFTableKit: function (doc, options, header, data) {
    const tableWidth = options.width || doc.page.width;
    const marginLeft = options.marginLeft;

    //* Build up the header
    this.PDFTableHeader(doc, options, header);

    //* Remap the data for key
    const keyList = this.remapDataKey(doc, options, header);
    const referenceY = doc.y;

    //* Register data row on table
    doc.x = marginLeft;
    doc.opt.margins.bottom = doc.page.height - doc.breakpoint;
    const dataRows = [];
    let maxTableRowHeight = 0;

    data.forEach((record, record_index) => {
      let pos_x = marginLeft;
      let pos_y = doc.y;
      const dataRowCols = [];
      let longestText = undefined;
      let longestTextPosX = undefined;
      let longestTextWidth = undefined;
      let longestAlignment = undefined;
      let ignoreLongest = undefined;
      keyList.forEach((col) => {
        let dataRecord = record[col.key];
        let dataValue = record[col.key] || "";
        if (dataValue) {
          dataValue = "\n " + dataValue + "\n ";
        }

        let dataAlign = "left";
        let dataSpaceX = 0;

        //* Check if record is an object type
        //* if its an object type, we need to extract
        //* the values from the object first
        if (typeof dataRecord == "object") {
          dataValue = " \n" + dataRecord.value + "\n " || "";
          dataAlign = dataRecord.align || "left";
          dataSpaceX = dataRecord.marginLeft || 0;
        }

        //* Distinct the max height value
        const heighStr = this.toolHeightString(doc, dataValue, col.width, 11);
        if (heighStr > maxTableRowHeight) {
          maxTableRowHeight = heighStr;
          longestText = dataValue;
          longestTextPosX = pos_x;
          longestAlignment = dataAlign;
          longestTextWidth = col.width;
          ignoreLongest = col.key;
        }

        dataRowCols.push({
          key: col.key,
          spaceX: dataSpaceX,
          value: dataValue,
          pos_x: pos_x,
          pos_y: pos_y,
          align: dataAlign,
          width: col.width,
          height: heighStr,
        });
        pos_x += col.width;
      });

      dataRows.push({
        options: {
          maxTableRowHeight: maxTableRowHeight,
          longestText: longestText,
          longestTextPosX: longestTextPosX,
          longestTextWidth: longestTextWidth,
          longestAlignment: longestAlignment,
          ignoreLongest: ignoreLongest,
        },
        data: dataRowCols,
      });
      maxTableRowHeight = 0;
    });

    const startPage = doc.current_page;
    doc.switchToPage(startPage);
    doc.y = referenceY;
    let pageNow = startPage;
    let beforeTextPos = 0;
    let afterTextPos = 0;
    let pageBefore = pageNow;

    //* Utilites Variable
    doc.on("pageAdded", () => {
      pageNow += 1;
    });

    const finalOutput = [];
    dataRows.forEach((record_row, index_row) => {
      //* Set the position
      beforeTextPos = doc.y;
      pageBefore = pageNow;

      //* Write the text
      doc.x = record_row.options.longestTextPosX;
      doc.text(record_row.options.longestText, {
        width: record_row.options.longestTextWidth,
        align: record_row.options.longestAlignment || "left",
      });

      const pageAfter = pageNow;
      if (pageAfter == pageBefore) {
        afterTextPos = doc.y;
        const height = afterTextPos - beforeTextPos;
        const width = record_row.options.longestTextWidth;
        const posX = record_row.options.longestTextPosX;
        const posY = beforeTextPos;
        doc.rect(posX, posY, width, height).stroke();
        finalOutput.push({
          record_index: index_row,
          page: pageNow,
          posY: beforeTextPos,
          height: height,
          key: record_row.options.ignoreLongest,
        });
      } else {
        const temporaryFinalOutput = [];
        const referenceUpY = doc.y;
        afterTextPos = doc.y;
        let beforeYPos = beforeTextPos;
        let tempPageNow = pageNow;
        let tempPageBefore = pageBefore;
        while (tempPageNow >= tempPageBefore) {
          doc.switchToPage(tempPageNow);
          //* When its final page, use the final page
          if (tempPageNow == tempPageBefore) {
            doc.switchToPage(tempPageNow);
            beforeTextPos = beforeYPos;
            afterTextPos = doc.page.height - doc.opt.margins.bottom;
          }

          //* Propagate back from newest page
          else {
            beforeTextPos = doc.opt.margins.top;
          }

          //* Draw the rectangle
          const width = record_row.options.longestTextWidth;
          const height = afterTextPos - beforeTextPos;
          const rowPosX = record_row.options.longestTextPosX;
          doc.rect(rowPosX, beforeTextPos, width, height).stroke();

          temporaryFinalOutput.push({
            record_index: index_row,
            key: record_row.options.ignoreLongest,
            page: tempPageNow,
            posY: beforeTextPos,
            height: height,
          });

          //* Remove the page
          tempPageNow--;
        }

        //* Navigate and reset to last state
        doc.switchToPage(pageNow);
        doc.y = referenceUpY;

        const ascendingOutput = [];
        const lenOfDescendingOutput = temporaryFinalOutput.length;
        for (let i = lenOfDescendingOutput - 1; i >= 0; i--) {
          ascendingOutput.push(temporaryFinalOutput[i]);
        }
        finalOutput.push(...ascendingOutput);
      }
    });

    //* Draw the textboxt
    let previousRecord = undefined;
    finalOutput.forEach((row) => {
      const recordIndex = row.record_index;
      const page = row.page;
      const height = row.height;
      const posY = row.posY;
      const ignoredKey = row.key;
      doc.switchToPage(page);

      //* Draw rectangle for the rest of pages
      keyList.forEach((col) => {
        if (col.key != ignoredKey) {
          doc.rect(col.posX, posY, col.width, height).stroke();
        }
      });

      //* Write the text at the end
      const record = dataRows[recordIndex] || {};
      const recordData = record.data;
      recordData.forEach((col_record) => {
        const ignoreLongest = record.options.ignoreLongest;
        const isSameAsPreviousRecord = previousRecord == recordIndex;
        const isLongestValueKey = col_record.key == ignoreLongest;
        if (!isLongestValueKey && !isSameAsPreviousRecord) {
          doc.text(col_record.value, col_record.pos_x, posY, {
            align: col_record.align,
            width: col_record.width,
          });
        }
      });
      previousRecord = recordIndex;
    });
  },
};
