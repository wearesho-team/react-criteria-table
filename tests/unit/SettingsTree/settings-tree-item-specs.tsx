import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { ColumnData } from "../helpers/ColumnData";
import { TableColumn } from "../../../src/Components/TableColumn";
import { SettingsTreeItem } from "../../../src/Components/SettingsTree";
import { CriteriaTableControllerContextTypes } from "../../../src/Components/CriteriaTableController";

describe("<SettingsTreeItem/>", () => {
    let wrapper: ReactWrapper<any, any>;

    const commonHandler = () => undefined;
    let moved;
    const handleMove = () => moved = true;
    let saved;
    const handleSave = () => saved = true;

    const context = {
        initData: commonHandler,
        getCurrentVisibleData: commonHandler,
        getColumn: commonHandler,
        getCurrentData: commonHandler,
        onError: commonHandler,
        saveData: commonHandler,
    };

    const target = (e) => e;

    beforeEach(() => {
        wrapper = mount(
            <SettingsTreeItem
                columnData={new TableColumn(ColumnData)}
                onSaveData={handleSave}
                activeTableKey="key"
            />,
            { context, childContextTypes: CriteriaTableControllerContextTypes }
        );
    });

    afterEach(() => {
        moved = false;
        saved = false;
    });

    it("Should change `isOpen state on dropdown click", () => {
        const state = wrapper.state().isOpen;

        (wrapper.instance() as any).handleDropDownClick();

        expect(wrapper.state().isOpen).to.equal(!state);
    });

    it("Should change column state on switcher click", () => {
        (wrapper.instance() as any).handleSwitcherClick();
        expect(saved).to.be.true;
    });
});
