"use client";
import React from 'react';
import { AuthContext } from './AuthContext';

const authData = {
    user: 'user data'
}
const AuthProvider = ({children}) => {
    return <AuthContext value={authData}>
      {children}
    </AuthContext>
};

export default AuthProvider;