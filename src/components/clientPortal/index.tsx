import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ClientPortal(props: any) {
  const { target, children } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, target ? target.current : document.body);
}
