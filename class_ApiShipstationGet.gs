/*class_ApiShipstationGet

ApiShipstationGet class

  constructor
  pasteGetDataIntoSheetCustom(sheetName, headerRowIndex, firstRowIndex, headerRow, data)
  createUrl(object_input
  findPageLimit(object_input)
  createRequestOptions(object)
  call(url, requestOptions, pageLimitStr)
  parseSheetForObjects(sheetName)
  fillObjectCustom(objectName, listOfParameters, listOfValues)
  fillObjectWithUserInput()
  fillResponseArrayCustom(sheetName, action, offset)
  fillResponseArrayWithUserInput() 
  findPropertiesToCombineBy()
  convertShipstationApiObjectInto2dArray(object, relevantData, action)
  pasteGetDataIntoSheet(data, relevantData, dateRange)
  updateReportDetails(action, obj)
  
adjustGetData(data, relevantData, propertiesToCombineBy)
userGetCall()
*/

let ApiShipstationGet = class {

  //////////////////
  //constructor
  //////////////////
  constructor() {

    this.baseUrl = "https://ssapi.shipstation.com/";
    this.ignore = "notApi_";
    this.ki = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Instructions").getRange(6, 2).getValue();

    this.objectSheetName = "ApiShipstation_getObjects";
    this.objectSheetParameterIndexOffset = 0; //0-indexed
    this.objectSheetParameterDescIndexOffset = 0; //0-indexed
    this.objectSheetNotApiParameterIndexOffset = 2; //0-indexed
    this.objectSheetNotApiParameterValueIndexOffset = 3; //0-indexed
    this.objectSheetResponseParameterIndexOffset = 4; //0-indexed

    this.composerSheetName = "Shipstation API (GET)";
    this.composerSheetObjectCellX = 1; //0-indexed
    this.composerSheetObjectCellY = 1; //0-indexed
    this.composerSheetHeaderRowIndex = 3; //0-indexed
    this.composerSheetFirstRowIndex = 4; //0-indexed
    this.composerSheetParamterColIndex = 0; //0-indexed
    this.composerSheetDataColIndex = 1; //0-indexed
    this.composerSheetResponseParamterColIndex = 3; //0-indexed
    this.composerSheetResponseIncludeColIndex = 4; //0-indexed

    this.reportGetSheetName = "Report (GET)";
    this.reportGetSheetDetailRow = 0; //0-indexed
    this.reportGetSheetDetailCol = 0; //0-indexed
    this.reportGetSheetHeaderRow = 1; //0-indexed
    this.reportGetSheetFirstRow = 2; //0-indexed

    this.objects = {};
    this.parseSheetForObjects(this.objectSheetName);
  }

  //////////////////
  //pasteGetDataIntoSheetCustom
  //////////////////
  pasteGetDataIntoSheetCustom(sheetName, headerRowIndex, firstRowIndex, headerRow, data) {

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    sheet.getDataRange().clearContent();
    sheet.getRange(headerRowIndex, 1, 1, headerRow.length).setValues([headerRow]);
    sheet.getRange(firstRowIndex, 1, data.length, data[0].length).setValues(data);
  }

  //////////////////
  //createUrl
  //////////////////
  createUrl(object_input) { //creates a url based on a filled out object

    let object;

    if(typeof object_input == "string") {
      
      object = this.objects.object_input;
    }
    else if(typeof object_input == "object") {

      object = object_input;
    }

    let url = this.baseUrl;
    url += object[`${this.ignore}action`] + "?";
    let i = 0;

    for(let property in object) {

      if(property.substring(0, this.ignore.length) != this.ignore && 
         object[property] != "") {

        if(property != "page") {

          if(i >= 1)
            url += "&";
          url += property + "=" + object[property];
          i += 1;
        }
      }
    }

    return url;
  }

  //////////////////
  //findPageLimit
  //////////////////
  findPageLimit(object_input) {

    let object;

    if(typeof object_input == "string") {
      
      object = this.objects.object_input;
    }
    else if(typeof object_input == "object") {

      object = object_input;
    }

    let pageLimitStr = object["page"];
    return pageLimitStr;
  }

  //////////////////
  //createRequestOptions
  //////////////////
  createRequestOptions(object) { //creates request options based on a filled out object

    let requestOptions = {

      method: object[`${this.ignore}method`],
      headers: {"Authorization": `Basic ${this.ki}`},
      redirect: 'follow'
    };

    return requestOptions;
  }

  //////////////////
  //call
  //////////////////
  call(url, requestOptions, pageLimitStr) { //calls the api based on a filled out object and requestion options

    let pageLimit = parseInt(pageLimitStr);
    let data = [];

    let testData = UrlFetchApp.fetch(url, requestOptions);
    testData = JSON.parse(testData);

    if(testData["pages"] != undefined && testData["pages"] != null &&
       (pageLimitStr == "" || pageLimitStr == undefined || pageLimitStr == null)) {

      let pageData;
      let pages = 1;
      let attempts = 0;
      do {

        let newUrl = `${url}&page=${pages}`;
        pageData = UrlFetchApp.fetch(newUrl, requestOptions);
        pageData = JSON.parse(pageData);
        data.push(pageData);

        pages++;
        attempts++;
        wait(250);
        Logger.log(`Imported ${pageData.length} url: ${url}`);

      } while(pages <= pageData["pages"] && attempts < 30)
    }
    else if(pageLimitStr == "" || pageLimitStr == undefined || pageLimitStr == null) {

      let pageData = UrlFetchApp.fetch(url, requestOptions);
      pageData = JSON.parse(pageData);
      data.push(pageData);
      Logger.log(`Imported ${pageData.length} url: ${url}`);
    }
    else {

      for(let p = 1; p <= pageLimit; p++) {

        let newUrl = url + `&page=${p}`;

        let pageData = UrlFetchApp.fetch(newUrl, requestOptions);
        data.push(JSON.parse(pageData));
        Logger.log(`Imported ${pageData.length} url: ${url}`);
      }
    }

    return data;
  }

  //////////////////
  //parseSheetForObjects
  //////////////////
  parseSheetForObjects(sheetName) { //dynamically creates objects based on a sheet

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    let data = sheet.getDataRange().getValues();

    for(let col = 0; col < data[0].length; col++) {

      if(data[0][col + this.objectSheetParameterIndexOffset] != "") {

        this.objects[data[0][col + this.objectSheetParameterIndexOffset]] = {};
        for(let row = 1; row < data.length; row++) {

          this.objects[data[0][col + this.objectSheetParameterIndexOffset]][data[row][col + this.objectSheetParameterIndexOffset]] = "";
        }

        let i = 1;
        while(data[i][col + this.objectSheetNotApiParameterIndexOffset] != "") {

          this.objects[data[0][col + this.objectSheetParameterIndexOffset]][data[i][col + this.objectSheetNotApiParameterIndexOffset]] = data[i][col + this.objectSheetNotApiParameterValueIndexOffset];
          i += 1;
        }


      }
    }
  }

  //////////////////
  //fillObjectCustom
  //////////////////
  fillObjectCustom(objectName, listOfParameters, listOfValues) { //gets user input from a sheet and fills in the url's parameters, makes the call and returns the data in an object

    let object = this.objects[objectName];

    for(let property in object) {
      for(let p = 0; p < listOfParameters.length; p++) {

        if(listOfParameters[p] == property) {

          object[property] = listOfValues[p];
        }
      }
    }
    return object;
  }

  //////////////////
  //fillObjectWithUserInput
  //////////////////
  fillObjectWithUserInput() { //gets user input from a sheet and fills in the url's parameters, makes the call and returns the data in an object

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.composerSheetName);
    let data = sheet.getDataRange().getValues();
    let objectName = data[this.composerSheetObjectCellX][this.composerSheetObjectCellY];
    let object = this.objects[objectName];

    for(let row = this.composerSheetFirstRowIndex; row < data.length; row++) {
      for(let property in object) {

        if(property == data[row][this.composerSheetParamterColIndex]) {

          object[property] = data[row][this.composerSheetDataColIndex]
        }
      }
    }

    return object;
  }

  //////////////////
  //fillResponseArrayCustom
  //////////////////
  fillResponseArrayCustom(sheetName, action, offset) { //gets user input from a sheet to figure out what the user wants from the response

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    let data = sheet.getDataRange().getValues();
    let relevantData = [];

    let col = 0;
    while(col < data[0].length &&
          data[0][col] != action)
      col++;
    col += offset;
    
    for(let row = 1; row < data.length; row++) {

      relevantData.push(data[row][col]);
    }

    return relevantData;
  }

  //////////////////
  //fillResponseArrayWithUserInput
  //////////////////
  fillResponseArrayWithUserInput() { //gets user input from a sheet to figure out what the user wants from the response

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.composerSheetName);
    let data = sheet.getDataRange().getValues();
    let relevantData = [];

    let allEmpty = true;

    for(let d = this.composerSheetFirstRowIndex; d < data.length; d++) {
      if(data[d][this.composerSheetResponseIncludeColIndex] != "") {

        relevantData.push(data[d][this.composerSheetResponseParamterColIndex]);
        allEmpty = false;
      }
    }

    if(allEmpty == true) {

      for(let d = this.composerSheetFirstRowIndex; d < data.length; d++) {

        relevantData.push(data[d][this.composerSheetResponseParamterColIndex]);
        allEmpty = false;
      }
    }

    return relevantData;
  }

  //////////////////
  //findPropertiesToCombineBy
  //////////////////
  findPropertiesToCombineBy() { //gets user input from a sheet to figure out what the user wants from the response

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.composerSheetName);
    let data = sheet.getDataRange().getValues();
    let relevantData = [];

    for(let d = this.composerSheetFirstRowIndex; d < data.length; d++) {
      if(data[d][this.composerSheetResponseIncludeColIndex] == "combine") {
        relevantData.push(data[d][this.composerSheetResponseParamterColIndex]);
        }
      }

    return relevantData;
  }

  //////////////////
  //convertShipstationApiObjectInto2dArray
  //////////////////
  convertShipstationApiObjectInto2dArray(object, relevantData, action) {

    let array = [];

    for(let p = 0; p < object.length; p++) {

      let objectPage;
      if(action == "stores")
        objectPage = object[p];
      else if(action != "stores")
        objectPage = object[p][action];

    for(let a = 0; a < objectPage.length; a++) {
 
      let rows = 0;

      if(action == "shipments" && objectPage[a]["shipmentItems"] != null) {

        for(let s = 0; s < object[p][action][a]["shipmentItems"].length; s++) {

          array.push([]);
          rows += 1;
        }
      }
      else if(action == "orders" && objectPage[a]["items"] != null) {

        for(let s = 0; s < object[p][action][a]["items"].length; s++) {

          array.push([]);
          rows += 1;
        }
      }
      else if(action == "customers" && objectPage[a]["marketplaceUsernames"] != null) {

        for(let s = 0; s < object[p][action][a]["marketplaceUsernames"].length; s++) {

          array.push([]);
          rows += 1;
        }
      }
      else {

        array.push([]);
        rows += 1;
      }

      for(let row = 0; row < rows; row++) {
        for(let r = 0; r < relevantData.length; r++) {

          let data = "";
          let objectDir = objectPage[a];
          let target = relevantData[r];
          let list = target.split(":");

          for(let d = 0; d < list.length; d++) {

            if(objectDir != null && objectDir[list[d]] != null && (list[d] == "shipmentItems" || list[d] == "items"))
              objectDir = objectDir[list[d]][row];
            else if(objectDir != null)
              objectDir = objectDir[list[d]];
          }

          if(objectDir != null)
            data = objectDir;

          array[array.length - 1 - row].push(data);
        }
      }
    }
    }

    return array;
  }
  
  //////////////////
  //pasteGetDataIntoSheet
  //////////////////
  pasteGetDataIntoSheet(data, relevantData, dateRange) {

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.reportGetSheetName);
    sheet.getDataRange().clearContent();
    sheet.getRange(this.reportGetSheetHeaderRow + 1, 1, 1, relevantData.length).setValues([relevantData]);
    sheet.getRange(this.reportGetSheetFirstRow + 1, 1, data.length, data[0].length).setValues(data);
  }

  //////////////////
  //updateReportDetails
  //////////////////
  updateReportDetails(action, obj) {

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.reportGetSheetName);

    let reportDetails = "REPORT DETAILS:";
    reportDetails += "\nACTION: " + action;
    for(let property in obj) {

      reportDetails += `\n${property}: ${obj[property]}`;
    }


    sheet.getRange(this.reportGetSheetDetailRow + 1, this.reportGetSheetDetailCol + 1).clearContent();
    sheet.getRange(this.reportGetSheetDetailRow + 1, this.reportGetSheetDetailCol + 1).setValue(reportDetails);
  }
};

