import { useQuery } from '@tanstack/react-query';
import { BASEURL } from 'utils/base';

export async function fetchCurrentUser() {
  const response = await fetch(`${BASEURL}/api/user`);
  return response.json();
}

export async function useCurrentUser() {
  return useQuery(['currentUser'], fetchCurrentUser);
  // return useSWR('api/user', fetcher);
}

