import { PaperShelf } from "@/components/PaperShelf";
import { Bookshelf } from "@/components/Bookshelf";

const Archives = () => {
  return (
    <div id="archives" className="flex flex-col min-h-screen">
      <PaperShelf />
      <Bookshelf />
    </div>
  );
};

export default Archives;
