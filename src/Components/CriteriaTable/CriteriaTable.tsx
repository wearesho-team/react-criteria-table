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
    pages?: number;
}

export interface FetchState {
    cancelToken: CancelTokenSource;
    queries: Array<Condition>;
    sorted: Array<any>;
    pageSize: number;
    page: number;
}

export class CriteriaTable extends React.Component<CriteriaTableProps, CriteriaTableState> {
    public static readonly contextTypes = CriteriaTableControllerContextTypes;
    public static readonly childContextTypes = CriteriaTableContextTypes;
    public static readonly defaultProps = CriteriaTableDefautProps;
    public static readonly propTypes = CriteriaTablePropTypes;

    public readonly context: CriteriaTableControllerContext;

    constructor(props) {
        super(props);

        this.state = {
            ...this.cachedState,
            queries: []
        }
    }

    public getChildContext(): CriteriaTableContext {
        return {
            setQueries: this.handleSetQueries
        }
    }

    public componentWillMount() {
        this.context.initData(this.props.cacheKey, this.props.onDefaults(this.state)());
    }

    public render(): JSX.Element {
        return (
            <ReactTable
                columns={this.context.getCurrentVisibleData(this.props.cacheKey) as any}
                {...this.commonProps}
            />
        );
    }

    protected handleFetchData = async (state: any): Promise<void> => {
        this.state.cancelToken && this.state.cancelToken.cancel();
        const cancelToken = axios.CancelToken.source();
        this.setState({ cancelToken });

        const fetchState: FetchState = {
            cancelToken,
            page: state.page,
            sorted: state.sorted,
            pageSize: state.pageSize,
            queries: this.state.queries
        };

        let response;

        try {
            response = await this.props.onFetchData(fetchState);
        } catch (error) {
            this.setState({
                cancelToken: undefined
            });
            return this.context.onError(error);
        }

        window.localStorage.setItem(this.props.cacheKey, JSON.stringify({ data: response.data }));
        this.setState({
            data: response.data,
            cancelToken: undefined,
            pages: Math.ceil(response && response.data.count / state.pageSize)
        });
    }

    protected handleSetQueries = (conditionQueries: Array<Condition>): void => {
        Object.assign(this.state, { queries: conditionQueries.filter((condition) => condition.length > 0) });
        this.forceUpdate();
    }

    protected get cachedState(): CriteriaTableState {
        const cached = JSON.parse(window.localStorage.getItem(this.props.cacheKey));

        if (cached && ("data" in cached)) {
            return cached;
        }

        return { data: { list: [], total: {}, count: 0 } } as CriteriaTableState;
    }

    protected get commonProps() {
        return {
            onFetchData: this.handleFetchData as any, // Request new data when things change
            loading: !!this.state.cancelToken, // Display the loading overlay when we need it
            className: "-striped -highlight",
            data: this.state.data.list,
            defaultPageSize: 10,
            multiSort: false,
            filterable: true,
            manual: true, // Forces table not to paginate or sort automatically, so we can handle it server-side,
            ...{ pages: this.state.pages },
            ...this.props.labels
        };
    }
}
