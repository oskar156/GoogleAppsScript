//menu.gs
function menu() { //creates menu entries for this spreadsheet

  //triggered to run On Open
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var menuEntries1 = [ //dropdown entry names
    {name: "Generate GET Report and paste in Report (GET) tab", functionName: "userGetCall"},
    {name: "getAllOrdersAwaitingShipment and paste in Orders Tab", functionName: "getAllOrdersAwaitingShipment"},
    {name: "updateOrders (whatever changes you made to the orders in the Orders Tab will be applied to ShipStation)", functionName: "updateOrders"}   
  ];

  ss.addMenu("Scripts", menuEntries1); //menu entry name
}
