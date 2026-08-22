import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { formatMoney } from "../../utils/formatMoney";

export default function SalaryDetails({
  data,
  onBack,
}) {
  const amount = Number(
    data?.amount ||
      data?.salaryAmount ||
      0
  );

  const salaryDate =
    data?.salaryDate ||
    data?.date ||
    data?.time;

  const creditedOn =
    data?.creditedAt ||
    data?.time ||
    data?.createdAt;

  const transactionId =
    data?.transactionId ||
    data?.id ||
    "-";

  const referenceId =
    data?.referenceId ||
    "-";

  const status = String(
    data?.status ||
      "SUCCESS"
  ).toUpperCase();

  const formatDate = value => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = value => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const isSuccess =
    status === "SUCCESS" ||
    status === "COMPLETED" ||
    status === "PAID";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Transaction Details
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            {/* =========================
                SALARY HERO
            ========================= */}
            <View style={styles.salaryHero}>
              <View style={styles.successIcon}>
                <Ionicons
                  name={
                    isSuccess
                      ? "checkmark"
                      : "time-outline"
                  }
                  size={30}
                  color={
                    isSuccess
                      ? "#16A34A"
                      : "#D97706"
                  }
                />
              </View>

              <Text style={styles.salaryTitle}>
                Salary Credited
              </Text>

              <Text style={styles.salaryAmount}>
                ₹{formatMoney(amount)}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  isSuccess
                    ? styles.successBadge
                    : styles.pendingBadge,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        isSuccess
                          ? "#16A34A"
                          : "#D97706",
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color: isSuccess
                        ? "#15803D"
                        : "#B45309",
                    },
                  ]}
                >
                  {isSuccess
                    ? "Payment Successful"
                    : status}
                </Text>
              </View>

              <Text style={styles.salaryDate}>
                {formatDate(salaryDate)}
              </Text>
            </View>

            {/* =========================
                PAYMENT SUMMARY
            ========================= */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                PAYMENT SUMMARY
              </Text>

              <DetailRow
                label="Description"
                value={`Salary for ${formatDate(
                  salaryDate
                )}`}
                amount={amount}
              />

              <DetailRow
                label="Salary Date"
                value={formatDate(
                  salaryDate
                )}
              />

              <DetailRow
                label="Credited On"
                value={formatDateTime(
                  creditedOn
                )}
              />
            </View>

            {/* =========================
                TRANSACTION DETAILS
            ========================= */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                TRANSACTION DETAILS
              </Text>

              <CopyDetailRow
                label="Transaction ID"
                value={transactionId}
              />

              <CopyDetailRow
                label="Reference ID"
                value={referenceId}
              />

              <DetailRow
                label="Transaction Type"
                value="Salary"
              />

              <View
                style={[
                  styles.detailRow,
                  styles.lastRow,
                ]}
              >
                <Text
                  style={styles.detailLabel}
                >
                  Status
                </Text>

                <View
                  style={styles.statusValue}
                >
                  <Ionicons
                    name={
                      isSuccess
                        ? "checkmark-circle"
                        : "time-outline"
                    }
                    size={17}
                    color={
                      isSuccess
                        ? "#16A34A"
                        : "#D97706"
                    }
                  />

                  <Text
                    style={[
                      styles.successStatus,
                      {
                        color: isSuccess
                          ? "#16A34A"
                          : "#D97706",
                      },
                    ]}
                  >
                    {status}
                  </Text>
                </View>
              </View>
            </View>

            {/* =========================
                COMPLETED MESSAGE
            ========================= */}
            {isSuccess && (
              <View
                style={styles.completedBox}
              >
                <View
                  style={
                    styles.completedIcon
                  }
                >
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#16A34A"
                  />
                </View>

                <Text
                  style={styles.completedText}
                >
                  Transaction completed{"\n"}
                  successfully
                </Text>
              </View>
            )}
          </>
        }
      />
    </View>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
  amount,
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Text style={styles.detailLabel}>
          {label}
        </Text>

        <Text style={styles.detailValue}>
          {value || "-"}
        </Text>
      </View>

      {amount !== undefined && (
        <Text
          style={styles.detailAmount}
        >
          ₹{formatMoney(amount)}
        </Text>
      )}
    </View>
  );
}

/* =========================================================
   COPYABLE DETAIL ROW
========================================================= */

function CopyDetailRow({
  label,
  value,
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Text style={styles.detailLabel}>
          {label}
        </Text>

        <Text
          style={styles.detailValue}
          numberOfLines={2}
          ellipsizeMode="middle"
        >
          {value || "-"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.copyButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name="copy-outline"
          size={18}
          color="#6B7280"
        />
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    marginLeft: 4,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign:'center'
  },

  headerSpacer: {
    width: 42,
  },

  content: {
    paddingBottom: 30,
  },

  /* =========================
     HERO
  ========================= */

  salaryHero: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  successIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCFCE7",
    marginBottom: 14,
  },

  salaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  salaryAmount: {
    marginTop: 7,
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  successBadge: {
    backgroundColor: "#F0FDF4",
  },

  pendingBadge: {
    backgroundColor: "#FFFBEB",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  statusBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  salaryDate: {
    marginTop: 9,
    color: "#6B7280",
    fontSize: 14,
  },

  /* =========================
     SECTION
  ========================= */

  section: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 18,
    backgroundColor: "#FFF",
  },

  sectionTitle: {
    marginBottom: 4,
    fontSize: 13,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 0.6,
  },

  /* =========================
     DETAIL ROW
  ========================= */

  detailRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  detailLeft: {
    flex: 1,
    paddingRight: 12,
  },

  detailLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  detailValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  detailAmount: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  copyButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  statusValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  successStatus: {
    fontSize: 14,
    fontWeight: "800",
  },

  /* =========================
     COMPLETED
  ========================= */

  completedBox: {
    margin: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
  },

  completedIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCFCE7",
  },

  completedText: {
    marginTop: 8,
    textAlign: "center",
    color: "#15803D",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});