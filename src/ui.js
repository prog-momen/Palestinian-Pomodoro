export class UI {
    constructor(app) {
        this.app = app;
        this.initializeCompletedSessions();
        this.setupSessionListener();
    }

    initializeCompletedSessions() {
        const mainContent = document.querySelector('.main-content');
        const completedSessionsDiv = document.createElement('div');
        completedSessionsDiv.className = 'completed-sessions';
        completedSessionsDiv.innerHTML = `
            <div class="completed-sessions-header">
                <h2>الجلسات المكتملة</h2>
                <button class="clear-sessions-btn">مسح الكل</button>
            </div>
            <div class="sessions-list"></div>
        `;
        mainContent.insertBefore(completedSessionsDiv, mainContent.firstChild);
        this.displayCompletedSessions();
    }

    setupSessionListener() {
        document.addEventListener('sessionCompleted', (event) => {
            this.displayCompletedSessions();
        });

        // Add click event listener for clear button
        document.querySelector('.clear-sessions-btn').addEventListener('click', () => {
            this.clearCompletedSessions();
        });
    }

    clearCompletedSessions() {
        localStorage.removeItem('completedSessions');
        this.displayCompletedSessions();
    }

    displayCompletedSessions() {
        const sessionsList = document.querySelector('.sessions-list');
        const completedSessions = JSON.parse(localStorage.getItem('completedSessions') || '[]');
        
        sessionsList.innerHTML = completedSessions.map(session => {
            const startTime = new Date(session.startTime);
            const endTime = new Date(session.endTime);
            const sessionType = session.workDuration ? 'جلسة عمل' : 'استراحة';
            const duration = session.workDuration || session.breakDuration;
            
            return `
                <div class="session-item">
                    <p><strong>${sessionType}</strong></p>
                    <p>المدة: ${duration} دقيقة</p>
                    <p>البداية: ${startTime.toLocaleTimeString('ar-PS')}</p>
                    <p>النهاية: ${endTime.toLocaleTimeString('ar-PS')}</p>
                </div>
            `;
        }).join('');
    }

    createTimerElement() {
        const timersContainer = document.querySelector('.timers-container');
        const  timerElement = document.createElement('div');
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
                <div class="time-display">35:00</div>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
                <div class="timer-settings">
                    <div class="time-inputs">
                        <input type="number" class="work-time" value="35" min="1" max="180" placeholder="وقت العمل">
                        <input type="number" class="break-time" value="5" min="1" max="60" placeholder="وقت الاستراحة">
                    </div>
                </div>
            </div>
        `;
        timersContainer.appendChild(timerElement);
        return timerElement;
    }
}