import addIcon from "../assets/add.svg";
import editIcon from "../assets/edit.svg";
import gearIcon from "../assets/gear.svg";
import Button from "../components/Button";
import Card from "../components/Card";
import Checkbox from "../components/Checkbox";
import Dialog from "../components/Dialog";
import DropDown from "../components/DropDown";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import ToggleSwitch from "../components/ToggleSwitch";
import ProgressBar from "../components/ProgressBar";
// Removed markup imports as they are likely for documentation

// Removed SampleImage import

export type componentsDataType = {
  name: string;
  path: string;
  component: React.ReactNode;
  // Removed markup property as it's likely for documentation
  new?: boolean;
}[];

const componentsData: componentsDataType = [
  {
    name: "Card",
    path: "card",
    component: (
      <div className="w-80">
        <Card
          // Removed thumbnail prop using SampleImage
          date="June 15th, 2023"
          title="Neo Brutallism Card Example" // Updated title
          description="This is an example description for the card component." // Updated description
          callToActionText="Learn More" // Updated CTA text
          calllToActionLink="#" // Use a placeholder link
        />
      </div>
    ),
    // Removed markup property
  },
  {
    name: "Button",
    path: "button",
    component: (
      <div className="flex justify-evenly space-x-6">
        <Button buttonText="Button" />
        <Button buttonText="Button" rounded="md" />
        <Button buttonText="Button" rounded="full" />
      </div>
    ),
    // Removed markup property
  },
  {
    name: "IconButton",
    path: "iconButton",
    component: (
      <>
        <div className="grid grid-cols-3 gap-4">
          <IconButton icon={addIcon} color="pink" />
          <IconButton icon={addIcon} color="pink" rounded="md" />
          <IconButton icon={addIcon} color="pink" rounded="full" />

          <IconButton icon={editIcon} color="cyan" />
          <IconButton icon={editIcon} color="cyan" rounded="md" />
          <IconButton icon={editIcon} color="cyan" rounded="full" />

          <IconButton icon={gearIcon} color="lime" />
          <IconButton icon={gearIcon} color="lime" rounded="md" />
          <IconButton icon={gearIcon} color="lime" rounded="full" />
        </div>
      </>
    ),
    // Removed markup property
  },
  {
    name: "Input",
    path: "input",
    component: (
      <div className="md:w-96 flex flex-col space-y-6">
        <Input placeholder="you@example.com" />
        <Input placeholder="you@example.com" rounded="md" />
        <Input placeholder="you@example.com" rounded="full" />
      </div>
    ),
    // Removed markup property
  },
  {
    name: "Dialog",
    path: "dialog",
    component: (
      <Dialog
        message="The message you want goes in here."
        actionButtonText="Enabled"
        cancelButtonText="Cancel"
      />
    ),
    // Removed markup property
  },
  {
    name: "Checkbox",
    path: "checkbox",
    component: <Checkbox />,
    // Removed markup property
  },

  {
    name: "DropDown",
    path: "dropdown",
    component: (
      <DropDown
        title="Options"
        list={[
          { to: "#", name: "Account settings" },
          { to: "#", name: "Support" },
          { to: "#", name: "License" },
        ]}
      />
    ),
    // Removed markup property
  },
  {
    name: "ToggleSwitch",
    path: "toggleSwitch",
    component: <ToggleSwitch text="Toggle me" />,
    // Removed markup property
  },
  {
    name: "ProgressBar",
    path: "progressBar",
    component: <ProgressBar currentValue={70} rounded="full" color="lime" />,
    // Removed markup property
    new: true,
  },
];

export default componentsData;