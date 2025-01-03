import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      <SignUp path="/sign-up" signInUrl="/login" />
    </div>
  );
};

export default SignUpPage;
