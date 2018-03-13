import * as PropTypes from "prop-types";

import { CriteriaTableState } from "./CriteriaTable";
import { TableColumn } from "../TableColumn";

export interface CriteriaTableProps {
    onDefaults: (state: CriteriaTableState) => () => Array<Partial<TableColumn>>;
    onFetchData: (state: Partial<CriteriaTableState>) => Promise<Partial<CriteriaTableState>>;
    cacheKey: string;

    previousText?: string;
    loadingText?: string;
    noDataText?: string;
    pageText?: string;
    nextText?: string;
    rowsText?: string;
    ofText?: string;

    sorted?: Array<{ desc: boolean, id: string }>;
    autoFetchDelay?: number;
    autoFetch?: boolean;
    pageSize?: number;
    pages?: number;
    page?: number;
    data?: any;
}

export const CriteriaTablePropTypes: {[P in keyof CriteriaTableProps]: PropTypes.Validator<any>} = {
    onFetchData: PropTypes.func.isRequired,
    onDefaults: PropTypes.func.isRequired,
    cacheKey: PropTypes.string.isRequired,

    previousText: PropTypes.string,
    loadingText: PropTypes.string,
    noDataText: PropTypes.string,
    pageText: PropTypes.string,
    nextText: PropTypes.string,
    rowsText: PropTypes.string,
    ofText: PropTypes.string,

    autoFetchDelay: PropTypes.number,
    pageSize: PropTypes.number,
    autoFetch: PropTypes.bool,
    pages: PropTypes.number,
    page: PropTypes.number,
    data: PropTypes.any,
    sorted: PropTypes.arrayOf(PropTypes.shape({
        desc: PropTypes.bool.isRequired,
        id: PropTypes.string.isRequired
    }))
};

export const CriteriaTableDefautProps: {[P in keyof CriteriaTableProps]?: CriteriaTableProps[P]} = {
    noDataText: "Записи не найдены",
    loadingText: "Загрузка...",
    previousText: "Назад",
    pageText: "Страница",
    nextText: "Вперед",
    rowsText: "строк",
    ofText: "из",

    data: { list: [], total: {}, count: 0 },
    sorted: [{ desc: false, id: "id" }],
    autoFetchDelay: 60000,
    autoFetch: true,
    pageSize: 10,
    pages: 1,
    page: 0
};
