import { NotificationMessage } from "../lib/classes/notification";
import { Status } from "../types";

export const NotificationTemplate = (
    notification: NotificationMessage
): string => {
    const colors =
        notification.type === Status.Notice
            ? {
                  border: "border-light-blue",
                  bg: "bg-blue",
                  hover: "hover:bg-dark-blue",
              }
            : {
                  border: "border-maroon",
                  bg: "bg-red",
                  hover: "hover:bg-dark-red",
              };

    return `<div
        class="notification m-2 h-auto w-64 rounded-md border-2 ${colors.border} ${colors.bg} cursor-pointer ${colors.hover} transition-all"
    >
        <div class="m-2 flex flex-col">
            <div class="flex space-x-1 align-middle">
                <svg
                    class="w-4"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        class="fill-white"
                        fill-rule="evenodd"
                        d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z"
                    />
                </svg>
                <span class="font-monospace text-[14px] text-white"
                    >${notification.type}</span
                >
            </div>
            <span class="font-monospace text-[14px] text-white"
                >${notification.message}</span
            >
        </div>
    </div>`;
};
