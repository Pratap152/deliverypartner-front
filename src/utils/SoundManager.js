import { Platform } from "react-native";
import Sound from "react-native-sound";

Sound.setCategory("Playback");

let player = null;

export const playOrderSound = () => {
  if (player) {
    stopOrderSound();
  }

  player = new Sound(
    Platform.OS === "android" ? "order_alert" : "order_alert.mp3",
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        console.log("Sound Error:", error);
        return;
      }

      player.setNumberOfLoops(-1);
      player.play();
    }
  );
};

export const stopOrderSound = () => {
  if (!player) return;

  const currentPlayer = player;
  player = null;

  currentPlayer.stop(() => {
    currentPlayer.release();
  });
};