import { RouterProvider } from 'react-router-dom';
import './styles/index.css';
import { routes } from './routes';

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={routes} />
    </ClerkProvider>
  );
}
export default App;
