let recording = false;
let events = [];
let replayIndex = 0;
let startTime = 0;
let replayInterval;

document.getElementById('startRecord').addEventListener('click', () => {
    if (recording) return;
    recording = true;
    events = [];
    startTime = Date.now();
    document.getElementById('status').textContent = 'Status: Recording...';
    document.getElementById('startRecord').disabled = true;
    document.getElementById('stopRecord').disabled = false;
    document.getElementById('replay').disabled = true;

    // Event listeners for recording inputs
    document.addEventListener('mousemove', recordMouseMove);
    document.addEventListener('click', recordClick);
    document.addEventListener('keydown', recordKeyPress);
});

document.getElementById('stopRecord').addEventListener('click', () => {
    if (!recording) return;
    recording = false;
    document.getElementById('status').textContent = 'Status: Recording Stopped';
    document.getElementById('startRecord').disabled = false;
    document.getElementById('stopRecord').disabled = true;
    document.getElementById('replay').disabled = false;

    // Remove event listeners after recording stops
    document.removeEventListener('mousemove', recordMouseMove);
    document.removeEventListener('click', recordClick);
    document.removeEventListener('keydown', recordKeyPress);
});

document.getElementById('replay').addEventListener('click', () => {
    if (replayInterval) clearInterval(replayInterval);
    replayIndex = 0;
    const totalDuration = events.length > 0 ? events[events.length - 1].timestamp - startTime : 0;
    
    replayInterval = setInterval(() => {
        if (replayIndex >= events.length) {
            clearInterval(replayInterval);
            document.getElementById('status').textContent = 'Status: Replay Complete';
            return;
        }
        
        const event = events[replayIndex];
        const timeElapsed = event.timestamp - startTime;
        setTimeout(() => {
            if (event.type === 'mousemove') {
                dispatchMouseMove(event.clientX, event.clientY);
            } else if (event.type === 'click') {
                dispatchClick(event.clientX, event.clientY);
            } else if (event.type === 'keydown') {
                dispatchKeyPress(event.key);
            }
            replayIndex++;
        }, timeElapsed);
    }, 10); // Adjust timing for smooth playback
});

function recordMouseMove(e) {
    if (recording) {
        events.push({ type: 'mousemove', clientX: e.clientX, clientY: e.clientY, timestamp: Date.now() });
    }
}

function recordClick(e) {
    if (recording) {
        events.push({ type: 'click', clientX: e.clientX, clientY: e.clientY, timestamp: Date.now() });
    }
}

function recordKeyPress(e) {
    if (recording) {
        events.push({ type: 'keydown', key: e.key, timestamp: Date.now() });
    }
}

function dispatchMouseMove(x, y) {
    const event = new MouseEvent('mousemove', { clientX: x, clientY: y });
    document.dispatchEvent(event);
}

function dispatchClick(x, y) {
    const event = new MouseEvent('click', { clientX: x, clientY: y });
    document.dispatchEvent(event);
}

function dispatchKeyPress(key) {
    const event = new KeyboardEvent('keydown', { key });
    document.dispatchEvent(event);
}
