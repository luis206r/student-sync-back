const { google } = require("googleapis");
const { Readable } = require('stream');
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const fs = require('fs');

const authorize = async () => {
  try {
    const jwtClient = new google.auth.JWT(
      "test1-460@student-collab-425217.iam.gserviceaccount.com",
      null,
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCbdOzPSjN/TlR8\nKw3aJ7woP0bL9QXV7o1/b6rdkPJc0VSynUq2uVHAOR7ouJ1UIng/L8Z3/1d5824g\nlC7QR3OUN7qrVMqHFPn1XOBARJ6Bot184FovybAfKJ3mFL0vKAWs7IS4ejv6YYzn\nt694wD55sxN8YZf8ef+AgRGE3EREJPRsTx7U2nwRkcB+D3NwGwGmFooev3CQquJM\nc1oI1Tnm1QlixeXwhi46eHFE0ATusMuNNtMyTonSk0wCnyXpvxs0gCHKiJw6yuw0\nd3lXxsRpheiy+3fSakVO6vU5FW4C3zAxJ6ckvxBdrIVW3ymxyqnNmMPG/Zqt/zOz\nMkfIaYd3AgMBAAECggEACBGj77J7RSKssfE40Sz6JYtQl7+KY6tJKZHYkug2HD6P\n9eFs16/Qys3BiUoj0xJ4SVdSfDdYXq/ASe1HF2/N/lB83kMSwWYuVIpTPXgSU3Tq\nUtQA+mAD8JTBdV14NbK5xgWqHI/Y/csDGaKSzLgLG3KsZ+qs4oxL3cCqnHR5D/cC\nR3nKNXjcsf0isPvZKWX6Tqxj3tvNcw7npygOVK4HRiTW1HSlaRiTbwAKgfaLw0HV\nddWru9Z7iLjbpU7cgC/T6u6bMn9RhVbqQnp9LFgyKjvCZcxKuJQfelnisczbtqkQ\nB93HznzZEC4BY015U2yd0nZfRhQhBe0nxdrqAEFu+QKBgQDbSrjkJmaFMtlwW/G+\n8RnxyXj+aQf8FI0Rf7w9p1ojQcDIPkw9y9kvnjJtrIJuLDYh0cfCJj0eXmyGCAEu\n8KJY9aIIbmZsWiRCHJUFqXmr6d7xm7Ut7cFtZ1WvDvC1gZNC8fKCFJaCpLFtiFoU\nvFS2xhs+9eZsB/BROv8FGUu8lQKBgQC1eq+qMWUtHdkzDMcSsxjD2mfSQd7EKumP\nBS4bJXlJJ5EO2TUOsCdMQfRFhRvDoLgRr/W1i9aqgP2uKPzNoM+WUDzWkug2Zoai\nkCOzdhs8sKzpx1MX7qFdEwEW045X3F/rEd3lZoEj29HcB3/+CcJqzsgrM59DxEXl\nLZGRkOFk2wKBgELWgIoRZjf86qdDbuhaxiSa2sT4MFXV0bVesHo+MswCM4cU7dn7\n8sN/vTEOXmbEFO+z5+W2D/TcpMkpUWsELwdcPrnBJHir9NctrQIfyJTsYGZVpiBM\nkiMNVuFXdWhtCPxjkB2ztrg1CFsxLvuY910J/q3u9v9AYC/yAl6EekANAoGAINPr\nmN7MjYe7tXdXP3O0RCFq7GbL9DJLA3sNZw21Td1haQ0zgs+snCfGFxlH93BIO7LX\nwJpmH3ur5+g0KsIvKuKizrHOXaDYM+nc+2ae8LCI5tUOm+Knv91jMgzcz9nmY/Bc\nclXDgIgQAzw8E+kSCR4UqXPyGGEVv6opjepmS0cCgYBbD8FM6XoJ9L7LxmuBQRqr\nxqfeWSxS7Nvtef881zxvzSROt8abexLntskXRCHqz3ghz8OvDWnmB2XCv7IerZ2Z\nrPR5wOPolYlo6/+JRl59hsZflJsIBnj6aHCkdgFaj2rKcBGjE5bQCv4SVy3rWsa8\nzamWGbx/wGMzd+1y5r7Vcw==\n-----END PRIVATE KEY-----\n",
      SCOPE
    );

    await jwtClient.authorize();
    return jwtClient;
  } catch (err) {
    console.error(err);
  }
}

const getOrCreateFolder = async (authClient, folderName, parentFolderId) => {
  const drive = google.drive({ version: "v3", auth: authClient });

  // Buscar la carpeta por nombre y dentro de la carpeta padre
  const searchResult = await drive.files.list({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and '${parentFolderId}' in parents`,
    fields: "files(id)",
  });

  // Si la carpeta ya existe, devolver su ID
  if (searchResult.data.files.length > 0) {
    return searchResult.data.files[0].id;
  }

  // Si la carpeta no existe, crearla dentro de la carpeta padre
  const folderMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: [parentFolderId],
  };

  const folder = await drive.files.create({
    resource: folderMetadata,
    fields: "id",
  });

  return folder.data.id;
}

const uploadFile = async (
  authClient,
  file,
  typeOfFile,
  parentFolderName,
  filename
  //grandParentFolderName
) => {
  try {
    console.log("uploading...");
    const drive = google.drive({ version: "v3", auth: authClient });

    // Obtener el ID del padre de la carpeta o crearla si no existe
    const parentFolderId = await getOrCreateFolder(
      authClient,
      parentFolderName,
      "1wgaClEThKFCY-QarBDXbV-XbEgqW51eN"
    );

    // Configurar los metadatos del archivo
    const fileMetadata = {
      //name: file.name,
      name: filename,
      parents: [parentFolderId],
    };

    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null);

    // Subir el archivo a la carpeta
    const uploadedFile = await drive.files.create({
      resource: fileMetadata,
      media: {

        body: fileStream,
        mimeType: typeOfFile,
      },
      fields: "id",
    });

    await drive.permissions.create({
      fileId: uploadedFile.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // const fileInfo = await drive.files.get({
    //   fileId: uploadedFile.data.id,
    //   fields: 'webViewLink', // Campo que contiene la URL de visualización del archivo
    // });

    console.log("Archivo subido con éxito. ID:", uploadedFile.data.id);
    return {
      fileId: uploadedFile.data.id,
      //fileUrl: fileInfo.data.webViewLink,
    };
  } catch (err) {
    console.error("Error al subir el archivo:", err);
    throw err;
  }
}

const getFileDownloadUrl = async (authClient, fileId) => {
  try {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'webContentLink', // Aquí se solicita específicamente el campo "webViewLink", que proporciona la URL de visualización del archivo
    });
    return file.data.webContentLink;
  } catch (err) {
    console.error('Error al obtener la URL del archivo:', err);
    throw err;
  }
};

const deleteFileFromDrive = async (authClient, fileId) => {
  try {
    console.log("eliminando archivo...")
    const drive = google.drive({ version: "v3", auth: authClient });

    // Eliminar el archivo de Drive
    await drive.files.delete({
      fileId: fileId,
    });

    console.log("Archivo eliminado con éxito:", fileId);
    return ({ message: "Archivo eliminado", fileId: fileId });
  } catch (err) {
    console.error("Error al eliminar el archivo de Drive:", err);
    throw err;
  }
};

module.exports = { authorize, uploadFile, getFileDownloadUrl, deleteFileFromDrive };