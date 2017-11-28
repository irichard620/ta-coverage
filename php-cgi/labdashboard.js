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
      document.getElementById('title').value = lab.title;
      document.getElementById('daySelect').value = lab.dayOfWeek;

      // Set start time
      var meridianStart = lab.startTime.slice(-2);
      var startTime = lab.startTime.slice(0, -2);
      var timesplitStart = startTime.split(':');
      var hoursStart = parseInt(timesplitStart[0]);
      var minutesStart = parseInt(timesplitStart[1]);
      if (meridianStart == "PM") {
        if (hoursStart != 12) {
          hoursStart += 12;
        }
      } else if (meridianStart == "AM") {
        if (hoursStart == 12) {
          hoursStart = 0;
        }
      }
      hoursString = "";
      if (hoursStart < 10) { hoursString = "0" + hoursStart; }
      else { hoursString = hoursStart; }
      minutesString = "";
      if (minutesStart < 10) { minutesString = "0" + minutesStart; }
      else { minutesString = minutesStart; }
      document.getElementById('startTime').value = hoursString + ":" + minutesString;

      // Set end time
      var meridianEnd = lab.endTime.slice(-2);
      var endTime = lab.endTime.slice(0, -2);
      var timesplitEnd = endTime.split(':');
      var hoursEnd = parseInt(timesplitEnd[0]);
      var minutesEnd = parseInt(timesplitEnd[1]);
      if (meridianEnd == "PM") {
        if (hoursEnd != 12) {
          hoursEnd += 12;
        }
      } else if (meridianEnd == "AM") {
        if (hoursEnd == 12) {
          hoursEnd = 0;
        }
      }
      hoursString = "";
      if (hoursEnd < 10) { hoursString = "0" + hoursEnd; }
      else { hoursString = hoursEnd; }
      minutesString = "";
      if (minutesEnd < 10) { minutesString = "0" + minutesEnd; }
      else { minutesString = minutesEnd; }
      document.getElementById('endTime').value = hoursString + ":" + minutesString;
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

function editLab() {
  var user_id = localStorage.getItem('_id');
  var lab_id = localStorage.getItem('lab_id');
  var title = document.getElementById('title').value;
  var dayOfWeek = document.getElementById('daySelect').value;
  var startTime = document.getElementById('startTime').value;
  var endTime = document.getElementById('endTime').value;

  // Make start time and end time correct format
  var timesplitStart = startTime.split(':');
  var meridianStart = "";
  var hoursStart = timesplitStart[0];
  var minutesStart = timesplitStart[1];
  if (hoursStart > 12) {
    meridianStart = "PM";
    hoursStart -= 12;
  } else if (hoursStart < 12) {
    meridianStart = "AM";
    if (hoursStart == 0) {
      hoursStart = 12;
    }
  } else {
    meridianStart = "PM";
  }
  startTime = hoursStart + ":" + minutesStart + meridianStart;


  var timesplitEnd = endTime.split(':');
  var meridianEnd = "";
  var hoursEnd = timesplitEnd[0];
  var minutesEnd = timesplitEnd[1];
  if (hoursEnd > 12) {
    meridianEnd = "PM";
    hoursEnd -= 12;
  } else if (hoursEnd < 12) {
    meridianEnd = "AM";
    if (hoursEnd == 0) {
      hoursEnd = 12;
    }
  } else {
    meridianEnd = "PM";
  }
  endTime = hoursEnd + ":" + minutesEnd + meridianEnd;

  var request = $.ajax({
    url: 'php-cgi/labs.php',
    type: 'put',
    dataType: "json",
    data: {user_id: user_id, lab_id: lab_id, title: title, dayOfWeek: dayOfWeek,
    startTime: startTime, endTime: endTime}
  });

  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    if (response.includes("Success")) {
      alert("Lab details successfully updated!");
    } else {
      alert(response);
    }
  });
  request.fail(function() {
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
