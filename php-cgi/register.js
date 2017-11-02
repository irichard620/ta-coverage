function register() {
  var NAME = $('#name').val();
  var EMAIL = $('#email').val();
  var PASSWORD = $('#password').val();
  var PHONE = $('#phone').val();
  var CODE = $('#accesscode').val();
  var request = $.ajax({
  	url: "php-cgi/register.php",
	async: true,
	crossDomain: true,
	timeout: 2000,
	type: "post",
	dataType: "json",       
	data: { name: NAME, email: EMAIL, password: PASSWORD, phone: PHONE, code: CODE }
  });
  request.done(function (data, textStatus, jqxhr) {
	var result = data.response;
	console.log(result);
	alert(result);
	if (result.includes("Success")) {
		alert("Success!");
		window.location.href = 'dashboard.html';
	} else {
		if (result.includes("MissingNameError")) {
			alert("You must enter your name to complete registration");
		} else if (result.includes("MissingEmailError")) {
			alert("You must enter an email address to complete registration");
		} else if (result.includes("MissingPasswordError")) {
			alert("You must enter a password to complete registration");
		} else if (result.includes("MissingPhoneError")) {
			alert("You must enter a phone number to complete registration");
		} else if (result.includes("MissingCodeError")) {
			alert("You must enter an access code to complete registration");
		} else if (result.includes("AccountExistsError")) {
			alert("An account with this email already exists. Please navigate to login");
		} else if (result.includes("DbError")) {
			alert("An error occurred with our web portal. Please try again later");
		} else if (result.includes("InvalidCodeError")) {
			alert("The access code you entered is invalid. Please try again");
		} else {
			alert("Unknown error occurred");
		}
	}
  });
  request.fail(function() {
  	console.log("Request failed");
  });
  request.always(function(data) {
  	console.log(data);
  });
}
