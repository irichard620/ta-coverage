function register() {
  var NAME = $('#name').val();
  var EMAIL = $('#email').val();
  var PASSWORD = $('#password').val();
  var PHONE = $('#phone').val();
  var CODE = $('#accesscode').val();
  $.post('register.php', { name: NAME, email: EMAIL, password: PASSWORD, phone: PHONE, code: CODE }).done(function(data) {
    alert(data);
  });
}
