
const API_URL = 'https://script.google.com/macros/s/AKfycbwBqoP2y91dv0PfUqmyZSezh0ytFcB9H5Ts8gmT8EUDo_WLPXZ4KxC0nf-y8u187jSBIw/exec?action=state';

async function loadState() {
  const res = await fetch(API_URL);
  const data = await res.json();
  renderBoard(data.cells, data.players);
  renderPlayers(data.players);
  renderLog(data.log);
}

function renderBoard(cells, players) {
  const board = document.getElementById('board');
  board.innerHTML = '';
  cells.forEach((cell, i) => {
    const div = document.createElement('div');
    div.className = 'cell';
    if (cell.owner) {
      const player = players.find(p => p.id === cell.owner);
      if (player) div.classList.add(player.color);
    }
    div.innerHTML = `${i}<br>${cell.name}`;
    players.forEach(p => {
      if (parseInt(p.position) === i) {
        const pawn = document.createElement('div');
        pawn.className = 'pawn';
        pawn.innerText = '🎯';
        div.appendChild(pawn);
      }
    });
    board.appendChild(div);
  });
}

function renderPlayers(players) {
  const div = document.getElementById('players');
  div.innerHTML = players.map(p =>
    `<div><b style="color:${p.color}">${p.name}</b>: ${p.money}₽</div>`
  ).join('');
}

function renderLog(log) {
  document.getElementById('log').innerHTML = log.map(line => `<div>${line}</div>`).join('');
}

function sendCommand(cmd) {
  Telegram.WebApp.sendData(cmd);
}

window.addEventListener('load', loadState);
