import * as PropTypes from "prop-types";

import { TableColumn } from "../../TableColumn";

export interface SettingsTreeItemProps {
    onMove: (from: string, to: string) => void;
    columnData: TableColumn;
    activeTableKey: string;
    onSaveData: () => void;
    groupId: string;

    // dnd props
    connectDropTarget?: (arg: JSX.Element) => JSX.Element;
    connectDragSource?: (arg: JSX.Element) => JSX.Element;
}

export const SettingsTreeItemPropTypes: {[P in keyof SettingsTreeItemProps]: PropTypes.Validator<any>} = {
    columnData: PropTypes.instanceOf(TableColumn).isRequired,
    activeTableKey: PropTypes.string.isRequired,
    onSaveData: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    onMove: PropTypes.func.isRequired,

    // dnd props
    connectDropTarget: PropTypes.func,
    connectDragSource: PropTypes.func
};
