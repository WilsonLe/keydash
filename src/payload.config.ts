import { Bookmarks } from "@/models/bookmarks";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload/config";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: { disable: true },
  collections: [Bookmarks],
  editor: lexicalEditor({}),
  secret: process.env.KEYDASH_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    idType: "uuid",
    pool: { connectionString: process.env.DATABASE_URI || "" },
  }),
});
