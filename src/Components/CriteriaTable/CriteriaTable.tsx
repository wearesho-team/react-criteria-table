import * as React from "react";
import ReactTable from "react-table";
import * as PropTypes from "prop-types";
import axios, { CancelTokenSource } from "axios";

import { TableColumn } from "../TableColumn";
import { Condition, CriteriaTableContext, CriteriaTableContextTypes } from "./CriteriaTableContext";
import { CriteriaTableProps, CriteriaTablePropTypes, CriteriaTableDefautProps } from "./CriteriaTableProps";
import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "../CriteriaTableController";

export interface CriteriaTableState {
    cancelToken?: CancelTokenSource;
    queries: Array<Condition>;
    data: {
        list: Array<any>;
        count: number;
        total: any;
    };
    resized?: Array<{ id: string, value: number }>;
    sorted?: Array<{ id: string, desc: boolean }>;
    pageSize?: number;
    pages?: number;
    page?: number;
}

export class CriteriaTable extends React.Component<CriteriaTableProps, CriteriaTableState> {
    public static readonly contextTypes = CriteriaTableControllerContextTypes;
    public static readonly childContextTypes = CriteriaTableContextTypes;
    public static readonly defaultProps = CriteriaTableDefautProps;
    public static readonly propTypes = CriteriaTablePropTypes;

    public static actionDelay = 200;

    public readonly context: CriteriaTableControllerContext;

    public state: CriteriaTableState = this.cachedState;
    public timer: any;

    public getChildContext(): CriteriaTableContext {
        return {
            setQueries: this.handleSetQueries,
            getQueries: this.handleGetQueries
        }
    }

    public componentWillMount() {
        this.context.initData(this.props.cacheKey, this.props.onDefaults(this.state)());
    }

    public componentWillUnmount() {
        this.state.cancelToken && this.state.cancelToken.cancel(`${this.props.cacheKey} will unmount`);
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
                {...this.props.labels}
            />
        );
    }

    protected fetchDataControl = (): void => {
        clearTimeout(this.timer);
        this.state.cancelToken && this.state.cancelToken.cancel();
        this.state.cancelToken = axios.CancelToken.source();

        this.timer = setTimeout(() => this.handleFetchData(), CriteriaTable.actionDelay);
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

        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.saveData(), CriteriaTable.actionDelay);
    };

    protected handlePageChange = (page: number): void => this.setState({ page });

    protected handleGetQueries = (): Array<Condition> => this.state.queries

    protected handleFetchData = async (): Promise<void> => {
        let response;
        try {
            response = await this.props.onFetchData({
                cancelToken: this.state.cancelToken,
                queries: this.state.queries,
                pageSize: this.state.pageSize,
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

    protected handleSetQueries = (conditionQueries: Array<Condition>): void => {
        // remove empty queries
        let newQueries = conditionQueries.filter((condition) => condition.length);

        // replace values in exist queries
        const [oldQueries] = newQueries
            .map((condition) => this.state.queries
                .filter((stateCondition) => stateCondition[1] !== condition[1])
            );

        // remove queries with emtpy values
        newQueries = newQueries.filter((condition) => condition[2].toString().length);

        this.state.queries = [
            ...newQueries,
            ...(oldQueries || [])
        ];

        this.forceUpdate();
    }

    protected saveData = (): void => window.localStorage.setItem(this.props.cacheKey, JSON.stringify(this.state));

    protected get cachedState(): CriteriaTableState {
        const cached = JSON.parse(window.localStorage.getItem(this.props.cacheKey));

        if (cached && ("data" in cached)) {
            return cached;
        }

        return {
            data: { list: [], total: {}, count: 0 },
            sorted: [{ desc: false, id: "id" }],
            pageSize: 10,
            queries: [],
            resized: [],
            pages: 1,
            page: 0
        };
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