////////////////////////////////////////////////
// adjustGetData
////////////////////////////////////////////////
function adjustGetData(data, relevantData, propertiesToCombineBy) {

  let adjustedData = [];

  for(let row = 0; row < data.length; row++) {

    let combine = false;
    let stringComp = "";
    for(let col = 0; col < relevantData.length; col++) {
      for(let prop = 0; prop < propertiesToCombineBy.length; prop++) {

        if(propertiesToCombineBy[prop] == relevantData[col])
          stringComp += data[row][col].toString() + ",";
      }
    }

    let c = 0;
    let adjustComp = "";
    while(c < adjustedData.length &&
          adjustComp != stringComp) {

      adjustComp = "";
      for(let col = 0; col < relevantData.length; col++) {
        for(let prop = 0; prop < relevantData.length; prop++) {

          if(propertiesToCombineBy[prop] == relevantData[col])
            if(adjustedData[c] != undefined)
              adjustComp += adjustedData[c][col].toString() + ",";
        }
      }

      if(stringComp == adjustComp) 
        combine = true;
      else
        c++;
    }

    if(adjustedData[c] == undefined ||
       (c >= adjustedData[c].length - 1 && combine == false)) {

        adjustedData.push([]);
        for(let col2 = 0; col2 < relevantData.length; col2++)
          adjustedData[adjustedData.length - 1].push(data[row][col2]);

        adjustedData[adjustedData.length - 1].push(0);
        adjustedData[adjustedData.length - 1][adjustedData[adjustedData.length - 1].length - 1] += 1;
    }
    else {

      adjustedData[c][adjustedData[c].length - 1] += 1;
    }
  }

  return adjustedData;
}

