

import React from "react";
import MaterialTable from "material-table";
import Button from '@material-ui/core/Button'
import JSONEditor from '../JSONEditor/JSONEditor';
import _ from 'lodash';

function WalletContentsTable(props) {

    let actions = [];
    if (props.onShare) {
        actions.push(
            {
                icon: () => {
                    return (<Button component={'div'} variant={'contained'} color={'primary'}>Share</Button>)
                },
                onClick: (event, rowData) => {

                    let withoutMutation = { ...rowData };
                    delete withoutMutation.tableData;

                    props.onShare(withoutMutation);
                }
            },
        )
    }

    return (
        <MaterialTable
            title={props.title || 'Options'}
            columns={[
                // { title: 'ID', field: 'id' },
                {
                    title: 'Type', field: 'type', render: (rowData) => {
                        if (rowData.type.length === 2) {
                            return _.startCase(rowData.type[1]);
                        }
                        return rowData.type.map(_.startCase).join(", ")
                    }
                },
            ]}
            actions={actions}
            data={props.walletRows || []}
            options={{
                search: true,
                pageSize: 3,
                actionsColumnIndex: -1
            }}
            detailPanel={rowData => {
                let withoutMutation = { ...rowData };
                delete withoutMutation.tableData;
                return (
                    <JSONEditor
                        jsonObject={withoutMutation}
                    // style={{ height: "128px" }}
                    />
                )
            }}
        />
    );
}
export { WalletContentsTable };
export default WalletContentsTable;
