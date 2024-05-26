import { StaticCommand } from "@/components/command-pallete/static-command";
import { CommandGroup } from "@/components/ui/command";
import { useTheme } from "next-themes";
import { Dispatch, FC, SetStateAction } from "react";

export const StaticCommandGroup: FC<{
  baseKey: "Ctrl" | "⌘" | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openAddBookmarkDialog: boolean;
  setOpenAddBookmarkDialog: Dispatch<SetStateAction<boolean>>;
}> = ({
  baseKey,
  setOpen,
  openAddBookmarkDialog,
  setOpenAddBookmarkDialog,
}) => {
  const { theme, setTheme } = useTheme();
  const STATIC_COMMAND_GROUPS: {
    title: string;
    commands: {
      icon: string;
      title: string;
      shortcut: string;
      onSelect: () => void | Promise<void>;
    }[];
  }[] = [
    {
      title: "Bookmarks Commands",
      commands: [
        {
          icon: "➕",
          title: "Add Bookmark",
          shortcut: "Q",
          onSelect: () => setOpenAddBookmarkDialog(true),
        },
      ],
    },
    {
      title: "Setting & Preferences",
      commands: [
        {
          icon: theme === "light" ? "🌙" : "☀️",
          title: "Toggle Light/Dark Mode",
          shortcut: "L",
          onSelect: () => setTheme(theme === "light" ? "dark" : "light"),
        },
      ],
    },
  ];

  return (
    <>
      {STATIC_COMMAND_GROUPS.map((group, i) => (
        <CommandGroup heading={group.title} key={i}>
          {group.commands.map((command) => (
            <StaticCommand
              key={command.title}
              icon={command.icon}
              title={command.title}
              baseKey={baseKey}
              shortcut={command.shortcut}
              onSelect={command.onSelect}
              setOpen={setOpen}
            />
          ))}
        </CommandGroup>
      ))}
    </>
  );
};
