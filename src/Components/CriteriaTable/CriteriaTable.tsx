import * as React from "react";
import ReactTable from "react-table";
import * as PropTypes from "prop-types";
import axios, { CancelTokenSource } from "axios";

import { TableColumn } from "../TableColumn";
import { CriteriaTableProps, CriteriaTablePropTypes, CriteriaTableDefautProps } from "./CriteriaTableProps";
import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "../CriteriaTableController";

export type ConditionType = "=" | "<>" | ">" | "<" | "!=" | ">=" | "<=" | "like" | "in";
export type Condition = [ConditionType, string, string | number | boolean];

export interface CriteriaTableState {
    cancelToken?: CancelTokenSource;
    queries?: Array<Condition>;
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
    public static readonly defaultProps = CriteriaTableDefautProps;
    public static readonly propTypes = CriteriaTablePropTypes;

    public readonly context: CriteriaTableControllerContext;

    constructor(props) {
        super(props);

        this.state = this.cachedState;
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

        const response = await this.props.onFetchData(fetchState);

        window.localStorage.setItem(this.props.cacheKey, JSON.stringify({ data: response.data }));
        this.setState({
            data: response.data,
            cancelToken: undefined,
            pages: Math.ceil(response && response.data.count / state.pageSize)
        });
    }

    protected handleFilterChange = (column: Array<{ id: string, value: string }>): void => {
        Object.assign(this.state, {
            queries: column.length
                ? column.map(({ id, value }) => ["=", id, value]) as Array<Condition>
                : undefined
        });

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
            onFilteredChange: this.handleFilterChange,
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
