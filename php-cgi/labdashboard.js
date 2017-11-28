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
      document.getElementById('labTime').value = lab.labTime;
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
  var labTime = document.getElementById('labTime').value;

  var request = $.ajax({
    url: 'php-cgi/labs.php',
    type: 'put',
    dataType: "json",
    data: {user_id: user_id, lab_id: lab_id, title: title, labTime: labTime}
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
