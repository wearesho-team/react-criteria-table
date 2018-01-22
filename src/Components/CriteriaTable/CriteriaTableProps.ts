import * as PropTypes from "prop-types";

import { CriteriaTableState } from "./CriteriaTable";
import { TableColumn } from "../TableColumn";

export interface CriteriaTableProps {
    onDefaults: (state: CriteriaTableState) => () => Array<Partial<TableColumn>>;
    onFetchData: (state: Partial<CriteriaTableState>) => Promise<CriteriaTableState>;
    cacheKey: string;
    labels?: {
        previousText?: string;
        loadingText?: string;
        noDataText?: string;
        pageText?: string;
        nextText?: string;
        rowsText?: string;
        ofText?: string;
    }
}

export const CriteriaTablePropTypes: {[P in keyof CriteriaTableProps]: PropTypes.Validator<any>} = {
    onFetchData: PropTypes.func.isRequired,
    onDefaults: PropTypes.func.isRequired,
    cacheKey: PropTypes.string.isRequired
};

export const CriteriaTableDefautProps: {[P in keyof CriteriaTableProps]?: CriteriaTableProps[P]} = {
    labels: {
        noDataText: "Записи не найдены",
        loadingText: "Загрузка...",
        previousText: "Назад",
        pageText: "Страница",
        nextText: "Вперед",
        rowsText: "строк",
        ofText: "из",
    }
};
