import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Returning to homepage with browser BACK
    if (pathname === "/" && navigationType === "POP") {
      const savedPosition = sessionStorage.getItem(
        "homepageReturnPosition"
      );

      if (savedPosition !== null) {
        const position = Number(savedPosition);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: position,
              left: 0,
              behavior: "instant",
            });

            sessionStorage.removeItem("homepageReturnPosition");
          });
        });

        return;
      }

      // No saved section position = return to homepage top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      return;
    }

    // Normal navigation to a new page
    if (navigationType === "PUSH") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname, navigationType]);

  return null;
}

export default ScrollToTop;