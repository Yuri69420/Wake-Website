const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Load client secrets from a local file.
const authorize = (credentials, callback) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
};

// Get and store new token after prompting for user authorization.
const getAccessToken = (oAuth2Client, callback) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
};

// Upload file to Google Drive
const uploadFile = (auth, filePath, fileName) => {
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        'name': fileName,
        parents: ['your-folder-id'] // Optional: specify the folder ID to upload into
    };
    const media = {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: fs.createReadStream(filePath),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    }, (err, file) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File Id: ', file.data.id);
        }
    });
};

// Load client secrets from a local file and authorize
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.error('Error loading client secret file:', err);
    authorize(JSON.parse(content), (auth) => {
        uploadFile(auth, 'path-to-your-file.xlsx', 'file-name.xlsx');
    });
});
