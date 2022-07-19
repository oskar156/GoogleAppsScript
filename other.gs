/*other

wait(ms)
prompt_yesNo(message)
copySheetToOtherSpreadSheet
*/


//===================================================
// wait
//===================================================
function wait(ms){

   var start = new Date().getTime();
   var end = start;

   while(end < start + ms)
     end = new Date().getTime();

}

//===================================================
// prompt_simpleResponse
//===================================================
function prompt_simpleResponse(message) {

  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(message, ui.ButtonSet.OK_CANCEL);
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  var response = "";

  if(button == ui.Button.OK) 
    response =  text;
  else if(button == ui.Button.CANCEL || button == ui.Button.CLOSE) 
    response =  "QUIT";

  return response;
}

//===================================================
// copySheetToOtherSpreadSheet
//===================================================
function copySheetToOtherSpreadSheet() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var template = ss.getSheetByName("Template");

  var timeAndDate = new Date;
  var sheetName = `Rename to Month Mmm (${timeAndDate.toString().substring(4, 25)})`;

  var otherSS = SpreadsheetApp.openById("1swa8OQ_8YceuprhFm8mXyJ2AZJN5JxE4Sdp4t3udD3M");
  template.copyTo(otherSS).setName(sheetName); //copy the template
}
