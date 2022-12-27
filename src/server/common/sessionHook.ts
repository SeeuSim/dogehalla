import { useQuery } from '@tanstack/react-query';

export async function fetchCurrentUser() {
  const response = await fetch("api/user");
  return response.json();
}

export async function useCurrentUser() {
  return useQuery(['currentUser'], fetchCurrentUser);
  // return useSWR('api/user', fetcher);
}

