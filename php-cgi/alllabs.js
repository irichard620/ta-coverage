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
    var labs = data.labs;
    if (response.includes("Success")) {
      var htmlString = "";
      var separatorString = "<div class='separator'> - </div>";

      for (var i = 0; i < labs.length; i++) {
        htmlString += "<li><div>";
        htmlString += ("<div class='lab'>" + labs[i].title + "</div>");
        htmlString += separatorString;
        hhtmlString += ("<div class='time'>" + labs[i].dayOfWeek + " " +
				labs[i].startTime + "-" + labs[i].endTime + "</div>");
        htmlString += ("<input id='" + labs[i]._id + "' class='checkbox' type='checkbox'>");
        htmlString += "</div></li>";

        //add html to list
        $("#alllabs ul").append(htmlString);

        // Check appropriate check boxesd\
        if (labs[i].qualified) {
					$('#' + labs[i]._id).prop('checked', true);
				}

        htmlString = "";  // Reset htmlstring for next iteration (lab)
      }

    } else {
        alert("Error");
    }
  });
  request.fail(function() {
    alert("Failed");
  });
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

$(document).on('change', ':checkbox', function() {
    updateAvailability(this.id, this.checked);
});

//Lab object
//_id
//title
//labTime
//qualified  (boolean)
