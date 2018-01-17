export const ColumnData = {
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
}
