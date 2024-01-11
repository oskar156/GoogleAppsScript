function getAllOrdersAwaitingShipment() {
  
  let ssApiGet = new ApiShipstationGet(); //creates the object and fills it with data from hidden sheets
  let obj = ssApiGet.fillObjectCustom("orders_get", ["orderStatus"], ["awaiting_shipment"]);
  let url = ssApiGet.createUrl(obj); //writes out the url

  let requestOptions = ssApiGet.createRequestOptions(ssApiGet.objects["orders_get"]); //generates the request options

  let pageLimitStr = ssApiGet.findPageLimit(obj);
  pageLimitStr = 1;

  //API Request
  let callObj = ssApiGet.call(url, requestOptions, pageLimitStr); //makes the call to the api
  let action = obj.notApi_action; //helpful with accessing the response later
  let relevantData = ssApiGet.fillResponseArrayCustom("ApiShipstation_getObjects", "orders_get", 4); //decide what to display

  let data = ssApiGet.convertShipstationApiObjectInto2dArray(callObj, relevantData, action); //converts the object into a 2d array

  ssApiGet.pasteGetDataIntoSheetCustom("Orders", 1, 2, relevantData, data); //pastes the 2d data into a sheet

  return [relevantData, data];
}
