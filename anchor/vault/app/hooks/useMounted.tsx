import { useEffect, useState } from "react";

export default function useMounted() {
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);

  return mounted;
}
