
import { Search } from "@/components/search";
import { Link } from "react-router-dom";

import '@fontsource-variable/saira';
import { useState } from "react";
import { cn } from "@/lib/utils";

function App() {
  const [preview, setPreview] = useState(false);
  return (
    <>
      <Search onPreview={setPreview}/>
      <footer className={cn({
          "w-[60vw]": preview
        },
        "transition-all"
      )}>
        <div className="w-full m-auto h-12 mt-12">
          <div className="text-center text-muted-foreground">
          <Link to="/about">关于我们</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
