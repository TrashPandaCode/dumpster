import { useEffect, useState } from "react";

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
