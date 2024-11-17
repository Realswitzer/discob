import { refreshNewline } from "../../../utils";

let resizeTimer: NodeJS.Timeout
export function windowResizeHandler() {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
        refreshNewline()
    }, 50);
}