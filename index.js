const rp            = require('request-promise');
const creds         = require('./creds');
const token         = creds.token;
const dropletQuery  = 'https://api.digitalocean.com/v2/droplets';

const options = {
    uri: dropletQuery,
    headers: {
        'Authorization': `Bearer ${token}`
    },
    json: true
};

let dropletIds      = [];

rp(options)
    .then((response) => {
        response.droplets.forEach(id => {
            dropletIds.push(id.id);
        });
        dropletIds.forEach(id => {
            let snapshotOptions = {
                method: 'POST',
                uri: `${dropletQuery}/${id}/actions`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: {
                    type: 'snapshot',
                    name: 'Snapshot taken on: ' + new Date()
                },
                json: true
            };
            rp(snapshotOptions)
                .then((response) => {
                    console.log(response);
                })
                .catch(err => console.log(err));
        });
    })
    .catch(err => console.log(err));

