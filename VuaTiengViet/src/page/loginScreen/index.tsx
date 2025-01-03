import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      <SignIn path="/login" fallbackRedirectUrl="/" signUpUrl="/sign-up" />
    </div>
  );
};

export default LoginPage;
