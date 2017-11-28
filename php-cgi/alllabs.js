var labs;

function createListOfLabs() {
	var userId = localStorage.getItem('_id');
	if (userId == null) {
		window.location.href = 'login.html';
	}
  var request = $.ajax({
    url: 'php-cgi/labs.php?user_id=' + userId + '&type=all',
    type: 'get',
    dataType: "json",
  });

  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    labs = data.labs;
    if (response.includes("Success")) {
      for (var i = 0; i < labs.length; i++) {
				var htmlString = createHtmlString(labs[i]);

        //add html to list
        $("#alllabs ul").append(htmlString);

        // Check appropriate check boxesd\
        if (labs[i].qualified) {
					$('#' + labs[i]._id).prop('checked', true);
				}
      }

    } else {
        alert("Error");
    }
  });
  request.fail(function() {
    alert("Failed");
  });
}

function createHtmlString(lab) {
	var htmlString = "";
	htmlString += "<li><div>";
	htmlString += ("<div class='lab'>" + lab.title + "</div>");
	htmlString += ("<div class='separator'> | </div>");
	htmlString += ("<div class='time'>" + lab.dayOfWeek + " " +
	lab.startTime + "-" + lab.endTime + "</div>");
	htmlString += ("<div class='separator'></div>");
	htmlString += ("<input id='" + lab._id + "' class='checkbox' type='checkbox'>");
	htmlString += "</div></li>";
	return htmlString;
}

function updateAvailability(labId, qualified) {

  var userId = localStorage.getItem('_id');

  // POST REQUEST TO CREATE RELATIONSHIP
  if (qualified) {
    var request = $.ajax({
      url: 'php-cgi/labs.php',
      type: 'post',
      dataType: "json",
      data: {user_id: userId, lab_id: labId, type: 'edit'}
    });
  } else {  // DELETE REQUEST TO DELETE RELATIONSHIP
    var request = $.ajax({
      url: 'php-cgi/labs.php',
      type: 'delete',
      dataType: "json",
      data: {user_id: userId, lab_id: labId}
    });
  }
}

function updateResults() {
	// Get search text
	var searchText = document.getElementById("search").value.trim();
	console.log(searchText);
	// Empty list
	$("#alllabs ul").empty();

	var labResults = getQueryResults(searchText);
	for (var i = 0; i < labResults.length; i++) {
		var htmlString = createHtmlString(labResults[i]);

		//add html to list
		$("#alllabs ul").append(htmlString);

		// Check appropriate check boxesd\
		if (labResults[i].qualified) {
			$('#' + labResults[i]._id).prop('checked', true);
		}
	}
}

function getQueryResults(searchText) {
	var labResults =[];
	if (searchText ==  "") {
		return labs;
	} else {
		for (var i = 0; i < labs.length; i++) {
			if (labs[i].searchString.includes(searchText.toLowerCase())) {
				labResults.push(labs[i]);
			}
		}
		return labResults;
	}
}

$(document).on('change', ':checkbox', function() {
    updateAvailability(this.id, this.checked);
});
