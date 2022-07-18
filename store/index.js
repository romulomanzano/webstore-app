import { vuexfireMutations, firestoreAction } from "vuexfire";

export const state = () => ({
  user: null,
  stores: [],
  products: [],
  activeStore: null,
});
export const mutations = {
  ...vuexfireMutations,
  SET_PRODUCTS: (state, products) => {
    // Only needed for SSR/Universal Mode
    state.products = products;
  },
  ON_AUTH_STATE_CHANGED_MUTATION: (state, authUser) => {
    // Do this:
    const { uid, email, emailVerified } = authUser;
    state.user = { uid, email, emailVerified };
  },
  RESET_USER: (state) => {
    state.user = null;
  },
};

export const actions = {
  bindProductsCollection: firestoreAction(async function ({
    state,
    bindFirestoreRef,
  }) {
    const ref = this.$fire.firestore
      .collection("stores")
      .doc(state.activeStore.uid)
      .collection("products");
    await bindFirestoreRef("products", ref, { wait: true });
  }),
  bindStoreDocuments: firestoreAction(async function ({
    state,
    bindFirestoreRef,
  }) {
    const ref = this.$fire.firestore
      .collection("stores")
      .where("users", "array-contains", state.user.uid);
    await bindFirestoreRef("stores", ref, { wait: true });
  }),
  unbindStoreDocuments: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef("store", false);
  }),
  onAuthStateChangedAction: ({ commit }, { authUser }) => {
    if (!authUser) {
      // claims = null
      // Perform logout operations
      commit("RESET_USER");
    } else {
      // Do something with the authUser and the claims object...
      commit("ON_AUTH_STATE_CHANGED_MUTATION", authUser);
    }
  },
  addProduct: firestoreAction(async function ({ state }, data) {
    // return the promise so we can await the write
    return this.$fire.firestore
      .collection("stores")
      .doc(state.activeStore.uid)
      .collection("products")
      .add(data);
  }),
  bindActiveStoreDocument: firestoreAction(async function (
    { bindFirestoreRef },
    data
  ) {
    // return the promise so we can await the write
    const ref = this.$fire.firestore.collection("stores").doc(data.storeId);
    await bindFirestoreRef("activeStore", ref, { wait: true });
  }),
  addStore: firestoreAction(async function ({ bindFirestoreRef }, data) {
    const ref = await this.$fire.firestore.collection("stores").add(data);
    await bindFirestoreRef("activeStore", ref, { wait: true });
  }),
};
export const getters = {
  products(state) {
    return state.products;
  },
  stores(state) {
    return state.stores;
  },
  user(state) {
    return state.user;
  },
  activeStore(state) {
    return state.activeStore;
  },
  isLoggedIn: (state) => {
    if (state.user === null) {
      return false;
    }
    try {
      return state.user.uid !== null;
    } catch {
      return false;
    }
  },
};
