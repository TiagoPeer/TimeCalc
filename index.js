var targetHour = document.getElementById("targetHours");
var targetMinutes = document.getElementById("targetMinutes");
var targetSeconds = document.getElementById("targetSeconds");
var targetMiliseconds = document.getElementById("targetMiliseconds");

var valueHour = document.getElementById("valueHours");
var valueMinutes = document.getElementById("valueMinutes");
var valueSeconds = document.getElementById("valueSeconds");
var valueMiliseconds = document.getElementById("valueMiliseconds");

var btn = document.getElementById("calc");

var resultInput = document.getElementById("result");
var resultDayInput = document.getElementById("resultDay");

btn.addEventListener("click", calculateDifference);

function getCurrentDay() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  return dd;
}

function calculateDifference() {
  var resultHour = targetHour.value - valueHour.value;
  var resultMinutes = targetMinutes.value - valueMinutes.value;
  var resultSeconds = targetSeconds.value - valueSeconds.value;
  var resultMiliseconds = targetMiliseconds.value - valueMiliseconds.value;

  var days = Math.ceil((resultHour * -1) / 24);
  var currentDay = new Date().getDay();

  console.log(currentDay);

  if (resultHour < 0) {
    resultHour = days * 24 + resultHour;
  }

  if (resultMinutes < 0) {
    resultHour -= 1;
    resultMinutes = 60 + resultMinutes;
  }

  if (resultSeconds < 0) {
    resultMinutes -= 1;
    resultSeconds = 60 + resultSeconds;
  }

  if (resultMiliseconds < 0) {
    resultSeconds -= 1;
    resultMiliseconds = 1000 + resultMiliseconds;
  }

  var resultDay = getCurrentDay() - days;

  console.log(resultDay);

  var resultText =
    resultHour +
    " horas " +
    resultMinutes +
    " minutos " +
    resultSeconds +
    " segundos " +
    resultMiliseconds +
    " milisegundos";

  resultDayInput.value = "Dia " + resultDay;
  resultInput.value = resultText;
}
