function initLabDashboard() {
  var userId = localStorage.getItem('_id');
  if (userId == null) {
		window.location.href = 'login.html';
  }

  var labId = localStorage.getItem('lab_id');

  var request = $.ajax({
    url: 'php-cgi/labs.php?user_id=' + userId + '&type=byId&lab_id=' + labId,
    type: 'get',
    dataType: "json",
  });

  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    var lab = data.lab;
    if (response.includes("Success")) {
      document.getElementById('title').value = lab.title;
      document.getElementById('daySelect').value = lab.dayOfWeek;

      // Set start time
      var meridianStart = lab.startTime.slice(-2);
      var timesplitStart = lab.startTime.split(':');
      var hoursStart = timesplitStart[0];
      var minutesStart = timesplitStart[1];
      if (meridianStart == "PM") {
        if (hoursStart != 12) {
          hoursStart += 12;
        }
      } else if (meridianStart == "AM") {
        if (hoursStart == 12) {
          hoursStart = 0;
        }
      }
      document.getElementById('startTime').value = hoursStart + ":" + minutesStart;

      // Set end time
      var meridianEnd = lab.endTime.slice(-2);
      var timesplitEnd = lab.endTime.split(':');
      var hoursEnd = timesplitEnd[0];
      var minutesEnd = timesplitEnd[1];
      if (meridianEnd == "PM") {
        if (hoursEnd != 12) {
          hoursEnd += 12;
        }
      } else if (meridianEnd == "AM") {
        if (hoursEnd == 12) {
          hoursEnd = 0;
        }
      }
      document.getElementById('endTime').value = hoursEnd + ":" + minutesEnd;
    } else {
        alert("Error");
    }
  });
  request.fail(function() {
    alert("Failed");
  });

  var request2 = $.ajax({
    url: 'php-cgi/users.php?lab_id=' + labId + '&type=qualified',
    type: 'get',
    dataType: "json",
  });

  request2.done(function (data, textStatus, jqxhr) {
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
