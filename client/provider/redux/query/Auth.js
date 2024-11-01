import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/user/' }),
    endpoints: (builder) => ({
        userSignup: builder.mutation({
            query: (user) => {
                return {
                    url: 'register',
                    method: 'POST',
                    body: {
                        ...user,
                        roles: 'user'
                    },
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            }
        }),
        verifyEmail: builder.mutation({
            query: (verifyEmail) => {
                return {
                    url: 'verify-email',
                    method: 'POST',
                    body: verifyEmail,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            }
        }),

        userSignin: builder.mutation({
            query: (user) => {
                return {
                    url: 'login',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json'
                    },
                    credentials: 'include' // it is require to set cookies
                }
            }
        }),

        generateResetPasswordLink: builder.mutation({
            query: (email) => {
                return {
                    url: 'password-reset-link',
                    method: 'POST',
                    body: email,
                    headers: {
                        'Content-type': 'application/json'
                    },
                }
            }
        }),

        resetPasswordConfirm: builder.mutation({
            query: (data) => {
                const { id, token, ...values } = data
                const bodyData = { ...values }
                console.log(id, token, bodyData);

                return {
                    url: `/password-reset/${id}/${token}`,
                    method: 'POST',
                    body: bodyData,
                    headers: {
                        'Content-type': 'application/json'
                    },
                }
            }
        }),

        changePassword: builder.mutation({
            query: (data) => {
                return {
                    url: 'change-password',
                    method: 'POST',
                    body: data,
                    headers: {
                        'Content-type': 'application/json'
                    },
                    credentials: 'include' // it is require to set cookies
                }
            }
        }),
        userLogout: builder.mutation({
            query: () => {
                return {
                    url: 'logout',
                    method: 'POST',
                    body: {},
                    headers: {
                        'Content-type': 'application/json'
                    },
                    credentials: 'include' // it is require to set cookies
                }
            }
        }),
        getUserDetails: builder.query({
            query: () => {
                return {
                    url: 'me',
                    method: 'GET',
                    credentials: 'include' // it is require to set cookies
                }
            }
        }),


    }),
});

export const { useUserSignupMutation, useVerifyEmailMutation, useUserSigninMutation, useGenerateResetPasswordLinkMutation, useResetPasswordConfirmMutation, useUserLogoutMutation, useChangePasswordMutation, useGetUserDetailsQuery} = AuthApi;
