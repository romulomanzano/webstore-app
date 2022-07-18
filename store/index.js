import { vuexfireMutations, firestoreAction } from "vuexfire";

export const state = () => ({
  user: null,
  stores: [],
  products: [],
  userData: null,
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
      .doc(state.activeStore.id)
      .collection("products")
      .add(data);
  }),
  bindUserDataDocument: firestoreAction(async function ({
    bindFirestoreRef,
    state,
  }) {
    // return the promise so we can await the write
    const ref = this.$fire.firestore.collection("userData").doc(state.user.uid);
    await bindFirestoreRef("userData", ref, { wait: true });
    if (ref && ref.stores) {
      await bindFirestoreRef("activeStore", ref.stores[0], { wait: true });
    }
  }),
  addStore: firestoreAction(async function ({ bindFirestoreRef, state }, data) {
    const ref = await this.$fire.firestore.collection("stores").add(data);
    await bindFirestoreRef("activeStore", ref, { wait: true });
    return this.$fire.firestore
      .collection("userData")
      .doc(state.user.uid)
      .set({ stores: [ref] }, { merge: true });
  }),
};
export const getters = {
  products(state) {
    return state.userData.stores[0].products;
  },
  activeStore(state) {
    return state.activeStore;
  },
  stores(state) {
    return state.stores;
  },
  user(state) {
    return state.user;
  },
  userData(state) {
    return state.userData;
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
