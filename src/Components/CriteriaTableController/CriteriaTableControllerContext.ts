import * as PropTypes from "prop-types";

import { TableColumnRepository, TableColumn } from "../TableColumn";

export interface CriteriaTableControllerContext {
    initData: (id: string, data: Array<Partial<TableColumn>>) => TableColumnRepository;
    getCurrentVisibleData: (id: string) => Array<TableColumn>;
    getColumn: (id: string, nodeId: string) => TableColumn;
    getCurrentData: (id: string) => TableColumnRepository;
    onError: (message: string) => void;
    saveData: (id: string) => void;

    // table reset control methods bindings
    bindResetQueries: (action: () => void) => void;
    bindResetData: (action: () => void) => void;

    unbindResetQueries: (action: () => void) => void;
    unbindResetData: (action: () => void) => void;

    // binded reset control methods
    resetQueries?: () => void;
    resetData?: () => void;
}

export const CriteriaTableControllerContextTypes:
    {[P in keyof CriteriaTableControllerContext]: PropTypes.Validator<any>} = {
        getCurrentVisibleData: PropTypes.func.isRequired,
        getCurrentData: PropTypes.func.isRequired,
        getColumn: PropTypes.func.isRequired,
        initData: PropTypes.func.isRequired,
        saveData: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,

        bindResetData: PropTypes.func.isRequired,
        bindResetQueries: PropTypes.func.isRequired,

        unbindResetData: PropTypes.func.isRequired,
        unbindResetQueries: PropTypes.func.isRequired,

        resetData: PropTypes.func,
        resetQueries: PropTypes.func
    };
