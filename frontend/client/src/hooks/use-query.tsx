import { useLocation } from "react-router";

export function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}
