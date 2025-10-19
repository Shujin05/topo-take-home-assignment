import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useLocation } from "react-router-dom";

type UseQueryParamsStateReturnType<T> = [T, Dispatch<SetStateAction<T>>];

export const useQueryParamsState = <T>(
  param: string,
  initialState: T
): UseQueryParamsStateReturnType<T> => {
  const location = useLocation();

  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialState;

    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    const paramValue = searchParams.get(param);

    return paramValue !== null ? JSON.parse(paramValue) as T : initialState;
  });

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(window.location.search);

    if (value !== null && value !== "") {
      currentSearchParams.set(param, JSON.stringify(value));
    } else {
      currentSearchParams.delete(param);
    }

    const newUrl = [window.location.pathname, currentSearchParams.toString()]
      .filter(Boolean)
      .join("?");

    window.history.replaceState(window.history.state, "", newUrl);
  }, [param, value, location.pathname]);

  return [value, setValue];
};
