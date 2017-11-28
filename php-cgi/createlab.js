function initPage() {
  var user_id = localStorage.getItem('_id');
	if (user_id == null) {
		window.location.href = 'login.html';
	}
}

function createLab() {
  var user_id = localStorage.getItem('_id');

  var title = document.getElementById('title').value;
  var dayOfWeek = document.getElementById('dayOfWeek').value;
  var startTime = document.getElementById('startTime').value;
  var endTime = document.getElementById('endTime').value;
  var validThrough = document.getElementById('validThrough').value;

  var request = $.ajax({
    url: 'php-cgi/labs.php?type=create',
    type: 'post',
    dataType: "json",
    data: {user_id: user_id, title: title, dayOfWeek: dayOfWeek,
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
