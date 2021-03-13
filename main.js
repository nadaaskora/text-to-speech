// init speech syn api
const synth = window.speechSynthesis;

// selectors
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');


// init voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    // loop thorough voices array
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
}

getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}
const speak = (e) => {
    if (synth.speaking) {
        console.error("already speaking");
        return;
    }
    if (textInput.value !== '') {
        // add bg animation
        window.document.body.style.background = '#141414 url(images/wave.gif)';
        window.document.body.style.backgroundRepeat = 'repeat-x';
        window.document.body.style.backgroundSize = '100% 100%';

        const speakText = new SpeechSynthesisUtterance(textInput.value);

        speakText.onend = e => {
            window.document.body.style.background = '#141414';
            console.log('done speaking ');
        };

        speakText.onerror = e => {
            console.error("something went wrong");
        };
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        // loop throw voices
        voices.forEach(voice => {
            if (voice.name == selectedVoice) {
                speakText.voice = voice;
            }
        });

        // set rate and pitch
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // speack
        synth.speak(speakText);
    }
};

// Events
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

rate.addEventListener('change', e => rateValue.textContent = rate.value);
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);
voiceSelect.addEventListener('change', e => speak());