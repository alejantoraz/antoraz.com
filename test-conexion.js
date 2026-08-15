require('dotenv').config();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
  },
});

(async () => {
  try {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET,
      Delimiter: '/',
    }));
    console.log('✅ Conexión OK');
    console.log('Carpetas encontradas:', res.CommonPrefixes?.map(p => p.Prefix));
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }
})();
