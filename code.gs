function doGet(e) {
  if (e.parameter.action === "list") {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const students = [];
    for (let i = 1; i < data.length; i++) {
      students.push({
        rollNumber: data[i][0],
        name: data[i][1]
      });
    }
    return ContentService.createTextOutput(JSON.stringify(students))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Students Data")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const action = e.parameter.action;

  if (action === "add") {
    sheet.appendRow([e.parameter.rollNumber, e.parameter.name]);
    sortSheet(sheet);
    return ContentService.createTextOutput("Added");
  }

  if (action === "edit") {
    const oldRoll = e.parameter.oldRollNumber;
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == oldRoll) {
        sheet.getRange(i + 1, 1).setValue(e.parameter.rollNumber);
        sheet.getRange(i + 1, 2).setValue(e.parameter.name);
        sortSheet(sheet);
        return ContentService.createTextOutput("Edited");
      }
    }
    return ContentService.createTextOutput("Not Found");
  }

  if (action === "delete") {
    const roll = e.parameter.rollNumber;
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == roll) {
        sheet.deleteRow(i + 1);
        sortSheet(sheet);
        return ContentService.createTextOutput("Deleted");
      }
    }
    return ContentService.createTextOutput("Not Found");
  }
}

function sortSheet(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    // Sort by column 1 (Roll Number), ascending
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).sort({ column: 1, ascending: true });
  }
}
