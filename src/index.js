import './styles.css';
import { Timer } from './timer.js';

class PomodoroApp {
    constructor() {
        this.timer = null;
        this.setupSoundControls();
        this.initializeTimer();
    }



    initializeTimer() {
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
        this.timer = new Timer(1, this);
    }

    setupSoundControls() {
        const testSoundBtn = document.querySelector('.btn-test-sound');
        const uploadSoundBtn = document.querySelector('.btn-upload-sound');
        const soundUploadInput = document.querySelector('.sound-upload');

        testSoundBtn.addEventListener('click', () => this.testSound());
        uploadSoundBtn.addEventListener('click', () => soundUploadInput.click());
        soundUploadInput.addEventListener('change', (e) => this.handleSoundUpload(e));
    }



    testSound() {
        const soundSelect = document.querySelector('.sound-select');
        const selectedSound = soundSelect.value;
        if (selectedSound === 'custom') {
            const customSound = localStorage.getItem('customSound');
            if (customSound) {
                const audio = new Audio(customSound);
                audio.play();
                setTimeout(() => audio.pause(), 3000);
            }
        } else {
            import(`./sounds/${selectedSound}.mp3`).then(audioModule => {
                const audio = new Audio(audioModule.default);
                audio.play();
                setTimeout(() => audio.pause(), 3000);
            }).catch(error => {
                console.error('Failed to load sound:', error);
            });
        }
    }

    handleSoundUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const soundSelect = document.querySelector('.sound-select');
            const option = document.createElement('option');
            option.value = 'custom';
            option.textContent = file.name;
            soundSelect.appendChild(option);
            soundSelect.value = 'custom';

            localStorage.setItem('customSound', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroApp = new PomodoroApp();
});