export const MenuTemplate = (): string => {
    return `<div class="flex w-48 flex-col rounded-md bg-mantle p-1">
      <button class="reply group flex items-center justify-between rounded-md bg-mantle p-2 transition-all hover:bg-text">
        <span class="text-text group-hover:text-mantle">Reply</span>
        <svg class="text-text group-hover:text-mantle" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"></path>
        </svg>
      </button>
    </div>`;
};
