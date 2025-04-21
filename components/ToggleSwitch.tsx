import classNames from "classnames";

type ToggleSwitchType = {
  color?: "violet" | "pink" | "red" | "orange" | "yellow" | "lime" | "cyan";
  text?: string;
  disabled?: boolean;
  className?: string;
};

const ToggleSwitch = ({
  color,
  text,
  disabled = false,
  className,
}: ToggleSwitchType) => {
  return (
    <label className="relative inline-flex items-center mb-5 cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        disabled={disabled}
      />
      <div
        className={classNames(
          "w-11 h-6 bg-[color:var(--c-bg)] rounded-full border-[1px] border-[var(--c-stroke)] peer-checked:bg-[color:var(--c-accent)] peer-checked:shadow-[var(--shadow-brutal)] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:w-4 after:h-4 after:bg-[color:var(--c-bg)] after:rounded-full after:border-[1px] after:border-[var(--c-stroke)] after:transition-all peer-checked:after:translate-x-5",
          // Using accent color for all toggles with different opacities
          {
            "peer-checked:opacity-90": color === "violet",
          },
          {
            "peer-checked:opacity-100": color === "pink",
          },
          {
            "peer-checked:opacity-95": color === "red",
          },
          {
            "peer-checked:opacity-85": color === "orange",
          },
          {
            "peer-checked:opacity-80": color === "yellow",
          },
          {
            "peer-checked:opacity-75": color === "lime",
          },
          {
            "peer-checked:opacity-70": color === "cyan",
          },
          className
        )}
      ></div>
      {text && <span className="ms-3 text-md font-medium text-[color:var(--c-fg)]">{text}</span>}
    </label>
  );
};

export default ToggleSwitch;
