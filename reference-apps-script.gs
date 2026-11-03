function sheetToJson(sheetName = 'DB') {
  var sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('key')).getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  const [firstRow, lastRow] = [1, sheet.getLastRow()];
  const [firstCol, lastCol] = [1, sheet.getLastColumn()];
  
  if (lastRow <= 1) {
    return []; // Return empty array if sheet only has header or is empty
  }
  
  var sheetRows = sheet.getRange(firstRow, firstCol, lastRow, lastCol).getValues();
  var header = sheetRows[0].map(item => item.toString().toLowerCase().trim());
  var sheetDataList = sheetRows.slice(1);
  var dataList = [];
  
  for (var i = 0; i < sheetDataList.length; i++) {
    var dataItem = {};
    for (var j = 0; j < header.length; j++) {
      var value = sheetDataList[i][j];
      // Convert empty strings to null
      dataItem[header[j]] = value === '' ? null : value;
    }
    dataList.push(dataItem);
  }
  return dataList;
}

var SCRIPT_PROP = PropertiesService.getScriptProperties();
var USERNAME = "";
var PASSWORD = "";
var TEAMS_WEBHOOK_URLS = [
  ""
]; // Add your Teams webhook URLs here

function doGet(e) {
  return handleResponse(e);
}

function doPost(e) {
  return handleResponse(e);
}

function postToTeams(adaptiveCard) {
  try {
    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify({
        'type': 'message',
        'attachments': [{
          'contentType': 'application/vnd.microsoft.card.adaptive',
          'content': JSON.parse(adaptiveCard)
        }]
      })
    };
    
    var successCount = 0;
    for (var i = 0; i < TEAMS_WEBHOOK_URLS.length; i++) {
      try {
        var response = UrlFetchApp.fetch(TEAMS_WEBHOOK_URLS[i], options);
        if (response.getResponseCode() === 200) {
          successCount++;
        }
      } catch(webhookError) {
        console.error('Error posting to Teams webhook #' + (i + 1) + ':', webhookError);
      }
    }
    
    return successCount > 0; // Return true if at least one webhook succeeded
  } catch(error) {
    console.error('Error posting to Teams:', error);
    return false;
  }
}

function handleResponse(e) {
  var lock = LockService.getPublicLock();
  try {
    lock.waitLock(30000); // wait 30 seconds before conceding defeat

    // Parse URL encoded parameters
    var params = {};
    if (e.parameter) {
      params = e.parameter;
    } else if (e.postData && e.postData.type === "application/x-www-form-urlencoded") {
      var paramString = e.postData.contents;
      var pairs = paramString.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
    }

    // Verify credentials from parameters
    if (!params.username || !params.password || 
        params.username !== USERNAME || 
        params.password !== PASSWORD) {
      throw new Error("Invalid credentials");
    }
    
    var sheetName = params.sheetName || 'DB';
    var requestType = params.requestType || 'GET';
    
    if (requestType === 'GET') {
      // Handle GET request
      var data = sheetToJson(sheetName);
      return ContentService
        .createTextOutput(JSON.stringify({
          "data": data,
          "success": true
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (requestType === 'POST') {
      // Handle POST request
      var sheet = SpreadsheetApp.openById(SCRIPT_PROP.getProperty('key')).getSheetByName(sheetName);
      if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
      }

      var formData = JSON.parse(params.formData);
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var newRow = headers.map(header => {
        var key = header.toString().toLowerCase().trim();
        return formData[key] || '';
      });

      sheet.appendRow(newRow);

      // Post adaptive card to Teams if provided
      var teamsNotificationSent = false;
      if (params.adaptiveCard) {
        teamsNotificationSent = postToTeams(params.adaptiveCard);
      }

      return ContentService
        .createTextOutput(JSON.stringify({
          "success": true,
          "message": "Leave application submitted successfully",
          "teamsNotificationSent": teamsNotificationSent
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error("Invalid request type");
    }
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        "success": false,
        "error": error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  if (!doc) {
    throw new Error("No active spreadsheet found");
  }
  SCRIPT_PROP.setProperty("key", doc.getId());
}
