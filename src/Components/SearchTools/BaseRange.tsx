import * as React from "react";
import * as PropTypes from "prop-types";

import {
    SearchToolRequiredDefaultProps,
    SearchToolRequiredPropTypes,
    SearchToolRequiredProps
} from "./SearchToolRequiredProps";
import { Condition, CriteriaTableContextTypes, CriteriaTableContext } from "../CriteriaTable";

export interface BaseRangeState {
    label: string;
    from?: number | string;
    to?: number | string;
}

export class BaseRange
    <
    ChildProps extends SearchToolRequiredProps = SearchToolRequiredProps,
    ChildState extends BaseRangeState  = BaseRangeState
    > extends React.Component<ChildProps, ChildState> {

    public static readonly propTypes = SearchToolRequiredPropTypes;
    public static readonly defaultProps = SearchToolRequiredDefaultProps;

    constructor(props) {
        super(props);

        this.state = {
            label: this.props.defaultLabel
        } as ChildState;
    }

    protected handleChange = (field: any) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        Object.assign(this.state, { [field]: event.currentTarget.value })
        this.forceUpdate();

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

        this.setState({ label });
    }

    protected handleClear = () => {
        this.setState({
            label: this.props.defaultLabel,
            from: undefined,
            to: undefined
        });
    }

    protected handleCreateQueries = (): Array<Condition> => ([
        this.state.from !== undefined && this.state.from.toString().length
            ? [">=", this.props.columnId, this.state.from]
            : [] as Condition,
        this.state.to !== undefined && this.state.to.toString().length
            ? ["<=", this.props.columnId, this.state.to]
            : [] as Condition
    ]);
}
