function initDashboard() {
	var userId = localStorage.getItem('_id');
	if (userId == null) {
		window.location.href = 'login.html';
	} else {
		var name = localStorage.getItem('name');
		$("p").text(name);
	}

	// Retrieve user info from local storage
	var name = localStorage.getItem('name');
	var email = localStorage.getItem('email');
	var phone = localStorage.getItem('phone');

	$('input[name="Name"]').val(name);
	$('input[name="Email"]').val(email);
	$('input[name="Phone"]').val(phone);

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
        htmlString += "<li><div>";
        htmlString += ("<div class='lab'>" + labs[i].title + "</div>");
        htmlString += separatorString;
        htmlString += ("<div class='time'>" + labs[i].labTime + "</div>");
		htmlString += ("<button onClick=goToLabDashboard('" + labs[i]._id + "');>MORE</button>");
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

function editUser() {
	var _id = localStorage.getItem('_id');

	var name = document.getElementByName('name').value;
	var email = document.getElementByName('email').value;
	var phone = document.getElementByName('phone').value;

	var request = $.ajax({
		url: 'php-cgi/users.php?_id=' + _id + '&name=' + name + '&email=' + email + '&phone=' + phone,
		type: 'PUT',
		dataType: "json",
	});

	request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    if (response.includes("Success")) {
			alert("Account details updated!");
    } else {
      alert("Error");
    }
  });
  request.fail(function() {
    alert("Failed");
  });
}

function goToLabDashboard(lab_id) {
	localStorage.setItem('lab_id', lab_id);
	window.location.href = "labdashboard.html";
}
