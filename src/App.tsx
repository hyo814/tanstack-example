import React from 'react';
import InfiniteScroll from './InfiniteScroll';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InfiniteScroll />
    </QueryClientProvider>
  );
};

export default App;
