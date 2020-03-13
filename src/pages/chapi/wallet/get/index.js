import React from "react";
import ChapiWalletGet from "./ChapiWalletGet";

import { compose } from "redux";

import tmui from "../../../../store/tmui";

const container = compose(tmui.container);

export default container(props => {
  return <ChapiWalletGet {...props} />;
});
