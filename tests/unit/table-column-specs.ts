import {expect} from "chai";

import {TableColumn} from "../../src/Components/TableColumn"

describe("TableColumn", () => {
    let instance: TableColumn;

    const testState = (column: TableColumn, state: boolean) => {
        if (!column.childColumnsArray.length) {
            return;
        }

        column.childColumnsArray.forEach((child) => {
            expect(child.show === state).to.be.true;
            testState(child, state);
        })
    }

    const data = {
        id: "id_1",
        show: true,
        Header: "Header",
        columns: [
            {
                id: "id_2",
                show: false,
                Header: "Child header",
                columns: [
                    {
                        id: "id_3",
                        show: true,
                        Header: "Super child header"
                    }
                ]
            },
            {
                id: "id_2_1",
                show: true,
                Header: "Child header 2",
                columns: [
                    {
                        id: "id_3_1",
                        show: false,
                        Header: "Super child header 2"
                    }
                ]
            }
        ]
    };

    beforeEach(() => {
        instance = new TableColumn(data);
    });

    afterEach(() => {
        instance = undefined;
    });

    it("Should initialize data on create", () => {
        expect(instance.id).to.equal(data.id);
        expect(instance.show).to.equal(data.show);
        expect(instance.Header).to.equal(data.Header);

        // child column
        expect(instance.getChildColumnById("id_2")).to.be.instanceof(TableColumn);
        expect(instance.getChildColumnById("id_2").show).to.equal(data.columns[0].show);
        expect(instance.getChildColumnById("id_2").Header).to.equal(data.columns[0].Header);
    });

    it("Should determine visible columns according to state on create", () => {
        expect(instance.getVisibleColumns().length).to.equal(1);
        expect(instance.getVisibleColumns()[0].id).to.equal("id_2_1");
    });

    it("Should return stringified TableColumn data", () => {
        expect(instance.saveData()).to.be.equal(JSON.stringify(data));
    });

    it("Should should merge new data to current data (subtract)", () => {
        const dataToMerge = {
            accessor: "CustomDataOuter",
            id: "id_1",
            columns: [
                {
                    id: "id_2_1",
                    accessor: "CustomDataInner"
                }
            ]
        };
        instance.subtractData(dataToMerge);

        expect(instance.accessor).to.equal("CustomDataOuter");
        expect(instance.getChildColumnById("id_2_1").accessor).to.equal("CustomDataInner");
    });

    it("Should set `show` false to itself and children", () => {
        instance.setState(false);
        expect(instance.show).to.be.false;

        testState(instance, false);
    });

    it("Should set `show` false to parent when all children `show` false", () => {
        instance.getChildColumnById("id_2").getChildColumnById("id_3").setState(false);
        instance.getChildColumnById("id_2_1").setState(false);

        expect(instance.show).to.be.false;
    });

    it("Should set `show` true to parent when all children `show` true", () => {
        instance.setState(false);
        testState(instance, false);

        expect(instance.show).to.be.false;

        instance.getChildColumnById("id_2").setState(true);
        instance.getChildColumnById("id_2_1").setState(true);

        expect(instance.show).to.be.true;
    })
})
