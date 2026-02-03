import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
       state.list.unshift({
    ...action.payload,
    read: false,
    createdAt: Date.now(),
  });
    },

    markRead(state, action) {
      const n = state.list.find(i => i.id === action.payload);
      if (n && !n.read) {
        n.read = true;
        state.unreadCount -= 1;
      }
    },

    markAllRead(state) {
      state.list.forEach(n => (n.read = true));
      state.unreadCount = 0;
    },

    clearAll() {
      return initialState;
    },
  },
});

export const {
  addNotification,
  markRead,
  markAllRead,
  clearAll,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
