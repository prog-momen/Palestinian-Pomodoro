export class UI {
    constructor(app) {
        this.app = app;
    }

    createTimerElement() {
        const timersContainer = document.querySelector('.timers-container');
        const timerElement = document.createElement('div');
        timerElement.className = 'timer-card';
        timerElement.dataset.timerId = '1';
        timerElement.innerHTML = `
            <div class="timer-header">
                <input type="text" class="timer-name" value="مؤقت" placeholder="مؤقت" readonly>
                <div class="timer-controls">
                    <button class="btn-start"><i class="fas fa-play"></i></button>
                    <button class="btn-pause"><i class="fas fa-pause"></i></button>
                    <button class="btn-stop"><i class="fas fa-stop"></i></button>
                </div>
            </div>
            <div class="timer-body">
                <div class="time-display">25:00</div>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
                <div class="timer-settings">
                    <div class="time-inputs">
                        <input type="number" class="work-time" value="25" min="1" max="180" placeholder="وقت العمل">
                        <input type="number" class="break-time" value="5" min="1" max="60" placeholder="وقت الاستراحة">
                    </div>
                </div>
            </div>
        `;
        timersContainer.appendChild(timerElement);
        return timerElement;
    }
}