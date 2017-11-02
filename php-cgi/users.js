function createListOfTAs() {
  $.ajax({
    url: 'php-cgi/users.php',
    type: 'get',
    dataType: "json",
    success: function(output) {
      alert(output);
    }
  });
}
