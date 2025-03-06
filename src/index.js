import './styles.css';
import { Timer } from './timer.js';
import { UI } from './ui.js';
import { Settings } from './settings.js';

class PomodoroApp {
    constructor() {
        this.timer = null;
        this.ui = new UI(this);
        this.settings = new Settings(this);
        this.initializeTimer();
    }

    initializeTimer() {
        const timerElement = this.ui.createTimerElement();
        this.timer = new Timer(1, this);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroApp = new PomodoroApp();
});