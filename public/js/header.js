window.onload = function() {
  var pathname = document.URL.match(/[^\/]+/g)[2];
  var active_link = document.getElementById(pathname);
  active_link.className = "active";
  active_link.href = "/"
}