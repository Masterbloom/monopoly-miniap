
const API = 'https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbwmWx18AaQQMsah6ZySQibqGbymuglyFpq7JPBiKzUfDwFtc3IPcWuJsHSgDqeuZ6P3Dw/exec';

const myId = window.Telegram.WebApp.initDataUnsafe.user?.id.toString();
const myName = window.Telegram.WebApp.initDataUnsafe.user?.first_name || 'Гость';

const boardEl = document.getElementById('board');
const bankEl = document.getElementById('bank');
const logEl = document.getElementById('log');

const rollBtn = document.getElementById('rollBtn');
const buyBtn = document.getElementById('buyBtn');
const endBtn = document.getElementById('endBtn');
const sellBtn = document.getElementById('sellBtn');

function sendAction(action) {
  fetch(API, {
    method: 'POST',
    body: JSON.stringify({ message: { chat: { id: myId }, from: { id: myId, first_name: myName }, text: '/' + action } }),
  });
}

rollBtn.onclick = () => sendAction('roll');
buyBtn.onclick = () => sendAction('buy');
endBtn.onclick = () => sendAction('endturn');
sellBtn.onclick = () => sendAction('sell');

function refresh() {
  fetch(API + '?action=state')
    .then(res => res.json())
    .then(data => {
      boardEl.innerHTML = '';
      data.cells.forEach((cell, i) => {
        const cellEl = document.createElement('div');
        cellEl.className = 'cell';
        cellEl.innerHTML = `<div>${cell.name}</div>`;
        const owners = data.players.filter(p => p.properties.includes(cell.name));
        if (owners.length > 0) {
          const owner = owners[0];
          cellEl.classList.add('owner-' + getColor(owner.id));
        }
        data.players.forEach(p => {
          if (p.position === i) {
            const token = document.createElement('div');
            token.className = 'token';
            token.innerText = p.name[0];
            cellEl.appendChild(token);
          }
        });
        boardEl.appendChild(cellEl);
      });

      const me = data.players.find(p => p.id === myId);
      if (me) {
        bankEl.innerHTML = `<strong>${me.name}</strong>: ${me.money}₽`;
        const isMyTurn = data.settings?.current_turn === myId;
        const phase = data.settings?.phase;
        rollBtn.style.display = (isMyTurn && phase === 'waiting_roll') ? 'inline-block' : 'none';
        buyBtn.style.display = (isMyTurn && phase === 'waiting_action') ? 'inline-block' : 'none';
        endBtn.style.display = (isMyTurn && phase === 'waiting_action') ? 'inline-block' : 'none';
        sellBtn.style.display = (me.money < 0 && me.properties.length > 0) ? 'inline-block' : 'none';
      }

      logEl.innerHTML = '<h3>Последние действия:</h3><ul>' +
        data.log.map(item => `<li>${item}</li>`).join('') + '</ul>';
    });
}

function getColor(id) {
  const colors = ['yellow', 'green', 'blue'];
  const hash = parseInt(id.slice(-2), 10);
  return colors[hash % 3];
}

setInterval(refresh, 3000);
