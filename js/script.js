function printRulesToTable(data){
  $("#rulesTable tbody tr").remove();
  var nb = 0;

  var table = document.getElementById("rulesTable").getElementsByTagName('tbody')[0];
  
  for (const [indexRule, rule] of Object.entries(data)) {
    var row = table.insertRow();

    row.insertCell(0).innerHTML = indexRule;

    var conditionsText = "";
    for (const [indexCond, condition] of Object.entries(rule["conditions"])) {
      if (conditionsText != "") {
        conditionsText = conditionsText + "<br>";
      }

      conditionsText = conditionsText + condition["address"]
                                + " " + condition["operator"];

      if (condition["value"] != undefined){
        conditionsText = conditionsText + " " + condition["value"];
      }
    }
    row.insertCell(1).innerHTML = conditionsText;

    var ActionsText = "";
    for (const [indexAct, action] of Object.entries(rule["actions"])) {
      if (ActionsText != "") {
        ActionsText = ActionsText + "<br>";
      }

      ActionsText = ActionsText + action["address"]
                          + " " + action["method"];

      for (const [desc, bodyAction] of Object.entries(action["body"])) {
        ActionsText = ActionsText + " " + desc + " to " + bodyAction;
      }
    }
    row.insertCell(2).innerHTML = ActionsText;
  }
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

function getRules(){
  $("#rulesTable tbody tr").remove();
  var ip = $("#HubIP")[0].value;
  var apiKey = $("#APIKey")[0].value;

  console.log('Getting the rules...');
  addMessage('Getting the rules...');
  console.log("http://" + ip + "/api/" + apiKey + "/rules");
  $.ajax({
      type: "GET",
      url: "http://" + ip + "/api/" + apiKey + "/rules",
      contentType: 'application/json'
    })
    .fail(function(jqXHR, textStatus) {
      console.log('Error when reaching the hub');
    })
    .done(function(response) {
      console.log('Done');
      console.log(response);
      printRulesToTable(response);
    }) 
}