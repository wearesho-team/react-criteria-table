import * as React from "react";

import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "./CriteriaTableControllerContext";
import { TableColumnRepository, TableColumn } from "../TableColumn";
import { CriteriaTableControllerProps } from "./CriteriaTableControllerProps";

export interface CriteriaTableControllerState {
    tables: Map<string, TableColumnRepository>;
}

export class CriteriaTableController extends React.Component<
    CriteriaTableControllerProps, CriteriaTableControllerState
    > {
    public static readonly childContextTypes = CriteriaTableControllerContextTypes;

    private readonly cacheSuffix = "-settings";

    constructor(props) {
        super(props);

        this.state = {
            tables: new Map()
        };
    }

    public getChildContext(): CriteriaTableControllerContext {
        return {
            saveData: this.saveData,
            onError: this.handleError,
            getColumn: this.getColumn,
            initData: this.getDefaultData,
            getCurrentData: this.getCurrentData,
            getCurrentVisibleData: this.getCurrentVisibleData
        };
    }

    public render(): JSX.Element {
        return this.props.children;
    }

    protected getDefaultData = (id: string, defaultData: Array<Partial<TableColumn>>): TableColumnRepository => {
        let cachedData: Array<Partial<TableColumn>>;
        const instanceData = new TableColumnRepository();

        try {
            cachedData = JSON.parse(window.localStorage.getItem(this.getCacheKey(id)));
        } catch (error) {
            this.handleError(error);
        }

        try {
            this.instantiateData(cachedData, defaultData).forEach((item: TableColumn) => instanceData.add(item));
        } catch (error) {
            this.handleError(error);
        }

        this.state.tables.set(id, instanceData);
        this.forceUpdate();

        return instanceData;
    }

    protected getCurrentData = (id: string): TableColumnRepository => {
        return this.state.tables.get(id);
    }

    protected getCurrentVisibleData = (id: string): Array<TableColumn> => {
        return this.getCurrentData(id).arrayList.filter((item: TableColumn) => item.updateVisible().show);
    }

    protected getColumn = (id: string, nodeId: string): TableColumn => {
        return this.getCurrentData(id).findById(nodeId);
    }

    protected saveData = (id: string): void => {
        window.localStorage.setItem(
            this.getCacheKey(id),
            JSON.stringify(this.getCurrentData(id).arrayList.map((item: TableColumn) => item.saveData()))
        );

        this.forceUpdate();
    }

    protected handleError = (message: string): void => {
        if (this.props.onError instanceof Function) {
            this.props.onError(message);
        }
    }

    private getCacheKey(id: string): string {
        return `${id}${this.cacheSuffix}`;
    }

    private mergeData = (
        cachedData: Array<Partial<TableColumn>>,
        defaultData: Array<Partial<TableColumn>>): Array<TableColumn> => (
            cachedData.map((item: TableColumn) => {
                const subtractedData = defaultData.find(({ id }) => id === item.id);
                return subtractedData && item.subtractData(subtractedData);
            })
        );

    private instantiateData = (
        cachedData: Array<Partial<TableColumn>>,
        defaultData: Array<Partial<TableColumn>>): Array<TableColumn> => (
            (!cachedData || !cachedData.length)
                ? defaultData.map((item: Partial<TableColumn>) => new TableColumn(item))
                : this.mergeData(
                    cachedData.map((item: Partial<TableColumn>) => new TableColumn(item)),
                    defaultData.map((item: Partial<TableColumn>) => new TableColumn(item))
                )
        );
}
