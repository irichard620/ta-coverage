function register() {
  $.post('register.php?name=' +
    $('#name').val() + '&email=' +
    $('#email').val() + '&password=' +
    $('#password').val() + '&phone=' +
    $('#phone').val() + '&code=' +
    $('#accesscode').val()).done(function(result) {
      if (result == 'Success') {
        window.location.href = 'login.html';
      } else {
        alert(result);
      }
    });
}
