import LibraryBrowser from "./library-browser";
import { getLibraryDocuments } from "@/lib/library-documents";

export default async function LegalLibraryPage() {
  const documents = await getLibraryDocuments();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <LibraryBrowser documents={documents} />
    </div>
  );
}
