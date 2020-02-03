import Tone from 'tone';
import Kick from './kick'
import Snare from './snare'
import HiHat from './hihat'
import Tom from './tom'
import hihatSample from './sounds/hihat.wav';

window.onload = function () {
  const context = new AudioContext;

  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const drumButton = document.getElementById('drum');
  const tempoSlider = document.getElementById('slider');
  const tempoNumber = document.getElementById('tempoNumber');

  const INITIAL_TEMPO = 100

  tempoNumber.innerHTML = INITIAL_TEMPO

  const getBuffer = function(url, context) {
    return window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
  };

  startButton.addEventListener('click', function () {
    getBuffer(hihatSample, context)
      .then(buffer => {
        var kick = new Kick(context);
        var snare = new Snare(context);
        var hihat = new HiHat(context, buffer);
        var tom = new Tom(context)

        Tone.Transport.bpm.value = INITIAL_TEMPO;

        const compasses = '12m'

        const kickLoop = new Tone.Loop(time => kick.trigger(time), '4n')
        const snareLoop = new Tone.Loop(time => snare.trigger(time), '2n')
        const hihatLoop = new Tone.Loop(time => hihat.trigger(time), '4n')
        const hihatLoop2 = new Tone.Loop(time => hihat.trigger(time), '4n')
        const tomLoop = new Tone.Loop(time => tom.trigger(time), '2n')

        kickLoop.start(0).stop(compasses)
        snareLoop.start('6t').stop(compasses)
        hihatLoop.start(0).stop(compasses)
        hihatLoop2.start('6n').stop(compasses)
        tomLoop.start('4n.').stop(compasses)

        Tone.Transport.start();
      });
  });

  stopButton.addEventListener('click', function () {
    Tone.Transport.stop();
  })

  drumButton.addEventListener('click', function () {
    const tom = new Tom(context)
    const compasses = '4m'

    const tomLoop = new Tone.Loop(time => tom.trigger(time), '4n')

    tomLoop.start(0).stop(compasses)

    Tone.Transport.start();
  })

  tempoSlider.addEventListener('change', function (event) {
    const newTempo = parseInt(event.target.value);

    Tone.Transport.bpm.value = newTempo
    tempoNumber.innerHTML = newTempo
  });
}
