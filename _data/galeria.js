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

module.exports = async function () {
  const bucket = process.env.B2_BUCKET;

  const carpetas = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Delimiter: '/',
  }));

  const proyectos = [];

  for (const prefijo of carpetas.CommonPrefixes || []) {
    const nombreProyecto = prefijo.Prefix.replace('/', '');

    const archivos = await s3.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefijo.Prefix,
    }));

    const imagenes = (archivos.Contents || [])
      .filter(obj => /\.(jpe?g|png|webp|gif)$/i.test(obj.Key))
      .map(obj => `${process.env.B2_ENDPOINT}/${bucket}/${obj.Key}`);

    if (imagenes.length) {
      proyectos.push({
        nombre: nombreProyecto,
        portada: imagenes[0],
        imagenes,
      });
    }
  }

  return proyectos;
};
