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
        { name: "fastFlight", path: "assets/sound/fastFlight.mp3", canPlayMultiple: false },
        { name: "slowFlight", path: "assets/sound/slowFlight.mp3", canPlayMultiple: false },
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
    private readonly muteFlight = ["flight", "slowFlight", "fastFlight"];
    private buffers: {
        [key: string]: Sound;
    } = {};
    isFlying: boolean;

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
        if (this.muteFlight.includes(name) && !this.isFlying) return;
        if (!this.buffers[name].canPlayMultiple) this.buffers[name].currentlyPlaying = true;
        
        const sourceNode = this.audioContext.createBufferSource();
        sourceNode.buffer = this.buffers[name].audio;
        sourceNode.onended = () => {
            if (name === "flightStart") this.isFlying = true;
            this.buffers[name].currentlyPlaying = false;
        }
        sourceNode.connect(this.audioContext.destination);
        sourceNode.start();
    }
}
