var countDownDate = new Date("Jan 5, 2020 15:37:25").getTime();

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
  // Display the result in the element with id="demo"
  document.getElementById("timer").innerHTML = days + " DAYS\n" + hoursStr + ":"
  + minutesStr + ":" + secondsStr + "\n";
}, 1000);
