import { useEffect } from "react";
import { useTimeout } from "./useTimeout";
import axios from "axios";

export const useDebounce = (callback, delay, deps) => {
  const { reset, clear } = useTimeout(callback, delay);

  useEffect(reset, [...deps, reset]);
  useEffect(clear, []);
};
