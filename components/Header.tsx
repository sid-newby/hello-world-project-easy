import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import menuIcon from "../assets/menu.svg"; // Correct path
import closeIcon from "../assets/close.svg"; // Correct path
import githubIcon from "../assets/github.svg"; // Correct path

const Header = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);

  const closeSideMenu = () => {
    setShowSideMenu(false);
  };
  return (
    <header className="bg-[color:var(--c-bg)] h-20 w-full fixed top-0 z-40 border-b-2 border-[color:var(--c-stroke)]"> 
      <div className="max-w-[1200px] w-full h-full mx-auto flex justify-between items-center px-4"> 
        {/* Updated Link text/style to be more generic for PitchCraft */}
        <Link to="/" className="text-2xl font-bold text-[color:var(--c-fg)]">
          PitchCraft
        </Link>
        {/* Kept original nav structure for now, might need adjustment later */}
        <nav className="hidden md:block">
          <ul className="flex justify-end items-center space-x-4">
            <li className="inline-block p-2 cursor-pointer">
              <a
                href="https://github.com/sidnewby/PitchCraft"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={githubIcon} alt="github" className="w-6 h-6" />
              </a>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </nav>
        <button
          className="md:hidden"
          onClick={() => {
            setShowSideMenu(true);
          }}
        >
          <img src={menuIcon} alt="menu" className="w-6 h-6" />
        </button>
      </div>
      {/* side menu for mobile - kept structure, content might need adjustment */}
      <div
        className={`navbar-menu relative z-50 ${
          showSideMenu ? "block" : "hidden"
        }`}
      >
        <div
          className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"
          onClick={closeSideMenu}
        ></div>
        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm bg-[color:var(--c-bg)] border-r overflow-y-auto">
          <div className="flex justify-center items-center h-20 p-5 border-b-2 border-black"> {/* Added border */}
            <Link
              to="/"
              className="mr-auto text-2xl font-bold leading-none"
              onClick={closeSideMenu}
            >
              PitchCraft {/* Updated text */}
            </Link>
            <div>
              <button className="navbar-close" onClick={closeSideMenu}>
                <img src={closeIcon} alt="close" className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-5">
            <ul className="flex flex-col">
              {/* Removed Getting Started section, adjust as needed */}
              {/* <div className="pb-8">
                <span className="text-lg font-bold block mb-4">
                  Getting started
                </span>
                <li
                  className="inliine-block hover:underline hover:underline-offset-8 mb-4"
                  onClick={closeSideMenu}
                >
                  <Link to={"/overview"}>Overview</Link>
                </li>
              </div> */}
              {/* Removed Components section, adjust as needed */}
              {/* <div className="pb-12">
                <span className="text-lg font-bold block mb-4">Components</span>
                {generateMenuList(componentsData, "mobile", closeSideMenu)}
              </div> */}
              <div className="pb-4 mt-auto flex flex-col gap-2 items-start">
                <li className="inline-block cursor-pointer">
                  <a
                    href="https://github.com/sidnewby/PitchCraft"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={githubIcon} alt="github" className="w-6 h-6" />
                  </a>
                </li>
                <li className="inline-block">
                  <LogoutButton />
                </li>
              </div>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
