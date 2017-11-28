function initPage() {
  var user_id = localStorage.getItem('_id');
	if (user_id == null) {
		window.location.href = 'login.html';
	}
}

function createLab() {
  var user_id = localStorage.getItem('_id');

  var title = document.getElementById('title').value;
  var dayOfWeek = document.getElementById('daySelect').value;
  var startTime = document.getElementById('startTime').value;
  var endTime = document.getElementById('endTime').value;
  var validThrough = document.getElementById('validThrough').value;

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
    type: 'post',
    dataType: "json",
    data: {type: 'create', user_id: user_id, title: title, dayOfWeek: dayOfWeek,
    startTime: startTime, endTime: endTime, validThrough: validThrough}
  });

  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    if (response.includes("Success")) {
      alert("Lab successfully created!");
      window.location.href = "dashboard.html";
    } else {
      alert(response);
    }
  });
  request.fail(function() {
    alert("Failed");
  });
}
