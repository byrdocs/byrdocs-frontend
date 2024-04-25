
import { Search } from "@/components/search";
import { Link } from "react-router-dom";

import '@fontsource-variable/saira';

function App() {
  return (
    <>
      <Search />
      <footer>
        <div className="w-full m-auto h-12 mt-12">
          <div className="text-center text-muted-foreground">
          <Link to="/about">关于我们</Link> | <a href="/s/">文件列表</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
