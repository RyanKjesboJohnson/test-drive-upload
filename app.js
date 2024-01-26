const fs = require('fs')
const { google } = require('googleapis')

const apikeys = require('./apikey')

const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    )

    await jwtClient.authorize();
    return jwtClient;
}

const fileName = 'test.txt';

async function uploadFile(authClient){
    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version: 'v3', auth: authClient});

        let fileMetaData = {
            name: "test text again again",
            parents: ["1_lIyItzQyEp3R_rDE3tt_20UGKgpSLKx"]
        }
        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream(fileName),
                mimeType: 'text/plain'
            },
            fields: 'id'
        },function(err,file){
            if(err){
                return rejected(err)
            }
            resolve(file)

        })
    })

}

console.log(authorize().then(uploadFile).catch(("err")));
