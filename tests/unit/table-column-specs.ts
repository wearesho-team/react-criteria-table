import {expect} from "chai";

import {TableColumn} from "../../src/Components/TableColumn"
import {ColumnData} from "./helpers/ColumnData";

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

    beforeEach(() => {
        instance = new TableColumn(ColumnData);
    });

    afterEach(() => {
        instance = undefined;
    });

    it("Should initialize data on create", () => {
        expect(instance.id).to.equal(ColumnData.id);
        expect(instance.show).to.equal(ColumnData.show);
        expect(instance.Header).to.equal(ColumnData.Header);

        // child column
        expect(instance.getChildColumnById("id_2")).to.be.instanceof(TableColumn);
        expect(instance.getChildColumnById("id_2").show).to.equal(ColumnData.columns[0].show);
        expect(instance.getChildColumnById("id_2").Header).to.equal(ColumnData.columns[0].Header);
    });

    it("Should determine visible columns according to state on create", () => {
        expect(instance.getVisibleColumns().length).to.equal(1);
        expect(instance.getVisibleColumns()[0].id).to.equal("id_2_1");
    });

    it("Should return stringified TableColumn data", () => {
        expect(instance.saveData()).to.be.equal(JSON.stringify(ColumnData));
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
