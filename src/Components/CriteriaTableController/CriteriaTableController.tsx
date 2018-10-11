import * as React from "react";
import * as PropTypes from "prop-types";

import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "./CriteriaTableControllerContext";
import {
    CriteriaTableControllerDefaultProps,
    CriteriaTableControllerProps,
    CriteriaTableControllerPropTypes
} from "./CriteriaTableControllerProps";
import { TableColumnRepository, TableColumn } from "../TableColumn";
import { ControlActions } from "../..";

export interface CriteriaTableControllerState {
    tables: Map<string, TableColumnRepository>;
    controlActionBinds: Map<string, Map<string, () => void>>;
}

export class CriteriaTableController extends React.Component<
    CriteriaTableControllerProps, CriteriaTableControllerState
    > {
    public static readonly childContextTypes = CriteriaTableControllerContextTypes;
    public static readonly propTypes = CriteriaTableControllerPropTypes;
    public static readonly defaultProps = CriteriaTableControllerDefaultProps;

    private readonly cacheSuffix = "-settings";

    constructor(props) {
        super(props);

        this.state = {
            tables: new Map(),
            controlActionBinds: new Map()
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

            getControlAction: this.getControlAction,
            bindControlAction: this.handleBindControlAction,
            unbindControlAction: this.handleUnbindControlAction
        };
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected handleBindControlAction = (tableId: string, actionName: ControlActions, action: () => void): void => {
        if (!this.state.controlActionBinds.has(tableId)) {
            this.state.controlActionBinds.set(tableId, new Map());
        }

        this.state.controlActionBinds.get(tableId).set(actionName, action);
        this.forceUpdate();
    }

    protected handleUnbindControlAction = (tableId: string, actionName: ControlActions): void => {
        if (!this.state.controlActionBinds.has(tableId)) {
            return;
        }

        this.state.controlActionBinds.get(tableId).delete(actionName);
        if (!this.state.controlActionBinds.get(tableId).size) {
            this.state.controlActionBinds.delete(tableId);
        }
        this.forceUpdate();
    }

    protected getControlAction = (tableId: string, actionName: ControlActions) => {
        if (!this.state.controlActionBinds.has(tableId)) {
            return;
        }

        return this.state.controlActionBinds.get(tableId).get(actionName);
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
        if (!this.props.enableCaching) {
            return;
        }

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
