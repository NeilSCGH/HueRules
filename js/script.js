function printRulesToTable(data){
  $("#rulesTable tbody tr").remove();
  var nb = 0;

  var table = document.getElementById("rulesTable").getElementsByTagName('tbody')[0];
  
  for (const [indexRule, rule] of Object.entries(data)) {
    var row = table.insertRow();

    var name = rule["name"];
    row.insertCell(0).innerHTML = name;

    var conditionsText = "";
    for (const [indexCond, condition] of Object.entries(rule["conditions"])) {
      conditionsText = conditionsText + "<br>" + condition["address"];
    }
    row.insertCell(1).innerHTML = conditionsText;

    var ActionsText = "";
    for (const [indexAct, action] of Object.entries(rule["actions"])) {
      ActionsText = ActionsText + "<br>" + action["address"];
    }
    row.insertCell(2).innerHTML = ActionsText;
  }
}


function getRules(){
  var ip = $("#HubIP")[0].value;
  var apiKey = $("#APIKey")[0].value;

  console.log('Getting the rules...');
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
    }
  ) 
}
