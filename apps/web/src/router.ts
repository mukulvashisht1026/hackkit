import { useEffect, useState } from "react";

/** Minimal hash router: "#/demo" → "/demo". Hash keeps nginx/Vite config untouched. */
export function useHashRoute() {
  const get = () => window.location.hash.replace(/^#/, "") || "/";
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const f = () => setRoute(get());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return route;
}
