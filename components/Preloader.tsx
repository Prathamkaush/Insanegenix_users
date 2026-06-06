"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 450);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div id="loading">
      <div id="loading-center">
        <div id="loading-center-absolute">
          <div className="eg-loader">
            <div className="eg-loader-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
