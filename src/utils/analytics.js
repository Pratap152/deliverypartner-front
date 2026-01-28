export const Analytics = {
  track(event, params = {}) {
    console.log("📊 ANALYTICS:", event, params);
    // Later plug Firebase / Segment / CleverTap here
  },
};
