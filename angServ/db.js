// //

// function countdown(endtime){

//   var etime = endtime;
//   // Set the date we're counting down to
//   var countDownDate = new Date(etime).getTime();

//   // Update the count down every 1 second
//   var x = setInterval(function() {

//   // Get todays date and time
//   var now = new Date().getTime();

//   // Find the distance between now and the count down date
//   var distance = countDownDate - now;

//   // Time calculations for days, hours, minutes and seconds
//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//   // Display the result in the element with id="demo"
//   // document.getElementById("demo").innerHTML = days + "d " + hours + "h "
//   // + minutes + "m " + seconds + "s ";
//   if (days > 0) {
//     console.log(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
//   }  else if (hours > 0) {
//     console.log(hours + "h " + minutes + "m " + seconds + "s ");
//   } else if (minutes > 0) {
//     console.log(minutes + "m " + seconds + "s ");
//   } else{
//     console.log(seconds + "s ");
//   }

//   // If the count down is finished, write some text
//   if (distance < 0) {
//     clearInterval(x);
//     // document.getElementById("demo").innerHTML = "EXPIRED";
//     console.log('EXPIRED')
//     print(distance);
//   }
// }, 1000);
// }
// var b = "2019-03-14T20:00:00.155+07:00"
// var a = "Mar 15, 2019 00:00:00";
// // countdown(b);

// console.log(Date.now());


function generate(n) {
  var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if ( n > max ) {
          return generate(max) + generate(n - max);
  }

  max        = Math.pow(10, n+add);
  var min    = max/10; // Math.pow(10, n) basically
  var number = Math.floor( Math.random() * (max - min + 1) ) + min;

  console.log(number);
  return ("" + number).substring(add);
}

generate(1)
