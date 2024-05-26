import { Bookmark } from "@/payload-types";
import qs from "qs";
import { toast } from "sonner";

export const fetchBookmarks = async (
  searchInput: string,
): Promise<Bookmark[] | null> => {
  try {
    const res = await fetch(
      `/api/bookmarks?${qs.stringify({
        where: {
          or: [
            { title: { like: searchInput.toLowerCase() } },
            { url: { like: searchInput.toLowerCase() } },
          ],
        },
        limit: 5,
      })}`,
    );
    if (res.status !== 200) {
      toast.error("Fail to get bookmarks", {
        description: (await res.json()).message,
      });
      return null;
    }
    const bookmarks = await res.json();
    return bookmarks.docs as Bookmark[];
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Failed to get bookmarks", {
        description: error.message,
      });
      return null;
    }
    toast.error("Failed to get bookmarks", {
      description: `An unknown error occurred: ${JSON.stringify(error)}`,
    });
    return null;
  }
};
