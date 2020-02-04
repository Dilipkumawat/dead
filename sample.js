let computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({inHeader: {'Ocp-Apim-Subscription-Key': key}}), endpoint);

    var describeURL = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample1.jpg';

    // Analyze URL image
console.log('Analyzing URL image to describe...', describeURL.split('/').pop());
var caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);


const categoryURLImage = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png';

// Analyze URL image
console.log('Analyzing category in image...', categoryURLImage.split('/').pop());
let categories = (await computerVisionClient.analyzeImage(categoryURLImage)).categories;
console.log(`Categories: ${formatCategories(categories)}`);

// Formats the image categories
function formatCategories(categories) {
    categories.sort((a, b) => b.score - a.score);
    return categories.map(cat => `${cat.name} (${cat.score.toFixed(2)})`).join(', ');
}

console.log('-------------------------------------------------');
console.log('DETECT TAGS');
console.log();

// Image of different kind of dog.
const tagsURL = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png';

// Analyze URL image
console.log('Analyzing tags in image...', tagsURL.split('/').pop());
let tags = (await computerVisionClient.analyzeImage(tagsURL, {visualFeatures: ['Tags']})).tags;
console.log(`Tags: ${formatTags(tags)}`);


// Format tags for display
function formatTags(tags) {
    return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
}


// Image of a dog
const objectURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-node-sdk-samples/master/Data/image.jpg';

// Analyze a URL image
console.log('Analyzing objects in image...', objectURL.split('/').pop());
let objects = (await computerVisionClient.analyzeImage(objectURL, {visualFeatures: ['Objects']})).objects;
console.log();

// Print objects bounding box and confidence
if (objects.length) {
    console.log(`${objects.length} object${objects.length == 1 ? '' : 's'} found:`);
    for (let obj of objects) { console.log(`    ${obj.object} (${obj.confidence.toFixed(2)}) at ${formatRectObjects(obj.rectangle)}`); }
} else { console.log('No objects found.'); }

// Formats the bounding box
function formatRectObjects(rect) {
    return `top=${rect.y}`.padEnd(10) + `left=${rect.x}`.padEnd(10) + `bottom=${rect.y + rect.h}`.padEnd(12) 
    + `right=${rect.x + rect.w}`.padEnd(10) + `(${rect.w}x${rect.h})`;
}

const brandURLImage = 'https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/images/red-shirt-logo.jpg';

// Analyze URL image
console.log('Analyzing brands in image...', brandURLImage.split('/').pop());
let brands = (await computerVisionClient.analyzeImage(brandURLImage, {visualFeatures: ['Brands']})).brands;

// Print the brands found
if (brands.length) {
    console.log(`${brands.length} brand${brands.length != 1 ? 's' : ''} found:`);
    for (let brand of brands) {
        console.log(`    ${brand.name} (${brand.confidence.toFixed(2)} confidence)`);
    }
} else { console.log(`No brands found.`); }


const facesImageURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg';

// Analyze URL image.
console.log('Analyzing faces in image...', facesImageURL.split('/').pop());
// Get the visual feature for 'Faces' only.
let faces = (await computerVisionClient.analyzeImage(facesImageURL, {visualFeatures: ['Faces']})).faces;

// Print the bounding box, gender, and age from the faces.
if (faces.length) {
  console.log(`${faces.length} face${faces.length == 1 ? '' : 's'} found:`);
  for (let face of faces) { console.log(`    Gender: ${face.gender}`.padEnd(20) 
    + ` Age: ${face.age}`.padEnd(10) + `at ${formatRectFaces(face.faceRectangle)}`); }
} else { console.log('No faces found.'); }


// Formats the bounding box
function formatRectFaces(rect) {
    return `top=${rect.top}`.padEnd(10) + `left=${rect.left}`.padEnd(10) + `bottom=${rect.top + rect.height}`.padEnd(12) 
      + `right=${rect.left + rect.width}`.padEnd(10) + `(${rect.width}x${rect.height})`;
}

// The URL image and local images are not racy/adult. 
// Try your own racy/adult images for a more effective result.
const adultURLImage = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';

// Function to confirm racy or not
const isIt = flag => flag ? 'is' : "isn't";

