import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import apiClient from "../../services/ApiClient";

const RiderAssets = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [assetsData, setAssetsData] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await apiClient.get('/api/profile/totalassets');

      setAssetsData(res.data?.data);
    } catch (err) {
      console.log("Assets error", err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00B2C9" />
      </View>
    );
  }

  const { totalAssets, badConditionCount, assets } = assetsData || {};

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.6)} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Rider Assets</Text>

        <Image
          source={require("../../assets/profile/HelpcenterIcon.png")}
          style={styles.robotIcon}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ASSETS SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Assets Summary</Text>

          {/* <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{totalAssets}</Text>
              <Text style={styles.summaryLabel}>Total Assets</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{badConditionCount}</Text>
              <Text style={styles.summaryLabel}>Issues</Text>
            </View>
          </View> */}
          <View style={styles.summaryRowSingle}>
  <View style={styles.summaryBoxSingle}>
    <Text style={styles.summaryValue}>{totalAssets || 0}</Text>
    <Text style={styles.summaryLabel}>Total Assets</Text>
  </View>
</View>

        </View>

        {/* ASSET LIST */}
        {assets?.map((item, index) => (
          <View key={index} style={styles.assetCard}>
            <View style={styles.assetIcon}>
              <Ionicons
                name="cube-outline"
                size={rf(2.8)}
                color="#12B76A"
              />
            </View>

            <View style={styles.assetContent}>
              <Text style={styles.assetName}>{item.assetName}</Text>

              <Text style={styles.assetMeta}>
                Asset Type: {item.assetType}
              </Text>
              <Text style={styles.assetMeta}>
                Quantity: {item.quantity}
              </Text>
              <Text style={styles.assetMeta}>
                Issued Date:{" "}
                {new Date(item.issuedDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: rh(4) }} />
      </ScrollView>
    </View>
  );
};

export default RiderAssets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: rw(4),
    paddingVertical: rh(2.2),
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: "700",
    color: "#101828",
  },

  robotIcon: {
    width: rw(7.5),
    height: rw(7.5),
    resizeMode: "contain",
  },

  /* SUMMARY */
  summaryCard: {
    backgroundColor: "#00B2C9",
    borderRadius: rw(4),
    margin: rw(4),
    padding: rw(4.5),
  },

  summaryTitle: {
    fontSize: rf(2),
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: rh(1.5),
    alignSelf: "flex-start",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  summaryBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: rw(3),
    width: "47%",
    paddingVertical: rh(1.6),
    alignItems: "center",
  },

  summaryValue: {
    fontSize: rf(2.6),
    fontWeight: "700",
    color: "#101828",
  },

  summaryLabel: {
    fontSize: rf(1.6),
    color: "#667085",
    marginTop: rh(0.4),
  },

  /* ASSET CARD */
  assetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: rw(4),
    flexDirection: "row",
    padding: rw(4.8),
    marginHorizontal: rw(4),
    marginBottom: rh(2),
    elevation: 2,
  },

  assetIcon: {
    width: rw(14),
    height: rw(14),
    borderRadius: rw(3.5),
    backgroundColor: "#ECFDF3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: rw(3.5),
  },

  assetContent: {
    flex: 1,
  },

  assetName: {
    fontSize: rf(2),
    fontWeight: "600",
    color: "#101828",
    marginBottom: rh(0.4),
  },

  assetMeta: {
    fontSize: rf(1.6),
    color: "#475467",
    marginTop: rh(0.4),
  },
  summaryRowSingle: {
  flexDirection: "row",
  justifyContent: "center",
  width: "100%",
},

summaryBoxSingle: {
  backgroundColor: "#FFFFFF",
  borderRadius: rw(3),
  width: "60%",
  paddingVertical: rh(2),
  alignItems: "center",
},

});






// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text, 
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Image,
//   Modal,
//   Alert,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import {
//   responsiveWidth as rw,
//   responsiveHeight as rh,
//   responsiveFontSize as rf,
// } from "react-native-responsive-dimensions";
// import apiClient from "../../services/ApiClient";

// const RiderAssets = ({ navigation }) => {
//   const [loading, setLoading] = useState(true);
// const [assetsData, setAssetsData] = useState(null);

