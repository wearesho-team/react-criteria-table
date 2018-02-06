// tslint:disable:max-classes-per-file
import * as React from "react";
import { SortableContainer, SortableElement, SortableContainerProps, SortableElementProps } from "react-sortable-hoc";

export class DraggableContainer extends React.Component<SortableContainerProps> {
    private Element = SortableContainer(({ children }) => children);

    public render(): JSX.Element {
        return <this.Element {...this.props} />;
    }
}

export class DraggableItem extends React.Component<SortableElementProps> {
    private Element = SortableElement(({ children }) => children);

    public render(): JSX.Element {
        return <this.Element {...this.props} />;
    }
}
