export const SkeletonTemplate = (): string => {
    return `<div role="status" class="skeleton p-2 max-w-full animate-pulse">
        <div class="h-[16px] bg-surface-2 rounded-full max-w-[150px] mb-4"></div>
        <div
            class="h-[14px] bg-surface-2 rounded-full max-w-full mr-[100px] mb-2.5"
        ></div>
        <div
            class="h-[14px] bg-surface-2 rounded-full max-w-full mr-[250px] mb-2.5"
        ></div>
        <div
            class="h-[14px] bg-surface-2 rounded-full max-w-full mr-[50px] mb-2.5"
        ></div>
        <div
            class="h-[14px] bg-surface-2 rounded-full max-w-full mr-[100px] mb-2.5"
        ></div>
        <div
            class="h-[14px] bg-surface-2 rounded-full max-w-full mr-[275px] mb-2.5"
        ></div>
    </div>`.repeat(5);
};
