interface Source {
    path: string;
    canPlayMultiple: boolean;
}

interface Sound {
    currentlyPlaying: boolean;
    canPlayMultiple: boolean;
    audio: HTMLAudioElement;
}

export default class SoundManager {
    sources: Source[];
    audios: {
        [key: string]: Sound;
    };
    muteFlights: boolean;
    playerShootIterator = 0;
    enemyDeathIterator = 0;
    helicopterShootIterator = 0;
    tankShootIterator = 0;
    constructor() {
        this.sources = [
            { path: "absolute_win.mp3", canPlayMultiple: false },
            { path: "boot.mp3", canPlayMultiple: false },
            { path: "enemyDeath.mp3", canPlayMultiple: true },
            { path: "fastFlight.mp3", canPlayMultiple: false },
            { path: "flight.mp3", canPlayMultiple: false },
            { path: "helicopterShoot.mp3", canPlayMultiple: true },
            { path: "playerDeath.mp3", canPlayMultiple: false },
            { path: "playerShoot.mp3", canPlayMultiple: true },
            { path: "tanking.mp3", canPlayMultiple: false },
            { path: "tankingFull.mp3", canPlayMultiple: false },
            { path: "tankShoot.mp3", canPlayMultiple: true },
            { path: "lowFuel.mp3", canPlayMultiple: false },
            { path: "flightStart.mp3", canPlayMultiple: false },
        ];

        this.audios = {};
    }

    async load() {
        for (const src of this.sources) {
            if (src.canPlayMultiple) {
                await this.loadAudio(src, "0");
                await this.loadAudio(src, "1");
                await this.loadAudio(src, "2");
                await this.loadAudio(src, "3");
                await this.loadAudio(src, "4");
            } else await this.loadAudio(src);
        }
    }

    async loadAudio(source: Source, iterator: string = ""): Promise<void> {
        return new Promise((resolve, reject) => {
            const audio: HTMLAudioElement = new Audio("../assets/sound/" + source.path);
            const name = source.path.replace(/\..*/, "");
            if (name === "flightStart") {
                audio.addEventListener("ended", (event: Event) => {
                    this.muteFlights = false;
                });
            }
            audio.addEventListener("canplaythrough", (event: Event) => {
                this.audios[name + iterator] = {
                    audio,
                    currentlyPlaying: false,
                    canPlayMultiple: source.canPlayMultiple,
                };
                resolve();
            });
        });
    }

    playSound(name: string) {
        if (name === "flightStart") {
            this.muteFlights = true;
            this.audios.flightStart.audio.currentTime = 0
            this.audios.flightStart.audio.play();
        }
        if (name === "flight" && !this.muteFlights) {
            this.stopSound("fastFlight");
            this.audios.flight.audio.play();
        }
        if (name === "fastFlight" && !this.muteFlights) {
            this.stopSound("flight");
            this.audios.fastFlight.audio.play();
        }
        if (name === "boot") this.audios.boot.audio.play();
        if (name === "playerDeath") {
            this.audios.playerDeath.audio.play();
            this.stopSound("flight")
            this.stopSound("fastFlight")
            this.stopSound("flightStart")
        }
        if (name === "playerShoot") {
            if (this.playerShootIterator === 4) this.playerShootIterator = -1;
            this.playerShootIterator++;
            this.audios["playerShoot" + this.playerShootIterator.toString()].audio.play();
        }
        if (name === "helicopterShoot") {
            if (this.helicopterShootIterator === 4) this.helicopterShootIterator = -1;
            this.helicopterShootIterator++;
            this.audios["helicopterShoot" + this.helicopterShootIterator.toString()].audio.play();
        }
        if (name === "tankShoot") {
            if (this.tankShootIterator === 4) this.tankShootIterator = -1;
            this.tankShootIterator++;
            this.audios["tankShoot" + this.tankShootIterator.toString()].audio.play();
        }
        if (name === "enemyDeath") {
            if (this.enemyDeathIterator === 4) this.enemyDeathIterator = -1;
            this.enemyDeathIterator++;
            this.audios["enemyDeath" + this.enemyDeathIterator.toString()].audio.play();
        }
        if (name === "lowFuel") this.audios.lowFuel.audio.play();
        if (name === "tanking") this.audios.tanking.audio.play();
        if (name === "tankingFull") this.audios.tankingFull.audio.play();
        if (name === "absolute_win") this.audios.absolute_win.audio.play();
    }

    stopSound(name: string) {
        this.audios[name].audio.pause();
    }
}
