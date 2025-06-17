import { useEffect, useState } from "react";

const useMacOS = () => {
  const [isMacOS, setIsMacOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMac =
      userAgent.includes("mac") &&
      !userAgent.includes("iphone") &&
      !userAgent.includes("ipad");
    setIsMacOS(isMac);
  }, []);

  return isMacOS;
};

export default useMacOS;
