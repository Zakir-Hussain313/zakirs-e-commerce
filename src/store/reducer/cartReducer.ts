import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 0,
    products: []
};

const cartReducer = createSlice({
    name: "cartStore",
    initialState,
    reducers: {
        addIntoCart: (state, action) => {
            const payload = action.payload;
            const existingProduct = state.products.findIndex(
                (product) => product.productId === payload.productId && product.varientId === payload.varientId
            )
            if (existingProduct < 0) {
                state.products.push(payload);
                state.count = state.products.length;
            }
        },
        increaseQuantity: (state, action) => {
            const { productId, varientId } = action.payload;
            const existingProduct = state.products.findIndex(
                (product) => product.productId === productId && product.varientId === varientId
            )
            if (existingProduct >= 0) {
                state.products[existingProduct].qty += 1
            }
        },
        decreaseQuantity: (state, action) => {
            const { productId, varientId } = action.payload;
            const existingProduct = state.products.findIndex(
                (product) => product.productId === productId && product.varientId === varientId
            )
            if (existingProduct >= 0) {
                if (state.products[existingProduct].qty > 1) {
                    state.products[existingProduct].qty -= 1
                }
            }
        },
        removeFromCart: (state, action) => {
            const { productId, varientId } = action.payload;
            state.products = state.products.filter((product) => !(product.productId === productId && product.varientId === varientId))

            state.count = state.products.length;
        },
        clearCart: (state) => {
            state.products = [];
            state.count = 0
        }
    },
});

export const {
    addIntoCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
} = cartReducer.actions;

export default cartReducer.reducer;
