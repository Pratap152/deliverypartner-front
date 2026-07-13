import Sound from "react-native-sound";

Sound.setCategory("Playback");

let player = null;

export const playOrderSound = () => {
  if (player) {
    player.stop();
    player.release();
  }

  player = new Sound("order_alert.mp3", Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log("Sound Error:", error);
      return;
    }

    player.setNumberOfLoops(-1); // Infinite loop
    player.play();
  });
};

export const stopOrderSound = () => {
  if (player) {
    player.stop(() => {
      player.release();
      player = null;
    });
  }
};