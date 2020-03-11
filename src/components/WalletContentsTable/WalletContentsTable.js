

import React from "react";
import MaterialTable from "material-table";
import JSONEditor from '../JSONEditor/JSONEditor';
import _ from 'lodash';

const { Cookies } = window;

function loadWalletContents() {
  const walletContents = Cookies.get('walletContents');
  if (!walletContents) {
    return null;
  }
  return JSON.parse(atob(walletContents));
}

function WalletContentsTable() {
  const [state, setState] = React.useState({
    walletLoaded: false,
    walletRows: []
  })
  React.useEffect(() => {
    console.log(state)
    if (state.walletLoaded === false) {
      (async () => {
        const walletContents = loadWalletContents();
        console.log(walletContents)
        setState({
          ...state,
          walletLoaded: true
        })
        if (walletContents) {
          console.log(walletContents)
          const walletRows = [];
          Object.values(walletContents).forEach((wc) => {
            if (wc.id) {
              walletRows.push(wc);
            } else {
              if (wc.verifiableCredential) {
                wc.verifiableCredential.forEach((vc) => {
                  walletRows.push(vc);
                })
              }
            }
          })
          setState({
            ...state,
            walletRows
          })
        }

      })()
    }
  }, [])

  return (
    <MaterialTable
      title="Wallet Contents"
      columns={[
        { title: 'ID', field: 'id' },
        {
          title: 'Type', field: 'type', render: (rowData) => {
            if (rowData.type.length === 2) {
              return _.startCase(rowData.type[1]);
            }
            return rowData.type.map(_.startCase).join(", ")
          }
        },
      ]}
      data={state.walletRows}
      options={{
        search: true
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