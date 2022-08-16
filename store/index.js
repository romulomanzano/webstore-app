import { vuexfireMutations, firestoreAction } from "vuexfire";

export const state = () => ({
  user: null,
  products: [],
  storeFrontProducts: [],
  userData: null,
  activeStore: null,
  activeProduct: null,
  storeFront: null,
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
      .doc(state.activeStore.id)
      .collection("products");
    await bindFirestoreRef("products", ref, { wait: true });
  }),
  bindStoreFrontProductsCollection: firestoreAction(async function (
    { state, bindFirestoreRef },
    payload
  ) {
    const ref = this.$fire.firestore
      .collection("stores")
      .doc(payload.id)
      .collection("products");
    return bindFirestoreRef("storeFrontProducts", ref, { wait: true });
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
  addProduct: firestoreAction(async function ({ state, dispatch }, data) {
    // return the promise so we can await the write
    const ref = await this.$fire.firestore
      .collection("stores")
      .doc(state.activeStore.id)
      .collection("products")
      .add(data);
    dispatch("bindActiveProductDocument", ref);
  }),
  updateProduct: firestoreAction(async function ({ state }, data) {
    return this.$fire.firestore
      .collection("stores")
      .doc(state.activeStore.id)
      .collection("products")
      .doc(state.activeProduct.id)
      .set(data, { merge: true });
  }),
  bindActiveStoreDocument: firestoreAction(async function ({
    state,
    bindFirestoreRef,
  }) {
    const storeRef = this.$fire.firestore
      .collection("stores")
      .doc(state.userData.stores[0].id);
    return bindFirestoreRef("activeStore", storeRef, { wait: true });
  }),
  bindStoreFrontDocument: firestoreAction(async function (
    { state, dispatch, bindFirestoreRef },
    payload
  ) {
    const storeRef = this.$fire.firestore
      .collection("stores")
      .where("storeDomain", "==", payload.name.toLocaleLowerCase())
      .limit(1);
    await bindFirestoreRef("storeFront", storeRef, { wait: true });
    if (state.storeFront.length > 0) {
      dispatch("bindStoreFrontProductsCollection", {
        id: state.storeFront[0].id,
      });
    }
  }),

  bindUserDataDocument: firestoreAction(async function ({
    bindFirestoreRef,
    state,
    dispatch,
  }) {
    // return the promise so we can await the write
    const ref = this.$fire.firestore.collection("userData").doc(state.user.uid);
    await bindFirestoreRef("userData", ref, { wait: true });
    if (state.userData && state.userData.stores) {
      dispatch("bindActiveStoreDocument");
    }
  }),
  bindActiveProductDocument: firestoreAction(async function (
    { bindFirestoreRef, state },
    payload
  ) {
    // return the promise so we can await the write
    return bindFirestoreRef(
      "activeProduct",
      this.$fire.firestore
        .collection("stores")
        .doc(state.activeStore.id)
        .collection("products")
        .doc(payload.id),
      { wait: true }
    );
  }),
  unbindActiveProductDocument: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef("activeProduct");
  }),
  addStore: firestoreAction(async function ({ bindFirestoreRef, state }, data) {
    const ref = await this.$fire.firestore.collection("stores").add(data);
    await bindFirestoreRef("activeStore", ref, { wait: true });
    return this.$fire.firestore
      .collection("userData")
      .doc(state.user.uid)
      .set({ stores: [ref] }, { merge: true });
  }),
  updateStore: firestoreAction(async function ({ state }, data) {
    return this.$fire.firestore
      .collection("stores")
      .doc(state.activeStore.id)
      .set(data, { merge: true });
  }),
};
export const getters = {
  products(state) {
    return state.products;
  },
  activeStore(state) {
    return state.activeStore;
  },
  activeProduct(state) {
    return state.activeProduct;
  },
  stores(state) {
    return state.userData.stores;
  },
  user(state) {
    return state.user;
  },
  storeFront(state) {
    if (state.storeFront === null || state.storeFront.length < 1) {
      return null;
    } else {
      return state.storeFront[0];
    }
  },
  userData(state) {
    return state.userData;
  },
  storeFrontProducts(state) {
    return state.storeFrontProducts;
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
