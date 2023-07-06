import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state() {
    return {
      userId: "",
      userName: ""
    };
  },
  mutations: {
    setUserId(state, value) {
      state.userId = value;
    },
    setUserName(state, value) {
      state.userName = value;
    }
  },
  plugins: [createPersistedState()]
});