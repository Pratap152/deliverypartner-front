let index = 0;

const PATH = [
  { latitude: 19.0896, longitude: 72.8656 },
  { latitude: 19.0925, longitude: 72.8680 },
  { latitude: 19.0950, longitude: 72.8705 },
  { latitude: 19.0980, longitude: 72.8720 },
  { latitude: 19.1015, longitude: 72.8743 },
];

export const getMockRiderLocation = () => {
  if (index >= PATH.length) index = 0;
  return PATH[index++];
};
