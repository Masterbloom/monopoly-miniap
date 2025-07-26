
let state = {};
const apiUrl = "https://script.google.com/macros/s/AKfycbwBqoP2y91dv0PfUqmyZSezh0ytFcB9H5Ts8gmT8EUDo_WLPXZ4KxC0nf-y8u187jSBIw/exec?action=state";

async function fetchState() {
  const res = await fetch(apiUrl);
  state = await res.json();
  render();
}

function render() {
  const game = document.getElementById("game");
  game.innerHTML = "";

  // Игровое поле
  const field = document.createElement("div");
  field.className = "field";
  state.cells.forEach((cell, i) => {
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";
    cellDiv.innerHTML = cell.name;

    // Закрашиваем, если есть владелец
    if (cell.owner) {
      const player = state.players.find(p => p.id === cell.owner);
      if (player) {
        cellDiv.style.backgroundColor = player.color;
        cellDiv.style.color = "black";
      }
    }

    // Позиции игроков
    state.players.forEach(p => {
      if (p.position === i) {
        const pawn = document.createElement("div");
        pawn.className = "pawn";
        pawn.style.backgroundColor = p.color;
        pawn.title = p.name;
        cellDiv.appendChild(pawn);
      }
    });

    field.appendChild(cellDiv);
  });

  // Игроки
  const bank = document.createElement("div");
  bank.className = "bank";
  state.players.forEach(p => {
    const el = document.createElement("div");
    el.innerText = `${p.name}: ${p.money}₽`;
    el.style.color = p.color;
    bank.appendChild(el);
  });

  // Лог
  const log = document.createElement("div");
  log.className = "log";
  state.log.forEach(entry => {
    const p = document.createElement("p");
    p.innerText = entry;
    log.appendChild(p);
  });

  // Кнопки
  const controls = document.createElement("div");
  controls.className = "controls";
  ["/roll", "/buy", "/sell", "/endturn"].forEach(cmd => {
    const btn = document.createElement("button");
    btn.innerText = cmd;
    btn.onclick = () => sendCommand(cmd);
    controls.appendChild(btn);
  });

  game.appendChild(field);
  game.appendChild(bank);
  game.appendChild(controls);
  game.appendChild(log);
}

function sendCommand(cmd) {
  Telegram.WebApp.sendData(cmd);
}

Telegram.WebApp.ready();
fetchState();
