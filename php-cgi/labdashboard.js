function initLabDashboard() {
  var userId = localStorage.getItem('_id');
	if (userId == null) {
		window.location.href = 'login.html';
	}

	var labId = localStorage.getItem('lab_id');

  var request = $.ajax({
    url: 'php-cgi/users.php?lab_id=' + labId + '&type=qualified',
    type: 'get',
    dataType: "json",
  });

  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    var users = data.users;
    if (response.includes("Success")) {
      var htmlString = "";
      var separatorString = "<div class='separator'> - </div>";

      for (var i = 0; i < users.length; i++) {
        htmlString += "<li><div>";
        htmlString += ("<div class='name'>" + users[i].name + "</div>");
        htmlString += separatorString;
        htmlString += ("<div class='email'>" + users[i].email + "</div>");
        htmlString += separatorString;
        htmlString += ("<div class='phone'>" + users[i].phone + "</div>");
        htmlString += "</div></li>";

        //add html to list
        $("#qualifiedTas ul").append(htmlString);

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
