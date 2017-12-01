function initDashboard() {
	var userId = localStorage.getItem('_id');
	if (userId == null) {
		window.location.href = 'login.html';
	}

	// Retrieve user info from local storage
	var name = localStorage.getItem('name');
	var email = localStorage.getItem('email');
	var phone = localStorage.getItem('phone');

	document.getElementById('name').value = name;
	document.getElementById('email').innerHTML = email;
	document.getElementById('phone').value = phone;

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

      for (var i = 0; i < labs.length; i++) {
        htmlString += "<li><div>";
        htmlString += ("<div class='lab'>" + labs[i].title + "</div>");
        htmlString += ("<div class='separator'> | </div>");
				htmlString += ("<div class='time'>" + labs[i].dayOfWeek + " " +
				labs[i].startTime + "-" + labs[i].endTime + "</div>");
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

      for (var i = 0; i < labs.length; i++) {
        htmlString += "<li><div>";
        htmlString += ("<div class='lab'>" + labs[i].title + "</div>");
        htmlString += ("<div class='separator'> | </div>");
        htmlString += ("<div class='time'>" + labs[i].dayOfWeek + " " +
				labs[i].startTime + "-" + labs[i].endTime + "</div>");
				htmlString += ("<div class='separator'></div>");
				htmlString += ("<button class='labButton' onClick=goToLabDashboard('" + labs[i]._id + "');>MANAGE</button>");
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

	var name = document.getElementById('name').value;
	var phone = document.getElementById('phone').value;

	var request = $.ajax({
		url: 'php-cgi/users.php?',
		type: 'put',
		dataType: "json",
		data: {_id: _id, name: name, phone: phone}
	});

	request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    if (response.includes("Success")) {
			alert("Account details updated!");
			localStorage.setItem('name', name);
			localStorage.setItem('phone', phone);
    } else {
      alert(response);
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
