/*ApiShipstation_post_updateOrders class
https://www.shipstation.com/docs/api/orders/create-update-order/
*/

let ApiShipstation_post_updateOrders = class {

  constructor() {

    this.baseUrl = "https://ssapi.shipstation.com/orders/createorders";
    this.ignore = "notApi_";
    this.ki = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Instructions").getRange(6, 2).getValue();

    this.objectSheetName = "ApiShipstation_post_updateOrders";
    this.objectSheetParameterIndex = 0;
    this.objectSheetParameterDescIndex = 1;
    this.objectSheetNotApiParameterIndex = 2;
    this.objectSheetNotApiParameterValueIndex = 3; 

    this.ordersObj = [];
  }

  parseSheetToFillOrdersObject(sheetName) {

    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    let data = sheet.getDataRange().getValues();

    for(let row = 1; row < data.length; row++)
      this.ordersObj[data[row][this.objectSheetParameterIndex]] = "";
  }

  prepareUpdateOrderPayload(dataRaw, headerRowContent) {

    for(let row = 0; row < dataRaw.length; row++) { //for each row in dataRaw 

      Logger.log(`row ${row}`);
      let tempObject = createEmptyOrderUpdateObject();

      for(let col = 0; col < headerRowContent[0].length; col++) {

        fillInUpdateOrderObject(tempObject, headerRowContent[0][col], dataRaw[row][col]);
      }

      this.ordersObj.push(tempObject);
    }

    return this.ordersObj;
  }


  updateOrdersRequest(data) {

    data = JSON.stringify(data);

    let requestOptions = {

      method: 'POST',
      headers: {

        "Authorization": `Basic ${this.ki}`,
        "Content-Type": `application/json`,       
      },

      payload: data, //payload not body!
      redirect: 'follow',
      muteHttpExceptions: true
    };

    let url = `${this.baseUrl}`;
    let response = UrlFetchApp.fetch(url, requestOptions);
    Logger.log(response);

    wait(1500); //1.5 seconds in milliseconds

    return response;
  }
};

function updateOrders() {
  
  let ssApiPost = new ApiShipstation_post_updateOrders(); //creates the object and fills it with data from hidden sheets

  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  let headerRowContent = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues();//data[1];//= [data[0]];
  let dataRaw = sheet.getRange(2,1,sheet.getLastRow() - 1,sheet.getLastColumn()).getValues();//data[1];

  let payload = ssApiPost.prepareUpdateOrderPayload(dataRaw, headerRowContent);
  //Logger.log(payload);

  let i = 0;
  let lastUsedIndex = 0;

  while(i < payload.length) {

    if((i + 1) % 100 == 0 || 
        i == payload.length - 1) {

      let payloadPortion = payload.slice(lastUsedIndex, i + 1);

      let response = ssApiPost.updateOrdersRequest(payloadPortion);
      //Logger.log(response);
    }
    
    i += 1;
  }
}

