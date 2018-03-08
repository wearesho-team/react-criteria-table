import * as React from "react";
import * as PropTypes from "prop-types";

import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "./CriteriaTableControllerContext";
import { CriteriaTableControllerProps } from "./CriteriaTableControllerProps";
import { TableColumnRepository, TableColumn } from "../TableColumn";

export interface CriteriaTableControllerState {
    tables: Map<string, TableColumnRepository>;
    bindsResetData: Set<() => void>;
    bindsResetQueries: Set<() => void>;
}

export class CriteriaTableController extends React.Component<
    CriteriaTableControllerProps, CriteriaTableControllerState
    > {
    public static readonly childContextTypes = CriteriaTableControllerContextTypes;

    private readonly cacheSuffix = "-settings";

    constructor(props) {
        super(props);

        this.state = {
            tables: new Map(),
            bindsResetData: new Set(),
            bindsResetQueries: new Set()
        };
    }

    public getChildContext(): CriteriaTableControllerContext {
        return {
            saveData: this.saveData,
            onError: this.handleError,
            getColumn: this.getColumn,
            initData: this.getDefaultData,
            getCurrentData: this.getCurrentData,
            getCurrentVisibleData: this.getCurrentVisibleData,

            bindResetData: this.handleBindResetData,
            bindResetQueries: this.handleBindResetQueries,

            unbindResetData: this.handleUnbindResetData,
            unbindResetQueries: this.handleUnbindResetQueries,

            resetData: this.handleResetData,
            resetQueries: this.handleResetQueries
        };
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected handleResetData = (): void => {
        this.state.bindsResetData.forEach((action) => action());
    }
    protected handleResetQueries = (): void => {
        this.state.bindsResetQueries.forEach((action) => action());
    }

    protected handleUnbindResetData = (action: () => void): void => {
        this.state.bindsResetData.delete(action);
    }

    protected handleUnbindResetQueries = (action: () => void): void => {
        this.state.bindsResetQueries.delete(action);
    }

    protected handleBindResetData = (action: () => void): void => {
        this.state.bindsResetData.add(action);
    }

    protected handleBindResetQueries = (action: () => void): void => {
        this.state.bindsResetQueries.add(action);
    }

    protected getDefaultData = (id: string, defaultData: Array<TableColumn>): TableColumnRepository => {
        let cachedData: Array<TableColumn>;
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

    protected handleError = (error: any): void => {
        if (this.props.onError instanceof Function) {
            this.props.onError(error);
        } else {
            throw error;
        }
    }

    private getCacheKey(id: string): string {
        return `${id}${this.cacheSuffix}`;
    }

    private mergeData = (
        cachedData: Array<TableColumn>,
        defaultData: Array<TableColumn>): Array<TableColumn> => (
            cachedData.map((item: TableColumn) => {
                const subtractedData = defaultData.find(({ id }) => id === item.id);
                return subtractedData && item.subtractData(subtractedData);
            })
        );

    private instantiateData = (
        cachedData: Array<TableColumn>,
        defaultData: Array<TableColumn>): Array<TableColumn> => (
            (!cachedData || !cachedData.length)
                ? defaultData.map((item: Partial<TableColumn>) => new TableColumn(item))
                : this.mergeData(
                    cachedData.map((item: Partial<TableColumn>) => new TableColumn(item)),
                    defaultData.map((item: Partial<TableColumn>) => new TableColumn(item))
                )
        );
}
