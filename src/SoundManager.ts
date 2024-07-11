interface Source {
    path: string;
    name: string;
    canPlayMultiple: boolean;
}

interface Sound {
    currentlyPlaying: boolean;
    canPlayMultiple: boolean;
    audio: AudioBuffer;
}

export default class SoundManager {
    private readonly sources: Source[] = [
        { name: "absolute_win", path: "assets/sound/absolute_win.mp3", canPlayMultiple: false },
        { name: "boot", path: "assets/sound/boot.mp3", canPlayMultiple: false },
        { name: "enemyDeath", path: "assets/sound/enemyDeath.mp3", canPlayMultiple: true },
        { name: "flight", path: "assets/sound/flight.mp3", canPlayMultiple: false },
        { name: "helicopterShoot", path: "assets/sound/helicopterShoot.mp3", canPlayMultiple: true },
        { name: "playerDeath", path: "assets/sound/playerDeath.mp3", canPlayMultiple: false },
        { name: "playerShoot", path: "assets/sound/playerShoot.mp3", canPlayMultiple: true },
        { name: "tanking", path: "assets/sound/tanking.mp3", canPlayMultiple: false },
        { name: "tankingFull", path: "assets/sound/tankingFull.mp3", canPlayMultiple: false },
        { name: "tankShoot", path: "assets/sound/tankShoot.mp3", canPlayMultiple: true },
        { name: "lowFuel", path: "assets/sound/lowFuel.mp3", canPlayMultiple: false },
        { name: "flightStart", path: "assets/sound/flightStart.mp3", canPlayMultiple: false },
    ];
    private readonly audioContext = new AudioContext();
    private startAudio: AudioBufferSourceNode;
    private flyingAudio: AudioBufferSourceNode | null;
    private buffers: {
        [key: string]: Sound;
    } = {};

    async load() {
        for (const src of this.sources) {
            this.loadBuffer(src.path, src.name, src.canPlayMultiple);
        }
    }

    async loadBuffer(path: string, name: string, canPlayMultiple: boolean) {
        const data = await fetch(path, { mode: 'cors' });
        const buffer = await data.arrayBuffer();
        const audio = await this.audioContext.decodeAudioData(buffer);
        this.buffers[name] = { audio, canPlayMultiple, currentlyPlaying: false };
    }

    playSound(name: string) {
        if (this.buffers[name].currentlyPlaying) return;
        if (!this.buffers[name].canPlayMultiple) this.buffers[name].currentlyPlaying = true;
        if (name === "playerDeath") this.stopFlightSound();
        
        const sourceNode = this.audioContext.createBufferSource();
        sourceNode.buffer = this.buffers[name].audio;
        sourceNode.onended = () => {
            this.buffers[name].currentlyPlaying = false;
        }
        sourceNode.connect(this.audioContext.destination);
        sourceNode.start();
    }

    playFlightSound(speed: number, start: boolean = false) {
        if (this.flyingAudio && !start) {
            this.flyingAudio.playbackRate.value = (speed + 1.2) / 2.2;
            return;
        }
        if (!start) return;
        const sourceNode = this.audioContext.createBufferSource();
        sourceNode.buffer = this.buffers.flightStart.audio;
        sourceNode.onended = () => {
            this.flyingAudio = this.audioContext.createBufferSource();
            this.flyingAudio.buffer = this.buffers.flight.audio;
            this.flyingAudio.loop = true;
            this.flyingAudio.connect(this.audioContext.destination);
            this.flyingAudio.start();
        };
        this.startAudio = sourceNode;
        sourceNode.connect(this.audioContext.destination);
        sourceNode.start();
    }

    stopFlightSound() {
        this.startAudio.onended = null;
        this.startAudio.stop();
        this.flyingAudio?.stop();
    }
}
