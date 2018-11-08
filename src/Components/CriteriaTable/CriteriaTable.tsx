import * as React from "react";
import deepEqual from "deep-equal";
import ReactTable from "react-table";
import axios, { CancelTokenSource } from "axios";

import { TableColumn } from "../TableColumn";
import { Condition, CriteriaTableContext, CriteriaTableContextTypes } from "./CriteriaTableContext";
import { CriteriaTableProps, CriteriaTablePropTypes, CriteriaTableDefautProps } from "./CriteriaTableProps";
import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "../CriteriaTableController";

export interface CriteriaTableState {
    resized?: Array<{ id: string, value: number }>;
    sorted?: Array<{ id: string, desc: boolean }>;
    cancelToken?: CancelTokenSource;
    queries: Array<Condition>;
    pageSize?: number;
    pages?: number;
    page?: number;
    data: any;

    autoFetch?: boolean;
    autoFetchDelay?: number;
}

export enum ControlActions {
    getAutoFetchParams = "getAutoFetchParams",
    setAutoFetchState = "setAutoFetchState",
    setAutoFetchDelay = "setAutoFetchDelay",
    resetQueries = "resetQueries",
    resetData = "resetData",
};

export class CriteriaTable extends React.Component<CriteriaTableProps, CriteriaTableState> {
    public static readonly contextTypes = CriteriaTableControllerContextTypes;
    public static readonly childContextTypes = CriteriaTableContextTypes;
    public static readonly defaultProps = CriteriaTableDefautProps;
    public static readonly propTypes = CriteriaTablePropTypes;

    public static actionDelay = 200;
    public readonly context: CriteriaTableControllerContext;
    public state: CriteriaTableState = this.cachedState;

    public fetchControlTimeoutId: any;
    public autoFetchTimeoutId: any;

    public get bindMap() {
        return [
            {
                actionName: ControlActions.resetData,
                action: this.handleResetData
            },
            {
                actionName: ControlActions.resetQueries,
                action: this.handleResetQueries
            },
            {
                actionName: ControlActions.setAutoFetchDelay,
                action: this.setAutoFetchDelay
            },
            {
                actionName: ControlActions.setAutoFetchState,
                action: this.setAutoFetchState
            },
            {
                actionName: ControlActions.getAutoFetchParams,
                action: this.getAutoFetchParams
            }
        ];
    }

    public getChildContext(): CriteriaTableContext {
        return {
            setQueries: this.handleSetQueries,
            getQueries: this.handleGetQueries,
            queriesList: this.state.queries
        }
    }

    public componentDidUpdate(prevProps, prevState: CriteriaTableState) {
        // `deepEqual &&` is needed for test environment.
        if (deepEqual && !deepEqual(this.state.data, prevState.data)) {
            this.context.initData(this.props.cacheKey, this.props.onDefaults(this.state)());
        }

        if (this.state.autoFetch && !prevState.autoFetch
            || (this.state.autoFetch && (prevState.autoFetchDelay !== this.state.autoFetchDelay))
        ) {
            this.startAutoFetch();
        } else if (!this.state.autoFetch && prevState.autoFetch) {
            clearTimeout(this.autoFetchTimeoutId);
        }
    }

    public componentWillMount() {
        this.context.initData(this.props.cacheKey, this.props.onDefaults(this.state)());

        this.bindMap.forEach(({ actionName, action }) =>
            this.context.bindControlAction(this.props.cacheKey, actionName, action));

        this.state.autoFetch && this.startAutoFetch();
    }

    public componentWillUnmount() {
        this.state.cancelToken && this.state.cancelToken.cancel(`${this.props.cacheKey} will unmount`);

        this.bindMap.forEach(({ actionName }) =>
            this.context.unbindControlAction(this.props.cacheKey, actionName));

        clearTimeout(this.fetchControlTimeoutId);
        clearTimeout(this.autoFetchTimeoutId);
    }

    public render(): JSX.Element {
        return (
            <ReactTable
                columns={this.context.getCurrentVisibleData(this.props.cacheKey)}
                loading={!!this.state.cancelToken}
                className="-striped -highlight"
                multiSort={false}
                filterable
                manual
                {...this.controlledStateCallbacks}
                {...this.controlledStateOverrides}
                {...this.labels}
            />
        );
    }

    protected startAutoFetch = (): void => {
        // This method gives more control than `setInterval`
        clearTimeout(this.autoFetchTimeoutId);
        this.autoFetchTimeoutId = setTimeout(() => {
            this.fetchDataControl();
            this.startAutoFetch();
        }, this.state.autoFetchDelay);
    }

