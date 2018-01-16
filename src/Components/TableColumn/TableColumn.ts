import { Column as ReactTableColumn } from "react-table";
import { TableColumnRepository } from "./TableColumnRepository";

export type IdentifiableTableColumn = Partial<TableColumn & ReactTableColumn>;

export class TableColumn {
    public id: string;
    public state: boolean;
    public Header: (() => JSX.Element) | string;
    public setParentState: (newState: boolean) => void; // callback for `updateStateFromChild`

    private childColumnRepository?: TableColumnRepository; // all columns
    private columns?: Array<TableColumn>; // array for table - only visible columns

    constructor(props: Partial<TableColumn>) {
        Object.assign(this, props);

        const identifiableProps = props as TableColumn;
        if (identifiableProps.columns instanceof Array && identifiableProps.columns.length) {
            this.childColumnRepository = new TableColumnRepository();

            identifiableProps.columns.forEach((itemProps) => {
                this.childColumnRepository.add(new TableColumn({
                    ...itemProps,
                    setParentState: this.updateStateFromChild
                }));
            });

            this.updateVisibles();
        }
    }

    public get childColumnsArray(): Array<TableColumn> {
        return this.childColumnRepository
            ? this.childColumnRepository.arrayList
            : [];
    }

    public get childColumnsRepository(): TableColumnRepository {
        return this.childColumnRepository;
    }

    // updating state according to visible child columns
    public updateStateFromChild = (newState: boolean): void => {
        this.updateVisibles();

        if (this.state && (!this.columns || !this.columns.length)) {
            this.state = false;
            return;
        }

        if (!newState) {
            return;
        }

        if (this.state !== newState) {
            this.state = newState;
        }
    }

    // updating self, parent and childs state
    public setState = (newState: boolean): TableColumn => {
        this.state = newState;

        if (this.setParentState instanceof Function) {
            this.setParentState(newState);
        }

        this.childColumnsArray.forEach((item) => item.setState(newState));

        return this;
    }

    public updateVisibles = (): TableColumn => {
        const visibles = this.visibleColumns || [];
        this.columns = visibles.length ? visibles : undefined;

        return this;
    }

    public saveData = (): TableColumn => {
        const self = { ...this as any };

        self.columns = this.childColumnsArray;
        self.columns.forEach((item) => item.saveData());

        delete self.childColumnRepository;

        return self;
    }

    // merge new data with current data
    // if key in new data exist in current data - ignore it
    public substractData = (data: IdentifiableColumn): TableColumn => {
        const attributes = Object.keys(this);

        Object.keys(data)
            .filter((key) => !attributes.includes(key))
            .forEach((key) => this[key] = data[key]);

        if (data.childColumnsArray && data.childColumnsArray.length) {
            this.childColumnsArray.forEach((item: TableColumn) => {
                const substractItem = data.childColumnsArray.find(({ id }) => id === item.id);
                substractItem && item.substractData(substractItem);
            });
        }

        return this;
    }

    public getChildColumnById = (childId: string): TableColumn => {
        return this.childColumnsRepository
            ? this.childColumnsRepository.findById(childId)
            : undefined;
    }

    private get visibleColumns(): Array<TableColumn> | undefined {
        return this.state
            ? this.childColumnsArray.map((item: TableColumn) => {
                const visibleColumns = item.visibleColumns;
                if (visibleColumns) {
                    item.columns = visibleColumns;
                    return item;
                }
            }).filter((item) => item !== undefined)
            : undefined;
    }
}
