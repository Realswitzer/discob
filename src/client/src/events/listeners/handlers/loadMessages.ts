import { appendMessages } from "../../../utils";

export function loadHandler() {
    if (localStorage.getItem("token")) {
        (async () => {
            await appendMessages("public", 50, 0);
        })();
    }
}
