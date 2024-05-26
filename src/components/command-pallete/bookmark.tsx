import { CommandItem } from "@/components/ui/command";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const Bookmark: FC<{
  icon?: string;
  title: string;
  url: string;
}> = ({ icon, title, url }) => {
  return (
    <Link href={url}>
      <CommandItem
        onSelect={() => {
          open(url, "_blank");
        }}
      >
        {icon?.startsWith("http") ? (
          <Image
            src={icon}
            alt={title}
            height={32}
            width={32}
            className="mr-2"
          />
        ) : (
          <div className="mr-2">{icon}</div>
        )}
        <div>
          <p className="text-bold">{title}</p>
          <p className="text-xs text-muted-foreground">{url}</p>
        </div>
      </CommandItem>
    </Link>
  );
};
