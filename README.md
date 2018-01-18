# React Criteria Table

React Criteria Table is a wrapper for React Table (https://react-table.js.org), which is designed to extend base functional.

React Criteria Table is use context (https://reactjs.org/docs/context.html).

# Usage
```HTML
<CriteriaTableController>
   <CriteriaTable 
        cacheKey="tableOne" 
        onFetchData={(state: FetchState) => /*do requests here*/
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

`FetchState`: 
- cancelToken: `CancelTokenSource` (https://github.com/axios/axios#cancellation)
- queries: `Array<Condition>`
- sorted: `Array<any>`
- pageSize: `number`
- page: `number`

`CriteriaTableState`:
- cancelToken?: `CancelTokenSource`
- queries?: `Array<Condition>`
- data: {
    - list: `Array<any>`
    - count: `number`
    - total: `any`
    }
- pages?: `number`
