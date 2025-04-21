import classNames from "classnames";
import { Outlet } from "react-router-dom"; // Keep Outlet, remove others

// Renamed from LeftSidebar
const AppLayout = () => {
  return (
    // Section no longer needs flex as there's only one child
    <section className="w-full">
      {/* Main Content Area - Takes full width now */}
      <div
        className={classNames(
          "bg-[color:var(--c-bg)] w-full min-h-screen" // Removed sidebar-related width/margin
        )}
      >
        <Outlet /> {/* Renders the page content */}
      </div>
    </section>
  );
};

export default AppLayout; // Update export name
