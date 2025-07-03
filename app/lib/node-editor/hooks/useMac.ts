/*
 * Authors: Philipp Wendt
 *
 * Purpose:
 * Custom hook to determine if the user's operating system is macOS.
 */
import { useEffect, useState } from "react";

/**
 * Custom hook to determine if the user's operating system is macOS.
 * It checks the user agent string to identify macOS and excludes iOS devices.
 *
 * @returns {boolean} - True if the OS is macOS, false otherwise.
 */
const useIsMac = () => {
  const [isMac, setIsMacOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMac =
      userAgent.includes("mac") &&
      !userAgent.includes("iphone") &&
      !userAgent.includes("ipad");
    setIsMacOS(isMac);
  }, []);

  return isMac;
};

export default useIsMac;
