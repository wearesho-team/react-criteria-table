# React Criteria Table

React Criteria Table is a wrapper for React Table (https://react-table.js.org), which is designed to extend base functional.

React Criteria Table is use context (https://reactjs.org/docs/context.html).

# Usage
```HTML
<CriteriaTableController>
   <CriteriaTable 
        cacheKey="tableOne" 
        onFetchData={(state: Partial<CriteriaTableState>) => /*do requests here*/
        onDefaults={(state: CriteriaTableState) => () => ([
            {id: "name", show: true },
            {id: "surName", show: true },
            {id: "birthDate", show: false }
        ])}
    />
   <CriteriaTableSettings activeTableKey="tableOne"/>
</CriteriaTableController>
```
  - `cacheKey` is identifier of table. Is also used to save data to local storage
  - `activeTableKey` is define, which of table settings must be displayed
  - `onFetchData` is callback, of React Table `onFetchData` (https://react-table.js.org/#/story/readme)
  - `onDefaults` is callback, that called on `ComponentWillMount` and initialize saved data and default data

##### Interfaces
`ConditionType` : `"=" | "<>" | ">" | "<" | "!=" | ">=" | "<=" | "like" | "in"`

`Condition`: [`ConditionType`, `string`, `string` | `number` | `boolean`]

`CriteriaTableState`:
- cancelToken?: `CancelTokenSource`(https://github.com/axios/axios#cancellation)
- queries?: `Array<Condition>`
- data: {
    - list: `Array<any>`
    - count: `number`
    - total: `any`
    }
- sorted?: Array<{ id: `string`, desc: `boolean` }>
- pageSize?: `number`
- pages?: `number`
- page?: `number`
