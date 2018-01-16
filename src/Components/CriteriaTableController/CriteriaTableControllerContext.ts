import * as PropTypes from "prop-types";

import { IdentifiableTableColumn, TableColumnRepository, TableColumn } from "../TableColumn";

export interface CriteriaTableControllerContext {
    initData: (id: string, data: Array<IdentifiableTableColumn>) => TableColumnRepository;
    getCurrentVisibleData: (id: string) => Array<TableColumn>;
    getColumn: (id: string, nodeId: string) => TableColumn;
    getCurrentData: (id: string) => TableColumnRepository;
    onError: (message: string) => void;
    saveData: (id: string) => void;
}

export const CriteriaTableControllerContextTypes:
    {[P in keyof CriteriaTableControllerContext]: PropTypes.Validator<any>} = {
        getCurrentVisibleData: PropTypes.func.isRequired,
        getCurrentData: PropTypes.func.isRequired,
        getColumn: PropTypes.func.isRequired,
        initData: PropTypes.func.isRequired,
        saveData: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired
    };