// Analyze URL image
console.log('Analyzing image for racy/adult content...', adultURLImage.split('/').pop());
var adult = (await computerVisionClient.analyzeImage(adultURLImage, {
  visualFeatures: ['Adult']
})).adult;
console.log(`This probably ${isIt(adult.isAdultContent)} adult content (${adult.adultScore.toFixed(4)} score)`);
console.log(`This probably ${isIt(adult.isRacyContent)} racy content (${adult.racyScore.toFixed(4)} score)`);


const colorURLImage = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';

// Analyze URL image
console.log('Analyzing image for color scheme...', colorURLImage.split('/').pop());
console.log();
let color = (await computerVisionClient.analyzeImage(colorURLImage, {visualFeatures: ['Color']})).color;
printColorScheme(color);

// Print a detected color scheme
function printColorScheme(colors){
    console.log(`Image is in ${colors.isBwImg ? 'black and white' : 'color'}`);
    console.log(`Dominant colors: ${colors.dominantColors.join(', ')}`);
    console.log(`Dominant foreground color: ${colors.dominantColorForeground}`);
    console.log(`Dominant background color: ${colors.dominantColorBackground}`);
    console.log(`Suggested accent color: #${colors.accentColor}`);
}

const domainURLImage = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/landmark.jpg';
// Analyze URL image
console.log('Analyzing image for landmarks...', domainURLImage.split('/').pop());
let domain = (await computerVisionClient.analyzeImageByDomain('landmarks', domainURLImage)).result.landmarks;

// Prints domain-specific, recognized objects
if (domain.length) {
  console.log(`${domain.length} ${domain.length == 1 ? 'landmark' : 'landmarks'} found:`);
  for (let obj of domain) {
    console.log(`    ${obj.name}`.padEnd(20) + `(${obj.confidence.toFixed(2)} confidence)`.padEnd(20) + `${formatRectDomain(obj.faceRectangle)}`);
  }
} else {
  console.log('No landmarks found.');
}

// Formats bounding box
function formatRectDomain(rect) {
    if (!rect) return '';
    return `top=${rect.top}`.padEnd(10) + `left=${rect.left}`.padEnd(10) + `bottom=${rect.top + rect.height}`.padEnd(12) +
      `right=${rect.left + rect.width}`.padEnd(10) + `(${rect.width}x${rect.height})`;
}

const typeURLImage = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-python-sdk-samples/master/samples/vision/images/make_things_happen.jpg';

 // Analyze URL image
console.log('Analyzing type in image...', typeURLImage.split('/').pop());
let types = (await computerVisionClient.analyzeImage(typeURLImage, {visualFeatures: ['ImageType']})).imageType;
console.log(`Image appears to be ${describeType(types)}`);

function describeType(imageType) {
    if (imageType.clipArtType && imageType.clipArtType > imageType.lineDrawingType) return 'clip art';
    if (imageType.lineDrawingType && imageType.clipArtType < imageType.lineDrawingType) return 'a line drawing';
    return 'a photograph';
}


// URL images containing printed and handwritten text
const printedText     = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg';
const handwrittenText = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/handwritten_text.jpg';

// Recognize text in printed image
console.log('Recognizing printed text...', printedText.split('/').pop());
var printed = await recognizeText(computerVisionClient, 'Printed', printedText);
printRecText(printed);

// Recognize text in handwritten image
console.log('\nRecognizing handwritten text...', handwrittenText.split('/').pop());
var handwriting = await recognizeText(computerVisionClient, 'Handwritten', handwrittenText);
printRecText(handwriting);

// Perform text recognition and await the result
async function recognizeText(client, mode, url) {
    // To recognize text in a local image, replace client.recognizeText() with recognizeTextInStream() as shown:
    // result = await client.recognizeTextInStream(mode, () => createReadStream(localImagePath));
    let result = await client.recognizeText(mode, url);
    // Operation ID is last path segment of operationLocation (a URL)
    let operation = result.operationLocation.split('/').slice(-1)[0];
  
    // Wait for text recognition to complete
    // result.status is initially undefined, since it's the result of recognizeText
    while (result.status !== 'Succeeded') { await sleep(1000); result = await client.getTextOperationResult(operation); }
    return result.recognitionResult;
}

// Prints all text from OCR result
function printRecText(ocr) {
    if (ocr.lines.length) {
        console.log('Recognized text:');
        for (let line of ocr.lines) {
            console.log(line.words.map(w => w.text).join(' '));
        }
    }
    else { console.log('No recognized text.'); }
}