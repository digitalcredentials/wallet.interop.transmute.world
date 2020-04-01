import React from "react";
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


function HolderDID() {

    let holder = localStorage.getItem('holder');

    if (!holder) {
        holder = 'did:web:vc.transmute.world';
        localStorage.setItem('holder', holder);
    }

    const [state, setState] = React.useState({
        holder,
    })
    return (
        <div style={{ marginBottom: '16px' }}>
            <InputLabel id={'holder-label'}>Holder</InputLabel>
            <Select
                labelId="holder-label"
                value={state.holder}
                onChange={(event) => {
                    setState({
                        holder: event.target.value
                    })
                    localStorage.setItem('holder', event.target.value);
                }}
            >
                <MenuItem value={'did:web:vc.transmute.world'}>did:web:vc.transmute.world</MenuItem>
                <MenuItem value={'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd'}>did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd</MenuItem>
                <MenuItem value={'did:elem:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg'}>did:elem:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg</MenuItem>
            </Select>
        </div>
    );
}
export { HolderDID };
export default HolderDID;
