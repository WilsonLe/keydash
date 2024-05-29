"use client";

import { AddBookmarkDialog } from "@/components/command-pallete/add-bookmark-dialog";
import { BookmarkSearchResult } from "@/components/command-pallete/bookmark-search-result";
import { StaticCommandGroup } from "@/components/command-pallete/static-command-group";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { fetchBookmarks } from "@/lib/fetch-bookmarks";
import { useBaseKey } from "@/lib/use-base-key";
import useDebounce from "@/lib/use-debouce";
import { Bookmark as TBookmark } from "@/payload-types";
import { useEffect, useState } from "react";

const useOpen = () => {
  const [openAddBookmarkDialog, setOpenAddBookmarkDialog] = useState(false);
  const [openCommandPallete, setOpenCommandPallete] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) return;
      if (e.key !== "k") return;
      e.preventDefault();
      setOpenCommandPallete(true);
      setOpenAddBookmarkDialog(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return {
    openCommandPallete,
    setOpenCommandPallete,
    openAddBookmarkDialog,
    setOpenAddBookmarkDialog,
  };
};

export function CommandPallete() {
  const {
    openCommandPallete,
    setOpenCommandPallete,
    openAddBookmarkDialog,
    setOpenAddBookmarkDialog,
  } = useOpen();
  const { baseKey } = useBaseKey();
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<
    TBookmark[] | null | undefined
  >(undefined);

  const deboucedSearchResult = useDebounce(async (searchInput) => {
    const bookmarks = await fetchBookmarks(searchInput);
    if (bookmarks !== null) return bookmarks;
  }, 300);
  useEffect(() => {
    deboucedSearchResult(searchInput);
  }, [searchInput]);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-sm">{baseKey}</span>+
          <span className="text-lg">K</span>
        </kbd>
      </p>
      <CommandDialog
        open={openCommandPallete}
        onOpenChange={setOpenCommandPallete}
        onClickOutside={() => setOpenCommandPallete(false)}
        onEscape={() => setOpenCommandPallete(false)}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={searchInput}
          onValueChange={setSearchInput}
        />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList>
          <BookmarkSearchResult searchResult={searchResult} />
          <StaticCommandGroup
            baseKey={baseKey}
            setOpen={setOpenCommandPallete}
            openAddBookmarkDialog={openAddBookmarkDialog}
            setOpenAddBookmarkDialog={setOpenAddBookmarkDialog}
          />
        </CommandList>
      </CommandDialog>
      <AddBookmarkDialog
        open={openAddBookmarkDialog}
        setOpen={setOpenAddBookmarkDialog}
        baseKey={baseKey}
      />
    </>
  );
}
