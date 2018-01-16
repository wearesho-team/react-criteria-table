import * as React from "react";

import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "./CriteriaTableControllerContext";
import { TableColumnRepository, IdentifiableTableColumn, TableColumn } from "../TableColumn";
import { CriteriaTableControllerProps } from "./CriteriaTableControllerProps";

export interface CriteriaTableControllerState {
    tables: Map<string, TableColumnRepository>;
}

export class CriteriaTableController extends React.Component<
    CriteriaTableControllerProps, CriteriaTableControllerState
    > {
    public static readonly contextTypes = CriteriaTableControllerContextTypes;

    constructor(props) {
        super(props);

        this.state = {
            tables: new Map()
        };
    }

    private readonly cacheSuffix = "-settings";

    public getChildContext(): CriteriaTableControllerContext {
        return {
            saveData: this.saveData,
            getColumn: this.getColumn,
            initData: this.getDefaultData,
            getCurrentData: this.getCurrentData,
            getCurrentVisibleData: this.getCurrentVisibleData
        };
    }

    public render(): JSX.Element {
        return this.props.children;
    }

    protected getDefaultData = (id: string, defaultData: Array<IdentifiableTableColumn>): TableColumnRepository => {
        let cachedData: Array<IdentifiableTableColumn>;
        const instanceData = new TableColumnRepository();

        try {
            cachedData = JSON.parse(localStorage.getItem(this.getCacheKey(id)));
        } catch (error) {
            if (this.props.onError instanceof Function) {
                this.props.onError(error);
            }
        }

        try {
            this.instantiateData(cachedData, defaultData).forEach((item: TableColumn) => instanceData.add(item));
        } catch (error) {
            if (this.props.onError instanceof Function) {
                this.props.onError(error);
            }
        }

        this.state.tables.set(id, instanceData);
        this.forceUpdate();

        return instanceData;
    }

    protected getCurrentData = (id: string): TableColumnRepository => {
        return this.state.tables.get(id);
    }

    protected getCurrentVisibleData = (id: string): Array<TableColumn> => {
        return this.getCurrentData(id).arrayList.filter((item: TableColumn) => item.updateVisibles().state);
    }

    protected getColumn = (id: string, nodeId: string): TableColumn => {
        return this.getCurrentData(id).arrayList.find((item: TableColumn) => id === nodeId);
    }

    protected saveData = (id: string): void => {
        localStorage.setItem(
            this.getCacheKey(id),
            JSON.stringify(this.getCurrentData(id).arrayList.map((item: TableColumn) => item.saveData()))
        );

        this.forceUpdate();
    }

    private getCacheKey(id: string): string {
        return `${id}${this.cacheSuffix}`;
    }

    private mergeData = (
        cachedData: Array<IdentifiableTableColumn>,
        defaultData: Array<IdentifiableTableColumn>): Array<TableColumn> => (
            cachedData.map((item: TableColumn) => {
                const substractedData = defaultData.find(({ id }) => id === item.id);
                return substractedData && item.substractData(substractedData);
            })
        );

    private instantiateData = (
        cachedData: Array<IdentifiableTableColumn>,
        defaultData: Array<IdentifiableTableColumn>): Array<TableColumn> => (
            (!cachedData || !cachedData.length)
                ? defaultData.map((item: IdentifiableTableColumn) => new TableColumn(item))
                : this.mergeData(
                    cachedData.map((item: IdentifiableTableColumn) => new TableColumn(item)),
                    defaultData.map((item: IdentifiableTableColumn) => new TableColumn(item))
                )
        );
}
