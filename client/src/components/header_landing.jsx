import { useState } from "react";
import Notification from "./notification";
export default function Navbar_landing() {
  return (
    
    <div>
      <nav className="bg-white w-full py-1 fixed top-0 left-0">
        {/* Flexbox for proper alignment */}
        <div className="container flex justify-between items-center py-1 px-4">
          {/* Left - Logo */}
          <a href="/">
            <img src="src/assets/uplblogo.png" className="bg-none w-40 h-auto" draggable="false" alt="UPLB Logo" />
          </a>
        </div>
      </nav>
    </div>
  );
}
