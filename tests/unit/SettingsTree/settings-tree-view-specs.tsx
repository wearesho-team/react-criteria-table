import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { SettingsTreeView } from "../../../src/Components/SettingsTree/SettingsTreeView";
import { TableColumnRepository, TableColumn } from "../../../src/Components/TableColumn";
import { ColumnData } from "../helpers/ColumnData";

describe("<SettingsTreeView/>", () => {
    let wrapper: ReactWrapper<any>;

    const commonHandler = () => undefined;
    const repo = new TableColumnRepository().add(new TableColumn(ColumnData));

    let saved;
    const handleSave = () => {
        saved = true;
    };
    let error;
    const handleError = () => {
        error = true;
    }

    const context = {
        initData: commonHandler,
        getCurrentVisibleData: commonHandler,
        getColumn: commonHandler,
        getCurrentData: commonHandler,
        onError: handleError,
        saveData: handleSave,
    };

    beforeEach(() => {
        wrapper = mount(<SettingsTreeView childList={repo} activeTableKey="key" />, { context })
    });

    afterEach(() => {
        saved = false;
        error = true;
        wrapper.unmount();
    });

    it("Should call `context.saveData` on save data", () => {
        (wrapper.instance() as any).handleSaveData();

        expect(saved).to.be.true;
    });

    it("Should call `context.saveData` on move", () => {
        (wrapper.instance() as any).handleMove(() => undefined)()

        expect(saved).to.be.true;
    });

    it("Should call `context.onError` if error has been throwed on move", () => {
        (wrapper.instance() as any).handleMove(() => { throw Error() })();

        expect(error).to.be.true;
    });
});
