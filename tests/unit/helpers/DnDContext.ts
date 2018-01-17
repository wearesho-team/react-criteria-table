export const DndContext = {
    dragDropManager: {
        getMonitor: () => ({
            subscribeToStateChange: () => ({
                connectDragSource: () => () => undefined
            }),
        }),
        getBackend: () => undefined,
        getRegistry: () => ({
            addSource: () => ({
                connectDragSource: () => undefined
            }),
            removeSource: () => undefined,
            addTarget: () => undefined,
            removeTarget: () => undefined
        }),
    }
};
