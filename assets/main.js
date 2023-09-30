let coordInputs = $(".coords_input");
let targetCoordsInput = $(".target_coords");
let calculateBtn = $("#calculate_btn");
let unitsInputs = $(".unitsInput");
let timeInput = $("#time_input");
let addOriginBtn = $("#add_origin");
let removeOriginBtn = $("#remove_origin");

function registerEventHandlers() {
  coordInputs.bind("keyup", function (e) {
    let value = $(this).val();
    if (e.which !== 8) {
      if (value.length == 3) {
        value = value + "|";
      }
    }

    $(this).val(value);
  });

  calculateBtn.on("click", function () {
    calculateTimes();
  });

  addOriginBtn.on("click", function () {
    addNewOrigin();
  });

  removeOriginBtn.on("click", function () {
    removeOrigin();
  });
}

function addNewOrigin() {
  let template = $(".coords_input_tr:eq(0)").clone();
  $(".coords_input_tr").last().after(template);
}

function removeOrigin() {
  $(".coords_input_tr").last().remove();
}

function initField() {
  var currentDate = new Date();

  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  var milliseconds = currentDate.getMilliseconds();

  var formattedDay = day < 10 ? "0" + day : day;
  var formattedMonth = month < 10 ? "0" + month : month;
  var formattedHours = hours < 10 ? "0" + hours : hours;
  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  var formattedDate = formattedDay + "-" + formattedMonth + "-" + year;
  var formattedTime = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds + ":" + milliseconds;

  var formattedDateTime = formattedDate + " " + formattedTime;

  timeInput.val(formattedDateTime);
}

function calculateTimes() {
  var commands = [];

  let selectedUnits = [];
  unitsInputs.each(function () {
    if ($(this).is(":checked")) {
      selectedUnits.push($(this).val());
    }
  });

  if (selectedUnits.length === 0) {
    showError("units_error_message", "Escolha pelo menos uma unidade!");
    return;
  }

  $(".origin_coords").each(function () {
    let originCoordsValue = $(this).val();
    let originCoords = originCoordsValue.split("|");
    let targetCoords = targetCoordsInput.val().split("|");

    var [travelHours, travelMinutes, travelSeconds] = calculateTravelTime(originCoords[0], originCoords[1], targetCoords[0], targetCoords[1], selectedUnits);
    var travelDays = 0;
    if (travelHours > 24) {
      travelDays = Math.floor(totalHours / 24);
      travelHours = totalHours % 24;
    }

    var [targetDay, targetMonth, targetYear, targetHours, targetMinutes, targetSeconds, targetMilliseconds] = parseDate(timeInput.val());

    var resultDay = targetDay - travelDays;
    var resultMonth = targetMonth;
    var resultYear = targetYear;
    var resultHours = targetHours - travelHours;
    var resultMinutes = targetMinutes - travelMinutes;
    var resultSeconds = targetSeconds - travelSeconds;
    var resultMiliseconds = targetMilliseconds;

    if (resultHours < 0) {
      resultHours = resultDay * 24 + resultHour;
    }

    if (resultMinutes < 0) {
      resultHours -= 1;
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

    var commandTime = `${resultDay}-${resultMonth}-${resultYear} ${addZeroIsLessThanTen(resultHours)}:${addZeroIsLessThanTen(resultMinutes)}:${addZeroIsLessThanTen(
      resultSeconds
    )}:${resultMiliseconds}`;

    commands.push({ origin: originCoordsValue, command: commandTime });
  });

  generateHtml(commands);
}

function generateHtml(commands) {
  let commandsHtml = ``;
  $(commands).each(function () {
    commandsHtml += `
    <tr>
      <th colspan="2">${$(this)[0].origin}</th>
    </tr>
    <tr>
      <td>Data de envio</td>
      <td>${$(this)[0].command}</td>
    </tr>
    `;
  });
  let html = `
    <table style="width:100%;">
    <tbody>
        <tr>
          <td>
            <div class="vis">
              <table style="width:100%;">
                <tbody>
                  ${commandsHtml}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  clearErrorMessages();
  $("#results").html(html);
}

function getVillages() {
  fetch("assets/villages.txt")
    .then((response) => response.text())
    .then((text) => console.log(text));
  // outputs the content of the text file
}

function parseDate(date) {
  var parts = date.split(/[ :\-]+/);

  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);
  var hours = parseInt(parts[3], 10);
  var minutes = parseInt(parts[4], 10);
  var seconds = parseInt(parts[5], 10);
  var milliseconds = parseInt(parts[6], 10);

  return [day, month, year, hours, minutes, seconds, milliseconds];
}

function showError(elem, errorMessage) {
  $("#" + elem).append(`<p>${errorMessage}</p>`);
}

function clearErrorMessages() {
  $(".error_message").each(function () {
    $(this).html("");
  });
}

initField();
registerEventHandlers();
