import { CommandItem, CommandShortcut } from "@/components/ui/command";
import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react";

export const StaticCommand: FC<{
  icon: string;
  title: string;
  baseKey: "Ctrl" | "⌘" | null;
  shortcut: string;
  onSelect: () => void | Promise<void>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ icon, title, baseKey, shortcut, onSelect, setOpen }) => {
  const _onSelect = useCallback(async () => {
    await onSelect();
    setOpen(false);
  }, [onSelect, setOpen]);

  useEffect(() => {
    const down = async (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) return;
      if (e.key !== shortcut.toLowerCase()) return;
      e.preventDefault();
      await _onSelect();
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [shortcut, _onSelect]);

  return (
    <CommandItem onSelect={_onSelect}>
      <div className="mr-2">{icon}</div>
      <span>{title}</span>
      <CommandShortcut>
        {baseKey ?? ""} + {shortcut.toUpperCase()}
      </CommandShortcut>
    </CommandItem>
  );
};
