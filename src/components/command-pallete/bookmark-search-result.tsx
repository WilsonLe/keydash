import { Bookmark } from "@/components/command-pallete/bookmark";
import { CommandGroup } from "@/components/ui/command";
import { Bookmark as TBookmark } from "@/payload-types";
import { FC } from "react";

export const BookmarkSearchResult: FC<{
  searchResult: TBookmark[] | null | undefined;
}> = ({ searchResult }) => {
  return (
    <CommandGroup heading={"Bookmarks"}>
      {searchResult?.map((bm) => (
        <Bookmark
          key={bm.id}
          icon={bm.icon ?? undefined}
          title={bm.title}
          url={bm.url}
        />
      ))}
    </CommandGroup>
  );
};
