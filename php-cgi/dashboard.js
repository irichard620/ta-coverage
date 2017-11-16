function initDashboard() {
	var userId = localStorage.getItem('_id');
	if (userId == null) {
		window.location.href = 'login.html';
	} else {
		var name = localStorage.getItem('name');
		$("p").text(name);
	}

	var ul = document.getElementById('managedLabsList');
	ul.onClick = function(event) {
		var target = getTarget(event);
		localStorage.setItem('lab_id', target.id);
		window.location.href = 'labdashboard.html';
	}

	// Retrieve qualified labs for this user
  var request = $.ajax({
    url: 'php-cgi/labs.php?user_id=' + userId + '&type=qualified',
    type: 'get',
    dataType: "json",
  });

	request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    var labs = data.labs;
    if (response.includes("Success")) {
      var htmlString = "";
      var separatorString = "<div class='separator'> - </div>";

      for (var i = 0; i < labs.length; i++) {
        htmlString += "<li><div>";
        htmlString += ("<div class='lab'>" + labs[i].title + "</div>");
        htmlString += separatorString;
        htmlString += ("<div class='time'>" + labs[i].labTime + "</div>");
        htmlString += "</div></li>";

        //add html to list
        $("#qualifiedLabs ul").append(htmlString);

        htmlString = "";  // Reset htmlstring for next iteration (lab)
      }

    } else {
        alert("Error");
    }
  });
  request.fail(function() {
    alert("Failed");
  });

	// Retrieve managed labs for this user
	var request2 = $.ajax({
    url: 'php-cgi/labs.php?user_id=' + userId + '&type=managed',
    type: 'get',
    dataType: "json",
  });

	request2.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    var labs = data.labs;
    if (response.includes("Success")) {
      var htmlString = "";
      var separatorString = "<div class='separator'> - </div>";

      for (var i = 0; i < labs.length; i++) {
        htmlString += "<li id='" + labs[i]._id + "'><div>";
        htmlString += ("<div class='lab'>" + labs[i].title + "</div>");
        htmlString += separatorString;
        htmlString += ("<div class='time'>" + labs[i].labTime + "</div>");
        htmlString += "</div></li>";

        //add html to list
        $("#managedLabs ul").append(htmlString);

        htmlString = "";  // Reset htmlstring for next iteration (lab)
      }

    } else {
        alert("Error");
    }
  });
  request2.fail(function() {
    alert("Failed");
  });
}

function getTarget(event) {
	event = event || window.event;
	return event.target || event.srcElement;
}