////////////////////////////////////////////////
// userGetCall
////////////////////////////////////////////////
function userGetCall() {

  //Prep
  let ssApiGet = new ApiShipstationGet();       //creates the object and fills it with data from hidden sheets
  let obj = ssApiGet.fillObjectWithUserInput(); //fills in an empty object of the object with user input in the composer sheet
  let url = ssApiGet.createUrl(obj);            //writes out the url
  let requestOptions = ssApiGet.createRequestOptions(ssApiGet.objects.orders_get); //generates the request options
  let pageLimitStr = ssApiGet.findPageLimit(obj);
  Logger.log(url);

  //API Request
  let callObj = ssApiGet.call(url, requestOptions, pageLimitStr); //makes the call to the api

  //Organizing the request
  let action = obj.notApi_action; //helpful with accessing the response later
  let relevantData = ssApiGet.fillResponseArrayWithUserInput(); //gets user data to decide what to display
  let propertiesToCombineBy = ssApiGet.findPropertiesToCombineBy(); //gets user data to decide what to display

  //preparing the report
  let data = ssApiGet.convertShipstationApiObjectInto2dArray(callObj, relevantData, action); //converts the object into a 2d array

  //if(propertiesToCombineBy.length >= 1)
  //  data = adjustGetData(data, relevantData, propertiesToCombineBy);

  relevantData.push("count");
  ssApiGet.pasteGetDataIntoSheet(data, relevantData); //pastes the 2d data into a sheet
  ssApiGet.updateReportDetails(action, obj);
}
