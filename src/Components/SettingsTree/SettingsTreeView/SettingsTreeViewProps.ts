import * as PropTypes from "prop-types";

import { TableColumnRepository } from "../../TableColumn";

export interface SettingsTreeViewProps extends React.HTMLAttributes<HTMLElement> {
    childList: TableColumnRepository;
    activeTableKey: string;
}

export const SettingsTreeViewPropTypes: {[P in keyof SettingsTreeViewProps]: PropTypes.Validator<any>} = {
    childList: PropTypes.instanceOf(TableColumnRepository).isRequired,
    activeTableKey: PropTypes.string.isRequired
};

export const SettingsTreeViewDefaultProps: {[P in keyof SettingsTreeViewProps]?: SettingsTreeViewProps[P]} = {
    className: "jqtree_common jqtree-tree"
};
