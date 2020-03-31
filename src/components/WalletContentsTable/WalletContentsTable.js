

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

    let { credentialRequestOptions } = props;
    let query;
    let columns = [];
    if (credentialRequestOptions) {
        query = Array.isArray(credentialRequestOptions.web.VerifiablePresentation.query) ?
            credentialRequestOptions.web.VerifiablePresentation.query[0] : credentialRequestOptions.web.VerifiablePresentation.query;

        let typeFilterDefault = ''
        if (query.type == 'DIDAuth') {
            typeFilterDefault = "VerifiablePresentation"
        }
        if (query.credentialQuery) {
            if (Array.isArray(query.credentialQuery.example.type)) {
                typeFilterDefault = query.credentialQuery.example.type[0]
            } else {
                typeFilterDefault = query.credentialQuery.example.type
            }
        }
        columns.push({
            title: 'Type', field: 'type', render: (rowData) => {
                if (typeof rowData.type === 'string') {
                    return _.startCase(rowData.type);
                }
                console.log(rowData.type)
                if (rowData.type.length === 2) {
                    return _.startCase(rowData.type[1]);
                }
                return rowData.type.map(_.startCase).join(", ")
            },
            defaultFilter: typeFilterDefault,
            customFilterAndSearch: (term, rowData) => {
                if (Array.isArray(rowData.type)) {
                    return rowData.type.indexOf(term) !== -1;
                }
                return rowData.type === term;
            }
        })
        if (query.type == 'DIDAuth') {
            columns.push({
                title: 'Domain', field: 'domain', render: (rowData) => {
                    return rowData.proof.domain;
                },
                defaultFilter: credentialRequestOptions.web.VerifiablePresentation.domain,
                customFilterAndSearch: (term, rowData) => {
                    return rowData.proof.domain === term;
                }
            })
        }
    } else {
        columns.push({
            title: 'Type', field: 'type', render: (rowData) => {
                if (typeof rowData.type === 'string') {
                    return _.startCase(rowData.type);
                }
                if (rowData.type.length === 2) {
                    return _.startCase(rowData.type[1]);
                }
                return rowData.type.map(_.startCase).join(", ")
            },
            customFilterAndSearch: (term, rowData) => {
                if (Array.isArray(rowData.type)) {
                    return rowData.type.indexOf(term) !== -1;
                }
                return rowData.type === term;
            }
        })
    }

    return (
        <MaterialTable
            title={props.title || 'Options'}
            columns={columns}
            actions={actions}
            data={props.walletRows || []}
            options={{
                filtering: true,
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