    protected fetchDataControl = (): void => {
        clearTimeout(this.fetchControlTimeoutId);
        this.state.cancelToken && this.state.cancelToken.cancel();
        this.state.cancelToken = axios.CancelToken.source();
        this.forceUpdate();

        this.fetchControlTimeoutId = setTimeout(this.handleFetchData, CriteriaTable.actionDelay);
    }

    protected setAutoFetchDelay = (autoFetchDelay: number): void => {
        this.setState({ autoFetchDelay });
    }

    protected setAutoFetchState = (autoFetch: boolean): void => {
        this.setState({ autoFetch });
    }

    protected getAutoFetchParams = (): { delay: number, enabled: boolean } => {
        return {
            delay: this.state.autoFetchDelay,
            enabled: this.state.autoFetch
        };
    }

    protected handlePageSizeChange = (pageSize: number): void => {
        /*
         * Before change page size we needs to go to first page
         * for preventing infinite loop
         */
        this.state.page && this.handlePageChange(0);
        this.setState({ pageSize });
    };

    protected handleSortedChange = (sorted: Array<{ id: string, desc: boolean }>): void => this.setState({ sorted });

    protected handleResized = (resized: Array<{ id: string, value: number }>): void => {
        this.setState({ resized });

        clearTimeout(this.fetchControlTimeoutId);
        this.fetchControlTimeoutId = setTimeout(this.saveData, CriteriaTable.actionDelay);
    };

    protected handlePageChange = (page: number): void => this.setState({ page });

    protected handleGetQueries = (): Array<Condition> => this.state.queries

    protected handleFetchData = async (): Promise<void> => {
        let response;
        try {
            response = await this.props.onFetchData({
                cancelToken: this.state.cancelToken,
                pageSize: this.state.pageSize,
                queries: this.state.queries,
                sorted: this.state.sorted,
                page: this.state.page
            });
        } catch (error) {
            this.setState({
                cancelToken: undefined
            });

            return this.context.onError(error);
        }

        this.setState(({ pageSize }) => ({
            pages: Math.ceil(response && response.data.count / pageSize),
            cancelToken: undefined,
            data: response.data
        }));

        this.saveData();
    }

    protected handleResetData = (): void => {
        // need to remove autoFetch timer when user trigger fetch manually
        clearTimeout(this.autoFetchTimeoutId);
        this.fetchDataControl();

        this.state.autoFetch && this.startAutoFetch();
    }

    protected handleResetQueries = (): void => {
        this.state.queries = [];
        this.forceUpdate();
    }

    protected handleSetQueries = (conditionQueries: Array<Condition>): void => {
        // remove empty queries
        let newQueries = conditionQueries.filter((condition) => condition.length);

        // replace values in exist queries
        const oldQueries = this.state.queries
            .filter((condition) => !newQueries.some((stateCondition) => stateCondition[1] === condition[1]));

        // remove queries with empty values
        newQueries = newQueries.filter((condition) => condition[2].toString().length);

        this.state.queries = [
            ...newQueries,
            ...(oldQueries || [])
        ];

        this.forceUpdate();
    }

    protected saveData = (): void => {
        const data = JSON.parse(JSON.stringify(this.state));

        delete data.cancelToken;

        if (!this.context.enableCaching && data.data) {
            delete data.data.list;
        }

        window.localStorage.setItem(this.props.cacheKey, JSON.stringify(data));
    }

    protected get cachedState(): CriteriaTableState {
        const cached = JSON.parse(window.localStorage.getItem(this.props.cacheKey));

        if (cached && ("data" in cached)) {
            return cached;
        }

        // Store object as non requireable prop in props is bad idea
        const defaultFields = {} as CriteriaTableState;
        [
            "autoFetchDelay",
            "autoFetch",
            "pageSize",
            "sorted",
            "pages",
            "page",
            "data"
        ].forEach((key) => defaultFields[key] = this.props[key]);

        return {
            ...defaultFields,
            queries: [],
            resized: []
        };
    }

    protected get labels() {
        // Store object as non requireable prop in props is bad idea
        const defaultFields = {};
        [
            "previousText",
            "loadingText",
            "noDataText",
            "pageText",
            "nextText",
            "rowsText",
            "ofText"
        ].forEach((key) => defaultFields[key] = this.props[key]);

        return defaultFields;
    }

    protected get controlledStateCallbacks() {
        return {
            onPageSizeChange: this.handlePageSizeChange,
            onSortedChange: this.handleSortedChange,
            onPageChange: this.handlePageChange,
            onResizedChange: this.handleResized,
            onFetchData: this.fetchDataControl
        }
    }

    protected get controlledStateOverrides() {
        return {
            pageSize: this.state.pageSize,
            resized: this.state.resized,
            data: this.state.data.list,
            sorted: this.state.sorted,
            pages: this.state.pages,
            page: this.state.page
        }
    }
}
// tslint:disable-next-line
