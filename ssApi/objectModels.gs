function createOrdersObjectModel() {
  
  let objectModel = {

    orderId: null,
    orderNumber: null,
    orderKey: null,
    orderDate: null,
    createDate: null,
    modifyDate: null,
    paymentDate: null,
    shipByDate: null,
    orderStatus: null,
    customerId: null,
    customerUsername: null,
    customerEmail: null,
    billTo: createAddressObjectModel(),
    shipTo: createAddressObjectModel(),
    items: [createOrderItem()],
    orderTotal: null,
    amountPaid: null,
    taxAmount: null,
    shippingAmount: null,
    customerNotes: null,
    internalNotes: null,
    gift: null,
    giftMessage: null,
    paymentMethod: null,
    requestedShippingService: null,
    carrierCode: null,
    serviceCode: null,
    packageCode: null,
    confirmation: null,
    shipDate: null,
    holdUntilDate: null,
    weight: createWeightModel(),
    dimensions: createDimensionsModel(),
    insuranceOptions: createInsuraceOptions(),
    internationalOptions: createInternationalOptions(),
    advancedOptions: createAdvancedOptions(),
    tagIds: ["0"],
    userId: null,
    externallyFulfilled: null,
    externallyFulfilledBy: null
  }
  Logger.log(objectModel);
  return objectModel;
}

function createAddressObjectModel() {

  let objectModel = {

    name: null,
    company: null,
    street1: null,
    street2: null,
    street3: null,
    city: null,
    state: null,
    postalCode: null,
    country: null,
    phone: null,
    residential: null,
    addressVerified: null
  }

  return objectModel;
}

function createOrderItem() {

  let objectModel = {

    orderItemId: null,
    lineItemKey: null,
    sku: null,
    name: null,
    imageUrl: null,
    weight: createWeightModel(),
    quantity: null,
    unitPrice: null,
    taxAmount: null,
    shippingAmount: null,
    warehouseLocation: null,
    options: [createItemOption()],
    productId: null,
    fulfillmentSku: null,
    adjustment: null,
    upc: null,
    createDate: null,
    modifyDate: null
  }

  return objectModel;
}

function createWeightModel() {

  let objectModel = {

    value: null,
    units: null,
    WeightUnits: null
  }

  return objectModel;
}

function createDimensionsModel() {

  let objectModel = {

    length: null,
    width: null,
    height: null,
    units: null
  }

  return objectModel;
}

function createInsuraceOptions() {

  let objectModel = {

    provider: null,
    insureShipment: null,
    insuredValue: null
  }

  return objectModel;
}

function createInternationalOptions() {

  let objectModel = {

    contents: null,
    customsItems: createCustomsItem(),
    nonDelivery: null
  }

  return objectModel;
}

function createCustomsItem() {

  let objectModel = {

    customsItemId: null,
    description: null,
    quantity: null,
    value: null,
    harmonizedTariffCode: null,
    countryOfOrigin: null
  }

  return objectModel;
}

function createAdvancedOptions() {

  let objectModel = {

    warehouseId: null,
    nonMachinable: null,
    saturdayDelivery: null,
    containsAlcohol: null,
    storeId: null,
    customField1: null,
    customField2: null,
    customField3: null,
    source: null,
    mergedOrSplit: null,
    mergedIds: ["0"],
    parentId: null,
    billToParty: null,
    billToAccount: null,
    billToPostalCode: null,
    billToCountryCode: null,
    billToMyOtherAccount: null
  }

  return objectModel;
}

function createItemOption() {

  let objectModel = {

    name: null,
    value: null
  }

  return objectModel;
}
