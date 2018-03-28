import * as React from "react";
import * as PropTypes from "prop-types";

import {
    SearchToolRequiredDefaultProps,
    SearchToolRequiredPropTypes,
    SearchToolRequiredProps
} from "./SearchToolRequiredProps";
import { Condition, CriteriaTableContextTypes, CriteriaTableContext } from "../CriteriaTable";

export interface BaseRangeState {
    from?: number | string;
    to?: number | string;
    label: string;
}

export class BaseRange
    <
    ChildProps extends SearchToolRequiredProps = SearchToolRequiredProps,
    ChildState extends BaseRangeState  = BaseRangeState
    > extends React.Component<ChildProps, ChildState> {

    public static readonly propTypes = SearchToolRequiredPropTypes;
    public static readonly contextTypes = CriteriaTableContextTypes;
    public static readonly defaultProps = SearchToolRequiredDefaultProps;

    public readonly context: CriteriaTableContext;
    public state: ChildState = {} as ChildState;

    public componentWillMount() {
        const matchQuery = this.context.getQueries().filter((condition) => condition[1] === this.props.columnId);
        const from = matchQuery.find((condition) => condition[0] === ">=");
        const to = matchQuery.find((condition) => condition[0] === "<=");

        from && (this.state.from = from[2] as string);
        to && (this.state.to = to[2] as string);

        this.state.label = this.label;
    }

    public componentDidUpdate() {
        if (this.shouldReset) {
            this.handleClear();
            this.props.onFetch();
        }
    }

    protected handleChange = (field: any) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        Object.assign(this.state, { [field]: event.currentTarget.value })
        this.forceUpdate();

        this.setState({ label: this.label });
    }

    protected handleClear = () => {
        this.state.label = this.props.defaultLabel;
        this.state.from = undefined;
        this.state.to = undefined;
        this.forceUpdate();
    }

    protected handleCreateQueries = (): Array<Condition> => ([
        [">=", this.props.columnId, this.state.from || ""],
        ["<=", this.props.columnId, this.state.to || ""]
    ]);

    protected get label(): string {
        let label = "";
        if (this.state.from !== undefined && this.state.from.toString().length) {
            label += `от ${this.state.from}`;
        }

        if (this.state.to !== undefined && this.state.to.toString().length) {
            label += ` до ${this.state.to}`;
        }

        if (!label.length) {
            label = this.props.defaultLabel;
        }

        return label.trim();
    }

    private get shouldReset(): boolean {
        return (
            !this.context.queriesList.length
            && (this.state.label !== this.props.defaultLabel)
            && !this.state.from
            && !this.state.to
        );
    }
}
