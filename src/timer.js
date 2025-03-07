export class Timer {
    constructor(id, app) {
        this.id = id;
        this.app = app;
        this.element = document.querySelector(`[data-timer-id="${id}"]`);
        this.timeDisplay = this.element.querySelector('.time-display');
        this.progressBar = this.element.querySelector('.progress');
        this.nameInput = this.element.querySelector('.timer-name');
        this.isBreak = false;
        this.interval = null;
        this.workTime = 35;
        this.breakTime = 5;
        this.longBreakTime = 15;
        this.sessionsCount = 0;
        this.duration = this.workTime * 60;
        this.remaining = this.duration;
        this.sessionStartTime = null;
        this.wasInterrupted = false;
        
        this.setupEventListeners();
        this.updateDisplay();
        this.updateProgress();
        this.updateTimeInputs();
    }

    setupEventListeners() {
        const startBtn = this.element.querySelector('.btn-start');
        const pauseBtn = this.element.querySelector('.btn-pause');
        const stopBtn = this.element.querySelector('.btn-stop');

        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.pause());
        stopBtn.addEventListener('click', () => this.stop());

        const workInput = this.element.querySelector('.work-time');
        const breakInput = this.element.querySelector('.break-time');
        workInput.addEventListener('input', () => this.updateTime());
        breakInput.addEventListener('input', () => this.updateTime());
    }

    updateTime() {
        const workInput = this.element.querySelector('.work-time');
        const breakInput = this.element.querySelector('.break-time');
        
        const newWorkTime = Math.max(1, Math.min(180, parseInt(workInput.value) || 25));
        const newBreakTime = Math.max(1, Math.min(60, parseInt(breakInput.value) || 5));
        
        this.workTime = newWorkTime;
        this.breakTime = newBreakTime;
        
        if (!this.interval) {
            this.duration = (this.isBreak ? this.breakTime : this.workTime) * 60;
            this.remaining = this.duration;
        } else {
            this.duration = (this.isBreak ? this.breakTime : this.workTime) * 60;
        }
        
        this.updateDisplay();
        this.updateProgress();
        this.updateTimeInputs();
    }

    updateTimeInputs() {
        const modeStatus = this.isBreak ? 'استراحة' : 'عمل';
        this.nameInput.placeholder = `${modeStatus}`;
        this.nameInput.value = `${modeStatus}`;
    }

    start() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (!this.isBreak) {
            this.sessionStartTime = new Date();
            this.wasInterrupted = false;
        }
        this.interval = setInterval(() => this.tick(), 1000);
    }

    pause() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    stop() {
        this.pause();
        this.reset();
        this.wasInterrupted = true;
        // Stop any playing sounds
        const audios = document.getElementsByTagName('audio');
        for (let audio of audios) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    reset() {
        this.isBreak = false;
        this.sessionsCount = 0;
        this.duration = this.workTime * 60;
        this.remaining = this.duration;
        this.updateDisplay();
        this.updateProgress();
        this.updateTimeInputs();
    }


    tick() {
        if (this.remaining <= 0) {
            this.playAlarm();
            const stopBtn = this.element.querySelector('.btn-stop');
            stopBtn.style.animation = 'pulse 1s infinite';
            if (this.isBreak && !this.wasInterrupted) {
                this.saveCompletedSession();
                this.isBreak = false;
                this.sessionsCount++;
            } else {
                this.isBreak = true;
                if (this.sessionsCount >= 4) {
                    this.breakTime = this.longBreakTime;
                    this.sessionsCount = 0;
                }
            }

            this.duration = (this.isBreak ? this.breakTime : this.workTime) * 60;
            this.remaining = this.duration;
            this.updateDisplay();
            this.updateProgress();
            this.updateTimeInputs();
            return;
        }

        this.remaining--;
        this.updateDisplay();
        this.updateProgress();
        // Remove animation when timer is running
        const stopBtn = this.element.querySelector('.btn-stop');
        stopBtn.style.animation = '';
    }

    updateDisplay() {
        const minutes = Math.floor(this.remaining / 60);
        const seconds = this.remaining % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateProgress() {
        const progress = (this.remaining / this.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.progressBar.style.backgroundColor = this.isBreak ? 'var(--color-red)' : 'var(--color-green)';
    }

    playAlarm() {
        const soundSelect = document.querySelector('.sound-select');
        const selectedSound = soundSelect.value;
        if (selectedSound === 'custom') {
            const customSound = localStorage.getItem('customSound');
            if (customSound) {
                const audio = new Audio(customSound);
                audio.play();
                setTimeout(() => audio.pause(), 10000); //stop after 10 seconds
            }
        } else {
            import(`./sounds/${selectedSound}.mp3`).then(audioModule => {
                const audio = new Audio(audioModule.default);
                audio.play();
                setTimeout(() => audio.pause(), 10000);
            }).catch(error => {
                console.error('Failed to load sound:', error);
            });
        }
    }

    saveCompletedSession() {
        if (!this.sessionStartTime || this.wasInterrupted) return;

        const sessionEnd = new Date();
        const session = {
            startTime: this.sessionStartTime.toISOString(),
            endTime: sessionEnd.toISOString(),
            workDuration: this.isBreak ? null : this.workTime,
            breakDuration: this.isBreak ? this.breakTime : null
        };

        let completedSessions = JSON.parse(localStorage.getItem('completedSessions') || '[]');
        completedSessions.unshift(session);
        localStorage.setItem('completedSessions', JSON.stringify(completedSessions));

        // Dispatch an event to notify UI about the new session
        const event = new CustomEvent('sessionCompleted', { detail: session });
        document.dispatchEvent(event);

        this.sessionStartTime = null;
    }
}