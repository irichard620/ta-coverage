function createListOfTAs() {
  var request = $.ajax({
    url: 'php-cgi/users.php',
    type: 'get',
    dataType: "json"
  });
  request.done(function (data, textStatus, jqxhr) {
  	var response = data.response;
	var users = data.users;
	if (response.includes("Success")) {
		alert(users);
	} else {
		alert("Error");
	}
  });
  request.fail(function() {
  	alert("Failed");
  });
}
