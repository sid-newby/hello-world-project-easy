import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { componentsDataType } from "../data/componentsData"; // Assuming componentsDataType is exported from here

// Moved from LeftSidebar.tsx to resolve Fast Refresh warning
export const generateMenuList = (
  componentsData: componentsDataType,
  device: "desktop" | "mobile",
  onClick?: () => void,
  location?: ReturnType<typeof useLocation> // Keep location optional as it might not always be passed
) => {
  return componentsData.map((data, index) => {
    return (
      <div className="flex items-center mb-4 gap-2" key={index}>
        <li
          className={classNames(
            "inliine-block hover:underline hover:underline-offset-8", // Note: "inliine" might be a typo, should be "inline"?
            {
              "font-bold underline underline-offset-8":
                location?.pathname.includes(data.path) && device === "desktop",
            }
          )}
          onClick={onClick && onClick}
        >
          <Link to={`/components/${data.path}`}>{data.name}</Link>
        </li>
        {data.new && (
          <span className="text-xs bg-violet-200 px-2 py-1 rounded">New</span>
        )}
      </div>
    );
  });
};
