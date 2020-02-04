var request = require("request");
var config = require('./config');
var http  = require("http");

const async = require('async');
const fs = require('fs');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;


module.exports.getColor = getColor;

function getColor(userdata, pool, callback) {
    console.log("userdata>>>>>>>>>>>>",userdata);
    var resultJson = '';
    var strJson = '';
    var sha1 = require('sha1');
    var url = '';
    if (typeof userdata.url != 'undefined' && userdata.url != '') {
        url = userdata.url;
    } else {
        resultJson = '{"replyCode":"error","replyMsg":"Please send image url","cmd":"login"}\n';
        callback(400, null, resultJson);
        return;
    }

    async.series([
        async function () {
          console.log(">>>>>>>>>>>>>>>>>>I m here");
          /**
             * AUTHENTICATE
             * This single client is used for all examples.
             */
            // let key = process.env['COMPUTER_VISION_SUBSCRIPTION_KEY'];
            // let endpoint = process.env['COMPUTER_VISION_ENDPOINT'];
  
            let key = "405562377170424ea8945e0abb594147";
            let endpoint = "https://testcomputervisionde.cognitiveservices.azure.com/";
            console.log(">>>>>>>>>>>>>>>>>",key);
            console.log(">>>>>>>>>>>>>>>>endPoint",endpoint);
  
            if (!key) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }
  
  
            let computerVisionClient = new ComputerVisionClient(
              new ApiKeyCredentials(
                {inHeader: {'Ocp-Apim-Subscription-Key': key}}
              ), endpoint
  
            );
  
            const colorURLImage = url;
  
            // Analyze URL image
            console.log('Analyzing image for color scheme...', colorURLImage.split('/').pop());
            console.log();
            let color = (await computerVisionClient.analyzeImage(colorURLImage, {visualFeatures: ['Color']})).color;
            console.log("color>>>>>>>>>>>",color);
            resultJson = '{"replyCode":"success","replyMsg":"Images Colors","imagesIsIn":"' + color.isBwImg+'","dominantColors":"' + color.dominantColors.join(', ') + '","dominantForegroundColor":"' + color.dominantColorForeground + '","dominantBackgroundColor":"' + color.dominantColorBackground + '","cmd":"getColor"}\n';
            callback(200, null, resultJson);
            return;
            //printColorScheme(color);
      },
      function () {
        return new Promise((resolve) => {
          resolve();
        })
      }
    ], (err) => {
        resultJson = '{"replyCode":"error","replyMsg":"'+err+',"cmd":"getColor"}\n';
        callback(400, null, resultJson);
        return;
      //throw (err);
    });


    
}