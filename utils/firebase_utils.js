/* Node Imports */
var dotenv = require("dotenv");
dotenv.config();
var path = require("path");
var sharp = require("sharp");

/* Framework Imports */
var admin = require("firebase-admin");

/* Local Imports */

var firebase_creds = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url
}

admin.initializeApp({
  credential: admin.credential.cert(firebase_creds),
  storageBucket: `${firebase_creds.project_id}.appspot.com`
});

const bucket = admin.storage().bucket();

uploadImage = async (images) => {
  var images_urls = []

  for (var image of images) {
    const filename = `${Date.now()}_${Math.random() * 10000}.jpeg`;
    var imageRef = bucket.file('images/'+filename, {
      public: true,
      metadata: {
        contentType: "image/jpeg"
      }
    });
    const metadata = await sharp(image.buffer).metadata();
    if (!metadata){
      console.log("Metadata problem can't update image");
      continue;
    }
    const resizeRatio = 720 / metadata.height;
    await sharp(image.buffer)
            .resize(
              width = parseInt(metadata.width * resizeRatio),
              height = 720
            )
            .jpeg({quality: 80})
            .toBuffer()
            .then( async (data) => {
              await imageRef.save(data, async (err) => {
                if (err) {
                  console.error(`Error Uploading: ${filename} with error: ${error}`);
                  return;
                }
                
                await imageRef.makePublic();
                console.log("Image url", imageRef.publicUrl());
                images_urls.push(imageRef.publicUrl());
              });
            })
            .catch( err => {
              console.log(err);
            });
  }
  return images_urls;
}

module.exports = {
  uploadImage
}