const crypto = require('crypto');

function encrypt(text, secretKey) {
  // Generar un IV aleatorio
  const iv = crypto.randomBytes(16); // 16 bytes para AES

  // Crear un objeto Cipher con IV
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  // Cifrar el texto
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Retorna IV concatenado con el texto cifrado (para poder usarlo en la función de descifrado)
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText, secretKey) {
  // Separar IV del texto cifrado
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encrypted = Buffer.from(textParts.join(':'), 'hex');

  // Crear un objeto Decipher con IV
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  // Descifrar el texto
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Retorna el texto descifrado
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
