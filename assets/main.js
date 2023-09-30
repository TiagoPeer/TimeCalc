let coordInputs = $(".coords_input");
let targetCoordsInput = $(".target_coords");
let calculateBtn = $("#calculate_btn");
let unitsInputs = $(".unitsInput");
let timeInput = $("#time_input");
let addOriginBtn = $("#add_origin");
let removeOriginBtn = $("#remove_origin");

function debug() {
  $(".origin_coords").val("578|521");
  $(".target_coords").val("529|424");

  $("#unit_input_snob").prop("checked", true);
}

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

function validateCoordinates(coords) {
  const pattern = /^\d{3}\|\d{3}$/;
  return pattern.test(coords);
}

function calculateTimes() {
  var commands = [];
  let hasErrors = false;

  let selectedUnits = [];
  unitsInputs.each(function () {
    if ($(this).is(":checked")) {
      selectedUnits.push($(this).val());
    }
  });

  if (selectedUnits.length === 0) {
    hasErrors = true;
    showError("units_error_message", "Escolha pelo menos uma unidade!");
    return;
  }

  $(".origin_coords").each(function () {
    let originCoordsValue = $(this).val();
    let targetCoordsValue = $(this).val();
    if (!validateCoordinates(originCoordsValue) || !validateCoordinates(targetCoordsValue)) {
      hasErrors = true;
      showError("coords_error_message", "As coordenadas não estão corretas!");
      return;
    }
    let originCoords = originCoordsValue.split("|");
    let targetCoords = targetCoordsInput.val().split("|");

    var [travelHours, travelMinutes, travelSeconds] = calculateTravelTime(originCoords[0], originCoords[1], targetCoords[0], targetCoords[1], selectedUnits);
    var travelDays = 0;

    if (travelHours > 24) {
      travelDays = Math.ceil(travelHours / 24);
      travelHours = travelHours % 24;
    }

    var [targetDay, targetMonth, targetYear, targetHours, targetMinutes, targetSeconds, targetMilliseconds] = parseDate(timeInput.val());

    var resultDay = targetDay - travelDays;
    var resultMonth = targetMonth;
    var resultYear = targetYear;
    var resultHours = targetHours - travelHours;
    var resultMinutes = targetMinutes - travelMinutes;
    var resultSeconds = targetSeconds - travelSeconds;
    var resultMiliseconds = targetMilliseconds;

    if (resultMiliseconds < 0) {
      resultSeconds -= 1;
      resultMiliseconds = 1000 + resultMiliseconds;
    }

    if (resultSeconds < 0) {
      resultMinutes -= 1;
      resultSeconds = 60 + resultSeconds;
    }

    if (resultMinutes < 0) {
      resultHours -= 1;
      resultMinutes = 60 + resultMinutes;
    }

    if (resultHours < 0) {
      resultHours = 24 + resultHours;
    }

    let givenDate = new Date(`${resultYear}-${resultMonth}-${resultDay}`);

    const today = new Date();

    const isToday = givenDate.getDate() === today.getDate() && givenDate.getMonth() === today.getMonth() && givenDate.getFullYear() === today.getFullYear();
    console.log(resultHours);
    commands.push({
      origin: originCoordsValue,
      command: {
        day: isToday ? "hoje às" : `a ${resultDay}.${resultMonth} às`,
        hours: addZeroIsLessThanTen(resultHours),
        minutes: addZeroIsLessThanTen(resultMinutes),
        seconds: addZeroIsLessThanTen(resultSeconds),
        milliseconds: resultMiliseconds,
      },
    });
  });

  if (!hasErrors) generateHtml(commands);
}

async function generateHtml(commands) {
  const promises = $(commands)
    .map(async function () {
      let [x, y] = $(this)[0].origin.split("|");
      let info = await getVillageInfo(x, y);
      let command = $(this)[0].command;
      console.log(command.hours);
      if (info.id === 0) {
        return `
        <tr>
          <th colspan="2"><a>${info.villageName} (${$(this)[0].origin})</a></th>
        </tr>
        <tr>
          <td><strong>Data de envio:</strong></td>
          <td>${command.day} ${command.hours}:${command.minutes}:${command.seconds}:<span class="grey small">${command.milliseconds}</span></td>
        </tr>
      `;
      }

      return `
        <tr>
          <th colspan="2"><a target="_blank" href="https://pt94.tribalwars.com.pt/game.php?village=${info.id}&screen=place">${info.villageName} (${$(this)[0].origin})</a></th>
        </tr>
        <tr>
          <td><strong>Data de envio:</strong></td>
          <td>${command.day} ${command.hours}:${command.minutes}:${command.seconds}:<span class="grey small">${command.milliseconds}</span></td>
        </tr>
      `;
    })
    .get();

  const commandsHtml = await Promise.all(promises);

  const html = `
    <table style="width:100%;">
    <tbody>
      <tr>
        <td>
          <div class="vis">
            <table style="width:100%;">
              <tbody>
                ${commandsHtml.join("")}
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

async function getVillageInfo(x, y) {
  return fetch("https://tiagopeer.github.io/TimeCalc/assets/villages.txt")
    .then((response) => response.text())
    .then((text) => {
      var lines = text.split("\n");
      for (let i = 0; i <= lines.length; i++) {
        if (lines[i] !== undefined) {
          var fields = lines[i].split(",");
          if (fields[2] == x && fields[3] == y) return { id: fields[0], name: fields[1] };
        }
      }
    })
    .then((info) => {
      if (info === undefined) {
        return { id: 0, villageName: "Aldeia não encontrada" };
      }
      const villageName = decodeURIComponent(info.name.replace(/\+/g, " "));
      return { id: info.id, villageName };
    });
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

$(document).ready(function () {
  debug();
  initField();
  registerEventHandlers();
});
