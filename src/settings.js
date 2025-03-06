export class Settings {
    constructor(app) {
        this.app = app;
        this.setupSoundControls();
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