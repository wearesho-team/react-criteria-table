import {findDOMNode} from "react-dom";
import {DragSource, DropTarget} from "react-dnd";

const TYPE = "tree-item";

const hover = (props, monitor, component) => {
    if (
        monitor.getItem().dragGroupId !== props.groupId // controll drag in group container
        || monitor.getItem().dragDataId === props.columnData.id // controll drag on itself
    ) {
        return;
    }

    props.onMove(monitor.getItem().dragDataId, props.columnData.id);
};

const drop = (props, monitor) => {
    findDOMNode(monitor.getItem().component).classList.remove("on-drag");
};

const beginDrag = (props, monitor, component) => {
    findDOMNode(component).classList.add("on-drag");

    return {
        dragDataId: props.columnData.id,
        dragGroupId: props.groupId,
        component
    };
};

const dragSourceConnect = (connect, monitor) => ({
    connectDragSource: connect.dragSource()
});

const dropTargetConnect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget()
});

export const DropTargetItem = process.env.NODE_ENV === "production"
    ? () => DropTarget(TYPE, {hover, drop}, dropTargetConnect)
    : () => () => undefined;
export const DragSourceItem = process.env.NODE_ENV === "production"
    ? () => DragSource(TYPE, {beginDrag}, dragSourceConnect)
    : () => () => undefined;
