import type { CollectionConfig } from "payload/types";

export const Bookmarks: CollectionConfig = {
  slug: "bookmarks",
  fields: [
    { name: "icon", type: "text" },
    { name: "title", type: "text", required: true, index: true },
    { name: "url", type: "text", required: true, index: true },
  ],
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
};
