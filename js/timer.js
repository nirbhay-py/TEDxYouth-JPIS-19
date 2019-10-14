var countDownDate = new Date("Jan 17, 2020 9:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {
  // Get today's date and time
  var now = new Date().getTime();
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  var secondsStr = seconds.toString();
  var minutesStr = minutes.toString();
  var hoursStr = hours.toString();
  if(seconds<10){
    secondsStr = "0"+seconds.toString();
  }
  if(hours<10){
    hoursStr = "0"+hours.toString();
  }
  if(minutes<10){
    minutesStr = "0"+minutes.toString();
  }
  console.log(hours)
  var string = days + "\nDAYS" + "\n"+hoursStr + ":"
  + minutesStr + ":" + secondsStr + "\n";
  console.log(string);
  document.getElementById("timer").innerHTML = string;
}, 1000);