function fillInUpdateOrderObject(objectModel, dir, data) {

  let dataFixed;
  let useFixedData = false;
  let nullAway;
  let useNullAway = false;

  if(data == null || data == 0 || data == "0") {

    if(dir == "tagIds") {

      dataFixed = "0";
      useFixedData = true;
    }
    else if(dir == "advancedOptions:mergedIds") {

      dataFixed = "0";
      useFixedData = true;
    }
    else if(dir == "dimensions:units") {

      dataFixed = "inches";
      useFixedData = true;
    }
    else if(dir == "items:options:value") {

      dataFixed = "0";
      useFixedData = true;
    }
    else if(dir == "items:options:name") {

      dataFixed = "";
      useFixedData = true;
    }
    else if(dir == "customerId") {

      dataFixed = "0";
      useFixedData = true;
    }
  }

  if(dir == "orderId") objectModel["orderId"] = data;
  else if(dir == "orderNumber") objectModel["orderNumber"] = data;
  else if(dir == "orderKey") objectModel["orderKey"] = data;
  else if(dir == "orderDate") objectModel["orderDate"] = data;
  else if(dir == "paymentDate") objectModel["paymentDate"] = data;
  else if(dir == "shipByDate") objectModel["shipByDate"] = data;
  else if(dir == "orderStatus") objectModel["orderStatus"] = data;
  else if(dir == "customerUsername") objectModel["customerUsername"] = data;
  else if(dir == "customerEmail") objectModel["customerEmail"] = data;
  else if(dir == "amountPaid") objectModel["amountPaid"] = data;
  else if(dir == "taxAmount") objectModel["taxAmount"] = data;
  else if(dir == "shippingAmount") objectModel["shippingAmount"] = data;
  else if(dir == "customerNotes") objectModel["customerNotes"] = data;
  else if(dir == "internalNotes") objectModel["internalNotes"] = data;
  else if(dir == "gift") objectModel["gift"] = data;
  else if(dir == "giftMessage") objectModel["giftMessage"] = data;
  else if(dir == "paymentMethod") objectModel["paymentMethod"] = data;
  else if(dir == "requestedShippingService") objectModel["requestedShippingService"] = data;
  else if(dir == "carrierCode") objectModel["carrierCode"] = data;
  else if(dir == "serviceCode") objectModel["serviceCode"] = data;
  else if(dir == "packageCode") objectModel["packageCode"] = data;
  else if(dir == "confirmation") objectModel["confirmation"] = data;
  else if(dir == "shipDate") objectModel["shipDate"] = data;
  else if(dir == "customerId" && useFixedData == false) objectModel["customerId"] = data;
  else if(dir == "customerId" && useFixedData == true) objectModel["customerId"] = dataFixed;
  else if(dir == "tagIds" && useFixedData == false) objectModel["tagIds"][0] = data;
  else if(dir == "tagIds" && useFixedData == true) objectModel["tagIds"][0] = dataFixed;

  else if(dir == "billTo:name") objectModel["billTo"]["name"] = data;
  else if(dir == "billTo:company") objectModel["billTo"]["company"] = data;
  else if(dir == "billTo:street1") objectModel["billTo"]["street1"] = data;
  else if(dir == "billTo:street2") objectModel["billTo"]["street2"] = data;
  else if(dir == "billTo:street3") objectModel["billTo"]["street3"] = data;
  else if(dir == "billTo:city") objectModel["billTo"]["city"] = data;
  else if(dir == "billTo:state") objectModel["billTo"]["state"] = data;
  else if(dir == "billTo:postalCode") objectModel["billTo"]["postalCode"] = data;
  else if(dir == "billTo:country") objectModel["billTo"]["country"] = data;
  else if(dir == "billTo:phone") objectModel["billTo"]["phone"] = data;
  else if(dir == "billTo:residential") objectModel["billTo"]["residential"] = data;

  else if(dir == "shipTo:name") objectModel["shipTo"]["name"] = data;
  else if(dir == "shipTo:company") objectModel["shipTo"]["company"] = data;
  else if(dir == "shipTo:street1") objectModel["shipTo"]["street1"] = data;
  else if(dir == "shipTo:street2") objectModel["shipTo"]["street2"] = data;
  else if(dir == "shipTo:street3") objectModel["shipTo"]["street3"] = data;
  else if(dir == "shipTo:city") objectModel["shipTo"]["city"] = data;
  else if(dir == "shipTo:state") objectModel["shipTo"]["state"] = data;
  else if(dir == "shipTo:postalCode") objectModel["shipTo"]["postalCode"] = data;
  else if(dir == "shipTo:country") objectModel["shipTo"]["country"] = data;
  else if(dir == "shipTo:phone") objectModel["shipTo"]["phone"] = data;
  else if(dir == "shipTo:residential") objectModel["shipTo"]["residential"] = data;

  else if(dir == "weight:value") objectModel["weight"]["value"] = data;
  else if(dir == "weight:units") objectModel["weight"]["units"] = data;

  else if(dir == "dimensions:units" && useFixedData == false) objectModel["dimensions"]["units"] = data;
  else if(dir == "dimensions:units" && useFixedData == true) objectModel["dimensions"]["units"] = dataFixed;
  else if(dir == "dimensions:length") objectModel["dimensions"]["length"] = data;
  else if(dir == "dimensions:width") objectModel["dimensions"]["width"] = data;
  else if(dir == "dimensions:height") objectModel["dimensions"]["height"] = data;

  else if(dir == "insuranceOptions:provider") objectModel["insuranceOptions"]["provider"] = data;
  else if(dir == "insuranceOptions:insureShipment") objectModel["insuranceOptions"]["insureShipment"] = data;
  else if(dir == "insuranceOptions:insuredValue") objectModel["insuranceOptions"]["insuredValue"] = data;

  else if(dir == "internationalOptions:contents") objectModel["internationalOptions"]["contents"] = data;
  else if(dir == "internationalOptions:customsItems") objectModel["internationalOptions"]["customsItems"] = data;

  else if(dir == "advancedOptions:warehouseId") objectModel["advancedOptions"]["warehouseId"] = data;
  else if(dir == "advancedOptions:nonMachinable") objectModel["advancedOptions"]["nonMachinable"] = data;
  else if(dir == "advancedOptions:saturdayDelivery") objectModel["advancedOptions"]["saturdayDelivery"] = data;
  else if(dir == "advancedOptions:containsAlcohol") objectModel["advancedOptions"]["containsAlcohol"] = data;
  else if(dir == "advancedOptions:mergedOrSplit") objectModel["advancedOptions"]["mergedOrSplit"] = data;
  else if(dir == "advancedOptions:parentId") objectModel["advancedOptions"]["parentId"] = data;
  else if(dir == "advancedOptions:storeId") objectModel["advancedOptions"]["storeId"] = data;
  else if(dir == "advancedOptions:customField1") objectModel["advancedOptions"]["customField1"] = data;
  else if(dir == "advancedOptions:customField2") objectModel["advancedOptions"]["customField2"] = data;
  else if(dir == "advancedOptions:customField3") objectModel["advancedOptions"]["customField3"] = data;
  else if(dir == "advancedOptions:source") objectModel["advancedOptions"]["source"] = data;
  else if(dir == "advancedOptions:billToParty") objectModel["advancedOptions"]["billToParty"] = data;
  else if(dir == "advancedOptions:billToAccount") objectModel["advancedOptions"]["billToAccount"] = data;
  else if(dir == "advancedOptions:billToPostalCode") objectModel["advancedOptions"]["billToPostalCode"] = data;
  else if(dir == "advancedOptions:billToCountryCode") objectModel["advancedOptions"]["billToCountryCode"] = data;
  else if(dir == "advancedOptions:mergedIds" && useFixedData == false) objectModel["advancedOptions"]["mergedIds"][0] = data;
  else if(dir == "advancedOptions:mergedIds" && useFixedData == true) objectModel["advancedOptions"]["mergedIds"][0] = dataFixed;

  else if(dir == "items:lineItemKey") objectModel["items"][0]["lineItemKey"] = data;
  else if(dir == "items:sku") objectModel["items"][0]["sku"] = data;
  else if(dir == "items:name") objectModel["items"][0]["name"] = data;
  else if(dir == "items:imageUrl") objectModel["items"][0]["imageUrl"] = data;
  else if(dir == "items:quantity") objectModel["items"][0]["quantity"] = data;
  else if(dir == "items:unitPrice") objectModel["items"][0]["unitPrice"] = data;
  else if(dir == "items:taxAmount") objectModel["items"][0]["taxAmount"] = data;
  else if(dir == "items:shippingAmount") objectModel["items"][0]["shippingAmount"] = data;
  else if(dir == "items:warehouseLocation") objectModel["items"][0]["warehouseLocation"] = data;
  else if(dir == "items:productId") objectModel["items"][0]["productId"] = data;
  else if(dir == "items:fulfillmentSku") objectModel["items"][0]["fulfillmentSku"] = data;
  else if(dir == "items:adjustment") objectModel["items"][0]["adjustment"] = data;
  else if(dir == "items:upc") objectModel["items"][0]["upc"] = data;
  else if(dir == "items:weight:value") objectModel["items"][0]["weight"]["value"] = data;
  else if(dir == "items:weight:units") objectModel["items"][0]["weight"]["units"] = data;
  else if(dir == "items:options:name") objectModel["items"][0]["options"][0]["name"] = data;
  else if(dir == "items:options:value") objectModel["items"][0]["options"][0]["value"] = data;
  else if(dir == "items:options:name" && useFixedData == true) objectModel["items"][0]["options"][0]["name"] = useFixedData;
  else if(dir == "items:options:value" && useFixedData == true) objectModel["items"][0]["options"][0]["value"] = useFixedData;
 // }

  return objectModel;
}

