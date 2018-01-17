import {TableColumnRepository} from "./TableColumnRepository";

export class TableColumn {
    // ReactTableColumn attributes
    // https://react-table.js.org/#/story/readme
    public getHeaderProps?: (state: any, rowInfo: any, column: any, instance: any) => void;
    public getFooterProps?: (state: any, rowInfo: any, column: any, instance: any) => void;
    public filterMethod?: (filter: any, row: any, column: any) => boolean | void;
    public Aggregated?: JSX.Element | string | ((args?: any) => JSX.Element);
    public PivotValue?: JSX.Element | string | ((args?: any) => JSX.Element);
    public Expander?: JSX.Element | string | ((args?: any) => JSX.Element);
    public Header?: JSX.Element | string | ((args?: any) => JSX.Element);
    public Footer?: JSX.Element | string | ((args?: any) => JSX.Element);
    public Pivot?: JSX.Element | string | ((args?: any) => JSX.Element);
    public Cell?: JSX.Element | string | ((args?: any) => JSX.Element);
    public Filter?: JSX.Element | ((args?: any) => JSX.Element);
    public headerStyle?: CSSStyleDeclaration;
    public footerStyle?: CSSStyleDeclaration;
    public style?: CSSStyleDeclaration;
    public footerClassName?: string;
    public headerClassName?: string;
    public filterable?: boolean;
    public resizable?: boolean;
    public filterAll?: boolean;
    public sortable?: boolean;
    public expander?: boolean;
    public className?: string;
    public accessor?: string;
    public minWidth?: number;
    public maxWidth?: number;
    public pivot?: boolean;
    public width?: number;

    public id: string;
    public show: boolean;
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

            this.updateVisible();
        }
    }

    public get childColumnsArray(): Array<TableColumn> {
        return this.childColumnRepository
            ? this.childColumnRepository.arrayList
            : [];
    }

    // updating state according to visible child columns
    public updateStateFromChild = (newState: boolean): void => {
        this.updateVisible();

        if (this.show && (!this.columns || !this.columns.length)) {
            this.show = false;
            return;
        }

        if (!newState) {
            return;
        }

        if (this.show !== newState) {
            this.show = newState;
        }
    }

    // updating self, parent and children state
    public setState = (newState: boolean): TableColumn => {
        this.show = newState;

        if (this.setParentState instanceof Function) {
            this.setParentState(newState);
        }

        this.childColumnsArray.forEach((item) => item.setState(newState));

        return this;
    }

    public updateVisible = (): TableColumn => {
        const visible = this.visibleColumns || [];
        this.columns = visible.length ? visible : undefined;

        return this;
    }

    public getVisibleColumns = (): Array<TableColumn> => this.columns || [];

    public saveData = (): Partial<TableColumn> => {
        const self = {...this as any};

        self.columns = this.childColumnsArray.map((item) => item.saveData());
        !self.columns.length && delete self.columns;
        delete self.childColumnRepository;

        return self;
    }

    // merge new data with current data
    // if key in new data exist in current data - ignore it
    public subtractData = (data: Partial<TableColumn>): TableColumn => {
        const attributes = Object.keys(this);

        Object.keys(data)
            .filter((key) => !attributes.includes(key))
            .forEach((key) => this[key] = data[key]);

        if ((data as any).columns && (data as any).columns.length) {
            this.childColumnsArray.forEach((item: TableColumn) => {
                const subtractItem = (data as any).columns.find(({id}) => id === item.id);
                subtractItem && item.subtractData(subtractItem);
            });
        }

        return this;
    }

    public getChildColumnById = (childId: string): TableColumn => {
        return this.childColumnRepository
            ? this.childColumnRepository.findById(childId)
            : undefined;
    }

    private get visibleColumns(): Array<TableColumn> | undefined {
        return this.show
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
