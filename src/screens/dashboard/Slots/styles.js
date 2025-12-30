import { StyleSheet } from 'react-native';
import colors from '../../../utils/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    padding: 16,
    paddingBottom: 120,
  },

  /* -------- SLOT CARD -------- */
  slotCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },

  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  slotTime: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },

  highDemand: {
    backgroundColor: colors.highDemandBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  highDemandText: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '600',
  },

  earning: {
    marginTop: 6,
    fontSize: 13,
    color: colors.gray,
  },

  bookBtn: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  bookText: {
    color: colors.white,
    fontWeight: '600',
  },

  cancelBtn: {
    marginTop: 10,
    backgroundColor: colors.danger,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelText: {
    color: colors.white,
    fontWeight: '600',
  },

  cancelledLabel: {
    marginTop: 10,
    color: colors.danger,
    fontWeight: '600',
  },

  /* -------- FILTER TABS -------- */
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
  },

  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    marginRight: 10,
  },

  tabActive: {
    backgroundColor: colors.primary,
  },

  tabText: {
    fontSize: 13,
    color: colors.black,
  },

  tabTextActive: {
    color: colors.white,
    fontWeight: '600',
  },

  /* -------- MODALS -------- */
  modal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },

  modalDanger: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.danger,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.black,
  },

  modalText: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  modalCancel: {
    fontSize: 14,
    color: colors.gray,
  },

  modalConfirm: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },

  modalDangerText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: '700',
  },

  warning: {
    fontSize: 13,
    color: colors.warning,
  },

  /* -------- SUCCESS -------- */
  successModal: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },

  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.success,
  },

  successSub: {
    fontSize: 14,
    color: colors.gray,
    marginVertical: 10,
  },

  successBtn: {
    marginTop: 14,
    backgroundColor: colors.success,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 14,
  },

  successBtnText: {
    color: colors.white,
    fontWeight: '700',
  },

  /* -------- BOOKED SUMMARY -------- */
  summaryCard: {
    margin: 16,
    backgroundColor: colors.bookedBg,
    borderRadius: 14,
    padding: 14,
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
  },

  summaryLink: {
    marginTop: 6,
    color: colors.primary,
    fontWeight: '600',
  },

  /* -------- NEXT WEEK LOCK -------- */
  lockContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  lockText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
});
