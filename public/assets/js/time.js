function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    const displayHours = hours % 12 || 12;

    // Add leading zeros
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;

    timeElement.textContent = `${displayHours}:${displayMinutes}:${displaySeconds} ${ampm}`;
}

// Update time immediately
updateTime();

// Update time every second
setInterval(updateTime, 1000);
