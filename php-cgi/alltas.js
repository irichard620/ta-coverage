function formatPhoneNumber(s) {
  var s2 = (""+s).replace(/\D/g, '');
  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  return (!m) ? s : "(" + m[1] + ") " + m[2] + "-" + m[3];
}

function createListOfTAs() {
  var userId = localStorage.getItem('_id');
	if (userId == null) {
		window.location.href = 'login.html';
	}

  var request = $.ajax({
    url: 'php-cgi/users.php?type=all',
    type: 'get',
    dataType: "json"
  });
  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    var users = data.users;
    if (response.includes("Success")) {
      var htmlString = "";
      var separatorString = "<div class='separator'> | </div>";

      for (var i = 0; i < users.length; i++) {
        htmlString += "<li><div>";
        htmlString += ("<div class='lab'>" + users[i].name + "</div>");
        htmlString += separatorString;
        htmlString += ("<div class='time'>" + users[i].email + "</div>");
        htmlString += separatorString;
        htmlString += ("<div class='lab'>" + formatPhoneNumber(users[i].phone) + "</div>");
        htmlString += "</div></li>";
      }

      $("#alltas ul").append(htmlString);
    } else {
	     alert("Error");
    }
  });
  request.fail(function() {
  	alert("Failed");
  });
}