//   const [showIssueModal, setShowIssueModal] = useState(false);
//   const [selectedAssets, setSelectedAssets] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [localIssueCount, setLocalIssueCount] = useState(0);


//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const fetchAssets = async () => {
//     try {
//       const res = await apiClient.get("/api/profile/assets");
//       setAssetsData(res.data?.data);

//       setAssetsData(res.data?.data);
// setLocalIssueCount(res.data?.data?.badConditionCount || 0);

//     } catch (err) {
//       console.log("Assets error", err?.response || err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED SELECTION LOGIC
//   const toggleAssetSelection = (assetId) => {
//     setSelectedAssets((prev) =>
//       prev.includes(assetId)
//         ? prev.filter((id) => id !== assetId)
//         : [...prev, assetId]
//     );
//   };

//   // ✅ SUBMIT ISSUE
//   const submitIssue = async () => {
//   if (selectedAssets.length === 0) {
//     Alert.alert("Select Asset", "Please select at least one asset");
//     return;
//   }

//   try {
//     setSubmitting(true);

//     // 🔴 Backend can fail – doesn't matter for now
//     try {
//       await apiClient.post("/api/profile/assets/raise-issue", {
//         assetIds: selectedAssets,
//       });
//     } catch (e) {
//       console.log("Backend not ready, using static count");
//     }

//     // ✅ STATIC UPDATE (ONLY THIS PART)
//     setLocalIssueCount((prev) => prev + selectedAssets.length);

//     Alert.alert("Success", "Issue raised successfully");
//     setShowIssueModal(false);
//     setSelectedAssets([]);
//   } finally {
//     setSubmitting(false);
//   }
// };



// const { totalAssets, assets } = assetsData || {};

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={rf(2.6)} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Rider Assets</Text>
//         <Image
//           source={require("../../assets/profile/HelpcenterIcon.png")}
//           style={styles.robotIcon}
//         />
//       </View>

//       <ScrollView>
//         {/* SUMMARY */}  
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryTitle}>Assets Summary</Text>
//           <View style={styles.summaryRow}>
//             <View style={styles.summaryBox}>
//               <Text style={styles.summaryValue}>{totalAssets}</Text>
//               <Text style={styles.summaryLabel}>Total Assets</Text>
//             </View>
//             <View style={styles.summaryBox}>
//              <Text style={styles.summaryValue}>{localIssueCount}</Text>
// <Text style={styles.summaryLabel}>Issues</Text>

//             </View>
//           </View>
//         </View>

//         {/* ASSETS LIST */}
//         {assets?.map((item, index) => {
//           const assetId = `${index}-${item.assetName}`;

//           return (
//             <View key={assetId} style={styles.assetCard}>
//               <View style={styles.assetIcon}>
//                 <Ionicons
//                   name="cube-outline"
//                   size={rf(2.8)}
//                   color="#12B76A"
//                 />
//               </View>
//               <View style={styles.assetContent}>
//                 <Text style={styles.assetName}>{item.assetName}</Text>
//                 <Text style={styles.assetMeta}>
//                   Asset Type: {item.assetType}
//                 </Text>
//                 <Text style={styles.assetMeta}>
//                   Quantity: {item.quantity}
//                 </Text>
//                 <Text style={styles.assetMeta}>
//                   Issued Date:{" "}
//                   {new Date(item.issuedDate).toLocaleDateString()}
//                 </Text>
//               </View>
//             </View>
//           );
//         })}

//         <View style={{ height: rh(10) }} />
//       </ScrollView>

//       {/* RAISE ISSUE BUTTON */}
//       <TouchableOpacity
//         style={styles.raiseIssueBtn}
//         onPress={() => setShowIssueModal(true)}
//       >
//         <Text style={styles.raiseIssueText}>Raise an Issue</Text>
//       </TouchableOpacity>

//       {/* MODAL */}
//       <Modal visible={showIssueModal} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Select Assets</Text>

//             <ScrollView>
//               {assets?.map((item, index) => {
//                 const assetId = `${index}-${item.assetName}`;
//                 const isSelected = selectedAssets.includes(assetId);

