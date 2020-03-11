import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Schedule from '@material-ui/icons/Schedule';
import Fingerprint from '@material-ui/icons/Fingerprint';
import AccountBalance from '@material-ui/icons/AccountBalance';


const useStyles = makeStyles({
    root: {
        margin: 'auto',
        marginTop: '5%',
        maxWidth: 545,
    },
});

export default function CredentialCard({ vc }) {
    const classes = useStyles();

    const types = vc.type;
    const type = types.slice(1).join('/');

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {_.startCase(type)}
                    </Typography>

                    <Grid container>
                        <Grid item xs={12}>
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Fingerprint />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Subject" secondary={vc.credentialSubject.id} />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <AccountBalance />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Issuer" secondary={vc.issuer} />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Schedule />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Date" secondary={moment(vc.issuanceDate).format('LLL')} />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>

                </CardContent >
            </CardActionArea >
        </Card >
    );
}