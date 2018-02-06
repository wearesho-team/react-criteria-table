import * as PropTypes from "prop-types";

import { TableColumn } from "../../TableColumn";

export interface SettingsTreeItemProps {
    columnData: TableColumn;
    activeTableKey: string;
    onSaveData: () => void;
}

export const SettingsTreeItemPropTypes: {[P in keyof SettingsTreeItemProps]: PropTypes.Validator<any>} = {
    columnData: PropTypes.instanceOf(TableColumn).isRequired,
    activeTableKey: PropTypes.string.isRequired,
    onSaveData: PropTypes.func.isRequired
};
