import * as React from "react";
import * as PropTypes from "prop-types";

import { SettingsTreeItemProps, SettingsTreeItemPropTypes } from "./SettingsTreeItemProps";
import { DragSourceItem, DropTargetItem } from "../DnDSetup";
import { SettingsTreeView } from "../SettingsTreeView";

export interface SettingsTreeItemState {
    isOpen: boolean;
}

@DragSourceItem()
@DropTargetItem()
export class SettingsTreeItem extends React.Component<SettingsTreeItemProps, SettingsTreeItemState> {
    public static readonly propTypes = SettingsTreeItemPropTypes;

    public constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
    }

    public render(): JSX.Element {
        const connectDragSource = this.props.connectDragSource || ((e) => e);
        const connectDropTarget = this.props.connectDropTarget || ((e) => e);

        return connectDropTarget(connectDragSource(
            <div data-id={this.props.groupId}>
                <div className="jqtree-element jqtree_common">
                    {this.isEmpty ? this.emptyNode : this.notEmptyNode}
                    <div className="toggle-switch pull-right">
                        <input
                            type="checkbox"
                            className="toggle-switch__checkbox"
                            checked={!this.props.columnData.show}
                            onClick={this.handleSwitcherClick}
                            readOnly={true}
                        />
                        <i className="toggle-switch__helper" />
                    </div>
                </div>
                {this.childTree}
            </div>
        ));
    }

    protected get isEmpty(): boolean {
        return !this.props.columnData.childColumnsArray.length;
    }

    protected get header(): string | JSX.Element {
        return this.props.columnData.Header instanceof Function
            ? this.props.columnData.Header()
            : this.props.columnData.Header;
    }

    protected get notEmptyNode(): JSX.Element {
        const className = `jqtree-toggler jqtree_common fa fa-${this.state.isOpen ? "minus-circle" : "plus-circle"}`;

        return (
            <React.Fragment>
                <i className={className} onClick={this.handleDropDownClick} />
                <span className="jqtree-title jqtree_common jqtree-title-folder">
                    {this.header}
                </span>
            </React.Fragment>
        );
    }

    protected get emptyNode(): JSX.Element {
        return (
            <span className="jqtree-title jqtree_common single">
                {this.header}
            </span>
        );
    }

    protected get childTree(): JSX.Element {
        if (this.isEmpty || !this.state.isOpen) {
            return null;
        }

        return (
            <SettingsTreeView
                childList={this.props.columnData.childColumnRepository}
                activeTableKey={this.props.activeTableKey}
                className="jqtree_common"
            />
        );
    }

    protected handleSwitcherClick = (): void => {
        this.props.columnData.setState(!this.props.columnData.show);
        this.props.onSaveData();
    }

    protected handleDropDownClick = (): void => {
        this.setState(({ isOpen }) => ({
            isOpen: !isOpen
        }));
    }
}
