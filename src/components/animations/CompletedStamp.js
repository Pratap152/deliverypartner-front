import LottieView from 'lottie-react-native';

export const CompletedStamp = () => (
  <LottieView
    source={require('../../assets/Completed.png')}
    autoPlay
    loop={false}
    style={{ width: 80, height: 80 }}
  />
);
