"use client";

import { Button } from "@/components/ui/button";
import { Printer, Share2 } from "lucide-react";

type DocumentActionsProps = {
  title: string;
};

export default function DocumentActions({ title }: DocumentActionsProps) {
  const handleShare = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => window.print()}
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
    </div>
  );
}
