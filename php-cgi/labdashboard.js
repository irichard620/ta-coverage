function formatPhoneNumber(s) {
  var s2 = (""+s).replace(/\D/g, '');
  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  return (!m) ? s : "(" + m[1] + ") " + m[2] + "-" + m[3];
}

// This function called when lab dashboard first loads
function initLabDashboard() {
  // Check if logged in
  var userId = localStorage.getItem('_id');
  if (userId == null) {
		window.location.href = 'login.html';
  }

  // Get lab ID from local storage
  var labId = localStorage.getItem('lab_id');

  // Send first request to retrieve lab info
  var request = $.ajax({
    url: 'php-cgi/labs.php?user_id=' + userId + '&type=byId&lab_id=' + labId,
    type: 'get',
    dataType: "json",
  });

  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;

    // Get lab from response
    var lab = data.lab;
    if (response.includes("Success")) {
      // If success, get title, day of week
      document.getElementById('title').innerHTML = "Title: " + lab.title;
      document.getElementById('dayOfWeek').innerHTML = "Day of Week: " + lab.dayOfWeek;
      document.getElementById('startTime').innerHTML = "Start Time: " + lab.startTime;
      document.getElementById('endTime').innerHTML = "End Time: " + lab.endTime;
    } else {
        alert("Error");
    }
  });
  request.fail(function() {
    alert("Failed");
  });

  // Get qualified TAs for this lab section
  var request2 = $.ajax({
    url: 'php-cgi/users.php?lab_id=' + labId + '&type=qualified',
    type: 'get',
    dataType: "json",
  });

  request2.done(function (data, textStatus, jqxhr) {
    var response = data.response;

    // Get users from object
    var users = data.users;
    if (response.includes("Success")) {
      // If success, inject
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

        //add html to list
        $("#qualifiedTas ul").append(htmlString);

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

function shareLabSection() {
  var user_id = localStorage.getItem('_id');
  var lab_id = localStorage.getItem('lab_id');
  var email = document.getElementById('email').value;

  var request = $.ajax({
    url: 'php-cgi/labs.php',
    type: 'post',
    dataType: "json",
    data: {type: 'share', user_id: user_id, lab_id: lab_id, email: email}
  });

  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    if (response.includes("Success")) {
      alert("User " + email + " added as a manager of this lab section");
    } else {
      alert(response);
    }
  });
  request.fail(function() {
    alert("Failed");
  });
}
