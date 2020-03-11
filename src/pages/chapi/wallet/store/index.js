import React from "react";
import ChapiWalletStore from "./ChapiWalletStore";

import { compose } from "redux";

import tmui from "../../../../store/tmui";

const container = compose(tmui.container);

export default container(props => {
  return <ChapiWalletStore {...props} />;
});
