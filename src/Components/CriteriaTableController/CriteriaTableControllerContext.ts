import * as PropTypes from "prop-types";

import { TableColumnRepository, TableColumn } from "../TableColumn";
import { ControlActions } from "../CriteriaTable";

export interface CriteriaTableControllerContext {
    initData: (id: string, data: Array<Partial<TableColumn>>) => TableColumnRepository;
    getCurrentVisibleData: (id: string) => Array<TableColumn>;
    getColumn: (id: string, nodeId: string) => TableColumn;
    getCurrentData: (id: string) => TableColumnRepository;
    onError: (message: string) => void;
    saveData: (id: string) => void;

    getControlAction: (tableId: string, actionName: ControlActions) => () => any;
    bindControlAction: (tableId: string, actionName: ControlActions, action: (...args) => void) => void;
    unbindControlAction: (tableId: string, actionName: ControlActions) => void;

    enableCaching: boolean;
}

export const CriteriaTableControllerContextTypes:
    {[P in keyof CriteriaTableControllerContext]: PropTypes.Validator<any>} = {
        getCurrentVisibleData: PropTypes.func.isRequired,
        getCurrentData: PropTypes.func.isRequired,
        getColumn: PropTypes.func.isRequired,
        initData: PropTypes.func.isRequired,
        saveData: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,

        getControlAction: PropTypes.func.isRequired,
        bindControlAction: PropTypes.func.isRequired,
        unbindControlAction: PropTypes.func.isRequired,

        enableCaching: PropTypes.bool.isRequired,
    };
