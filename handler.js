const request = require('request');
const unzip = require('unzip-stream');
const AWS = require('aws-sdk')
const s3 = new AWS.S3();


const ZIP_URL = process.env.ZIP_URL;
const BUCKET_NAME = process.env.BUCKET_NAME;
const SUB_BUCKET_NAME = process.env.SUB_BUCKET_NAME;


exports.handler = (event, context, callback) => {
    request(ZIP_URL)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            s3.upload({
                Bucket: BUCKET_NAME,
                Key: entry.path.replace(/.+?\//, SUB_BUCKET_NAME),
                Body: entry
            },(error, data) => {
                callback(error, `Successfully uploaded file: ${data.key}`);
            });
        });
}
