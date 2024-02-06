var data;

function printRulesToTable(data, callback){
  $("#rulesTable tbody tr").remove();
  var nb = 0;

  var table = document.getElementById("rulesTable").getElementsByTagName('tbody')[0];
  
  for (const [indexRule, rule] of Object.entries(data)) {
    var row = table.insertRow();

    row.insertCell(0).innerHTML = indexRule;

    var conditionsText = "";
    for (const [indexCond, condition] of Object.entries(rule["conditions"])) {
      //Raw version
      conditionsText = conditionsText + "<span class=\"raw\">" + condition["address"];
      conditionsText = conditionsText + " " + condition["operator"];

      if (condition["value"] != undefined){
        conditionsText = conditionsText + " " + condition["value"];
      }
      conditionsText = conditionsText + "</span>";
      

      //Not raw version
      conditionsText = conditionsText + "<span class=\"notRaw\">" + getName(condition["address"]);
      conditionsText = conditionsText + " " + condition["operator"];

      if (condition["value"] != undefined){
        conditionsText = conditionsText + " " + condition["value"];
      }
      conditionsText = conditionsText + "</span>";
    }
    row.insertCell(1).innerHTML = conditionsText;

    var ActionsText = "";
    for (const [indexAct, action] of Object.entries(rule["actions"])) {
      for (const [desc, bodyAction] of Object.entries(action["body"])) {
        //Raw version
        ActionsText = ActionsText + "<span class=\"raw\">" + action["method"];
        ActionsText = ActionsText + " " + action["address"];

        if (!(action["address"].startsWith("/scenes/"))) {
          ActionsText = ActionsText + " " + desc + " to " + bodyAction;
        }
        ActionsText = ActionsText + "</span>";
        

        //Not raw version
        ActionsText = ActionsText + "<span class=\"notRaw\">" + action["method"];
        ActionsText = ActionsText + " " + getName(action["address"]);
      
        if (!(action["address"].startsWith("/scenes/"))) {
          ActionsText = ActionsText + " " + desc + " to " + bodyAction;
        }
        
        ActionsText = ActionsText + "</span>";
      }
    }
    row.insertCell(2).innerHTML = ActionsText;
  }

  callback();
}

function addMessage(txt){
  $("#rulesTable tbody tr").remove();
  var table = document.getElementById("rulesTable").getElementsByTagName('tbody')[0];
  var row = table.insertRow();
  var cell = row.insertCell(0);
  cell.innerHTML = txt;
  cell.colSpan = "3";
  return cell;
}

function getData(callback){
  $("#rulesTable tbody tr").remove();
  var ip = $("#HubIP")[0].value;
  var apiKey = $("#APIKey")[0].value;

  console.log('Getting the data...');
  addMessage('Getting the data...');
  console.log("http://" + ip + "/api/" + apiKey);
  $.ajax({
      type: "GET",
      url: "http://" + ip + "/api/" + apiKey,
      contentType: 'application/json'
    })
    .fail(function(jqXHR, textStatus) {
      console.log('Error when reaching the hub');
      alert('Error when reaching the hub');
    })
    .done(function(response) {
      console.log("Done")
      callback(response)
    }) 
}



function getSceneName(sceneName){
  var name = data["scenes"][sceneName]["name"];
  return name;
}

function getName(address){
  if (address.startsWith("/sensors/")){
     var id = address.split("/")[2];
     var name = data["sensors"][id]["name"];
     return name;
  }
  if (address.startsWith("/scenes/")){
     var id = address.split("/")[2];
     var name = data["scenes"][id]["name"];
     return name;
  }
  if (address.startsWith("/groups/")){
    var id = address.split("/")[2];
    if (id == 0){
      return "Group 0";
    }
    else{
      var name = data["groups"][id]["name"];
      return name;
    }
  }
  if (address.startsWith("/schedules/")){
     var id = address.split("/")[2];
     var name = data["schedules"][id]["name"];
     return name;
  }
  if (address.startsWith("/config/localtime")){
     return "Time";
  }

  return "ERROR";
}

function getAll(){
  getData(function(d){
    data = d;
    console.log(data);

    printRulesToTable(data["rules"], function(){
      rawDataUpdate();
    });
  });
}

$(document).ready(function() {
  getAll();
});

function rawDataUpdate(){
  var showRawData = $("#rawData")[0].checked;
  if (showRawData) {
    console.log("Showing raw data");
    var raw = $('.raw');
    for (var i = 0; i < raw.length; i ++) {
        raw[i].style.display = 'block';
    }

    var notRaw = $('.notRaw');
    for (var i = 0; i < notRaw.length; i ++) {
        notRaw[i].style.display = 'none';
    }
  }
  else {
    console.log("Hiding raw data");
    var raw = $('.raw');
    for (var i = 0; i < raw.length; i ++) {
        raw[i].style.display = 'none';
    }

    var notRaw = $('.notRaw');
    for (var i = 0; i < notRaw.length; i ++) {
        notRaw[i].style.display = 'block';
    }
  }
}