function createEmptyOrderUpdateObject() {

  let emptyOrderUpdateObject = {

  "billTo":{

    "name":null,
    "company":null,
    "street1":null,
    "street2":null,
    "street3":null,
    "city":null,
    "state":null,
    "postalCode":null,
    "country":null,
    "phone":null,
    "residential":null
  },

  "shipTo":{
    "name":null,
    "company":null,
    "street1":null,
    "street2":null,
    "street3":null,
    "city":null,
    "state":null,
    "postalCode":null,
    "country":null,
    "phone":null,
    "residential":null,
  },

  "items":[{
    "lineItemKey":null,
    "sku":null,
    "name":null,
    "imageUrl":null,
    "quantity":null,
    "unitPrice":null,
    "taxAmount":null,
    "shippingAmount":null,
    "warehouseLocation":null,
    "productId":null,
    "fulfillmentSku":null,
    "adjustment":null,
    "upc":null,

    "weight":{
      "value":null,
      "units":null
    },



    "options":[
      {"name":null,
      "value":null
      }],
  }],

  "weight":{
    "value":null,
    "units":null
  },

  "dimensions":{
    "units":"inches",
    "length":0.0,
    "width":0.0,
    "height":0.0
  },

  "insuranceOptions":{
    "provider":null,
    "insureShipment":null,
    "insuredValue":null
  },

  "internationalOptions":{
    "contents":null,
    "customsItems":null
  },
  "advancedOptions":{
    
    "warehouseId":null,
    "nonMachinable":null,
    "saturdayDelivery":null,
    "containsAlcohol":null,
    "mergedOrSplit":null,
    "mergedIds":[0],
    "parentId":null,
    "storeId":null,
    "customField1":null,
    "customField2":null,
    "customField3":null,
    "source":null,
    "billToParty":null,
    "billToAccount":null,
    "billToPostalCode":null,
    "billToCountryCode":null
  },

  "orderNumber":null,
  "orderKey":null,
  "orderDate":null,
  "paymentDate":null,
  "shipByDate":null,
  "orderStatus":null,
  "customerId":null,
  "customerUsername":null,
  "customerEmail":null,
  "amountPaid":null,
  "taxAmount":null,
  "shippingAmount":null,
  "customerNotes":null,
  "internalNotes":null,
  "gift":null,
  "giftMessage":null,
  "paymentMethod":null,
  "requestedShippingService":null,
  "carrierCode":null,
  "serviceCode":null,
  "packageCode":null,
  "confirmation":null,
  "shipDate":null,
  "tagIds":[0]
  };

  return emptyOrderUpdateObject;
}
