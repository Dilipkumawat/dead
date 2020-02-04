'use strict';

const async = require('async');
const fs = require('fs');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

console.log("ComputerVisionClient>>>>>>>>>>>>>>>",ComputerVisionClient);

function computerVision() {
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

          var describeURL = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample1.jpg';
          // Analyze URL image
          console.log('Analyzing URL image to describe...', describeURL.split('/').pop());
          var caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
          console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);

          const colorURLImage = 'https://www.diskova.com/uploads/5_1_1521013269.png';

          // Analyze URL image
          console.log('Analyzing image for color scheme...', colorURLImage.split('/').pop());
          console.log();
          let color = (await computerVisionClient.analyzeImage(colorURLImage, {visualFeatures: ['Color']})).color;
          printColorScheme(color);
    },
    function () {
      return new Promise((resolve) => {
        resolve();
      })
    }
  ], (err) => {
    throw (err);
  });
}

computerVision();
// Print a detected color scheme
function printColorScheme(colors){
  console.log(`Image is in ${colors.isBwImg ? 'black and white' : 'color'}`);
  console.log(`Dominant colors: ${colors.dominantColors.join(', ')}`);
  console.log(`Dominant foreground color: ${colors.dominantColorForeground}`);
  console.log(`Dominant background color: ${colors.dominantColorBackground}`);
  console.log(`Suggested accent color: #${colors.accentColor}`);
}

