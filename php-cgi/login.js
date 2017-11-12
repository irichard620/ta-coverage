function login() {
  var EMAIL = $('#email').val();
  var PASSWORD = $('#password').val();
  var request = $.ajax({
    url: 'php-cgi/login.php?email=' + EMAIL + '&password=' + PASSWORD,
    type: 'get',
    dataType: "json"
  });
  request.done(function (data, textStatus, jqxhr) {
    var response = data.response;
    var user = data.user;
    if (response.includes("Success")) {
		localStorage.setItem('_id', user._id);
		localStorage.setItem('name', user.name);
		localStorage.setItem('email', user.email);
		localStorage.setItem('phone', user.phone);
    	window.location.href = "dashboard.html";
    } else {
		alert(response);
    }
  });
  request.fail(function() {
  	alert("Failed");
  });
}
