function getResultsForBlankTowerLists()
{
  //for tower atdata email validation
  //https://docs.atdata.com/#list-api-introduction
  //using AppsScript

  let TWR_API_KEY = "";
  let TWR_API_BASE_URL = "https://api.atdata.com/v5/";
  let method = "list";

  let url = String(TWR_API_BASE_URL) + String(method) + "/" + String(listId) + "";
  let options = {headers: {"api_key": TWR_API_KEY}};
  let response = UrlFetchApp.fetch(url, options);
  response = JSON.parse(response);
}
