import battleTheme from "/battle.mp3";

const audio = new Audio(battleTheme);
audio.loop = true;
audio.volume = 0.5;

let isPlaying = false;

export const playBattleTheme = () => {
  if (!isPlaying) {
    audio.play();
    isPlaying = true;
  }
};

export const stopBattleTheme = () => {
  if (isPlaying) {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
  }
};