//                 return (
//                   <TouchableOpacity
//                     key={assetId}
//                     style={styles.checkboxRow}
//                     onPress={() => toggleAssetSelection(assetId)}
//                   >
//                     <Ionicons
//                       name={isSelected ? "checkbox" : "square-outline"}
//                       size={rf(2.6)}
//                       color="#00B2C9"
//                     />
//                     <Text style={styles.checkboxText}>
//                       {item.assetName}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </ScrollView>

//             <TouchableOpacity
//               style={styles.submitBtn}
//               onPress={submitIssue}
//               disabled={submitting}
//             >
//               {submitting ? (
//                 <ActivityIndicator color="#FFF" />
//               ) : (
//                 <Text style={styles.submitText}>Submit Issue</Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.cancelBtn}
//               onPress={() => {
//                 setShowIssueModal(false);
//                 setSelectedAssets([]);
//               }}
//             >
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default RiderAssets;



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F9FC",
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: rw(4),
//     paddingVertical: rh(2.2),
//     backgroundColor: "#FFFFFF",
//     elevation: 3,
//   },

//   headerTitle: {
//     fontSize: rf(2.3),
//     fontWeight: "700",
//     color: "#101828",
//   },

//   robotIcon: {
//     width: rw(7.5),
//     height: rw(7.5),
//     resizeMode: "contain",
//   },

//   summaryCard: {
//     backgroundColor: "#00B2C9",
//     borderRadius: rw(4),
//     margin: rw(4),
//     padding: rw(4.5),
//   },

//   summaryTitle: {
//     fontSize: rf(2),
//     fontWeight: "600",
//     color: "#FFFFFF",
//     marginBottom: rh(1.5),
//   },

//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   summaryBox: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: rw(3),
//     width: "47%",
//     paddingVertical: rh(1.6),
//     alignItems: "center",
//   },

//   summaryValue: {
//     fontSize: rf(2.6),
//     fontWeight: "700",
//   },

//   summaryLabel: {
//     fontSize: rf(1.6),
//     color: "#667085",
//   },

//   assetCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: rw(4),
//     flexDirection: "row",
//     padding: rw(4.8),
//     marginHorizontal: rw(4),
//     marginBottom: rh(2),
//     elevation: 2,
//   },

//   assetIcon: {
//     width: rw(14),
//     height: rw(14),
//     borderRadius: rw(3.5),
//     backgroundColor: "#ECFDF3",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: rw(3.5),
//   },

//   assetContent: {
//     flex: 1,
//   },

//   assetName: {
//     fontSize: rf(2),
//     fontWeight: "600",
//     marginBottom: rh(0.4),
//   },

//   assetMeta: {
//     fontSize: rf(1.6),
//     color: "#475467",
//     marginTop: rh(0.4),
//   },

//   raiseIssueBtn: {
//     position: "absolute",
//     bottom: rh(2),
//     left: rw(4),
//     right: rw(4),
//     backgroundColor: "#00B2C9",
//     paddingVertical: rh(1.8),
//     borderRadius: rw(3),
//     alignItems: "center",
//   },

//   raiseIssueText: {
//     color: "#FFF",
//     fontSize: rf(2),
//     fontWeight: "600",
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   modalCard: {
//     backgroundColor: "#FFF",
//     width: "90%",
//     maxHeight: "75%",
//     borderRadius: rw(4),
//     padding: rw(4),
//   },

//   modalTitle: {
//     fontSize: rf(2.2),
//     fontWeight: "700",
//     marginBottom: rh(1.5),
//   },

//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: rh(1.2),
//   },

//   checkboxText: {
//     marginLeft: rw(3),
//     fontSize: rf(1.8),
//   },

//   submitBtn: {
//     backgroundColor: "#12B76A",
//     paddingVertical: rh(1.6),
//     borderRadius: rw(3),
//     marginTop: rh(2),
//     alignItems: "center",
//   },

//   submitText: {
//     color: "#FFF",
//     fontSize: rf(2),
//     fontWeight: "600",
//   },

//   cancelBtn: {
//     marginTop: rh(1.2),
//     alignItems: "center",
//   },

//   cancelText: {
//     color: "#667085",
//     fontSize: rf(1.7),
//   },
// });

