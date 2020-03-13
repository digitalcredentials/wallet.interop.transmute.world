import React from "react";
import PropTypes from "prop-types";

import BasePage from "../BasePage/BasePage";

import WalletContentsTable from '../../components/WalletContentsTable'

const { Cookies, credentialHandlerPolyfill } = window;


function loadWalletContents() {
  let walletContents = Cookies.get('walletContents');
  if (!walletContents) {
    walletContents = localStorage.getItem('walletContents');
  }
  if (!walletContents) {
    return null;
  }
  return JSON.parse(atob(walletContents));
}
const HomePage = ({ tmui, setTmuiProp }) => {
  const [state, setState] = React.useState({})
  React.useEffect(() => {
    credentialHandlerPolyfill
      .loadOnce()
      .then(() => {
        const walletContents = loadWalletContents();
        setState({
          ...state,
          walletLoaded: true
        })
        if (walletContents) {
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
      })
  }, [])

  return (
    <BasePage tmui={tmui} setTmuiProp={setTmuiProp}>
      <WalletContentsTable walletRows={state.walletRows} />
    </BasePage>
  )
};

HomePage.propTypes = {
  tmui: PropTypes.object,
  setTmuiProp: PropTypes.func
};

export default HomePage;
