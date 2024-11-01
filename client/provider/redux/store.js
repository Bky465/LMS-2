import { configureStore } from "@reduxjs/toolkit";
import { AuthApi } from "./query/Auth";
import { setupListeners } from "@reduxjs/toolkit/query";
export const store= configureStore({
    reducer:{
        [AuthApi.reducerPath]: AuthApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(AuthApi.middleware),
    
})

setupListeners(store.dispatch)


