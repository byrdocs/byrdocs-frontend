import { FuseSearch } from "./fuseSearch"
import { MeiliSearch } from "./meiliSearch"
import { ErrorBoundary } from "react-error-boundary";


export function Search() {
    return (<ErrorBoundary fallback={<FuseSearch />}>
        <MeiliSearch />
    </ErrorBoundary>)

}