const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

// Create an S3 client
const s3Client = new S3Client({
  region: 'us-east-1', // Specify the region where your S3 bucket is located
  credentials: fromIni({
    profile: 'default' // Use the default AWS profile from the credentials file
  })
});

// fucntion to set params and save file

const saveImages = async (request, image) => {
    try {
        const params = {
            Bucket: 'twitterpictures', // Specify your S3 bucket name
            Key: `${Date.now()}_${request.originalname}`, // Generate a unique key for each image (timestamp + original filename)
            Body: image, // Use the image buffer as the body
            ContentType: request.mimetype // Specify the content type of the image
        };
        
        const uploadResult = await s3Client.send(new PutObjectCommand(params));
        const imageUrl = `https://twitterpictures.s3.amazonaws.com/${params.Key}`;
        return imageUrl;
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error; // Rethrow the error to handle it further up the call stack
    }
};

module.exports =  saveImages ;