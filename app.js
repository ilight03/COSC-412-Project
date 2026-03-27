let minutes = 25;
let seconds = 0;
let interval;

function startTimer() {
clearInterval(interval);
  interval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(interval); // stop when done
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }

    // update the display
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

document.querySelector('.start').addEventListener('click', startTimer);
document.querySelector('.end').addEventListener('click', stopTimer);