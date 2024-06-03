const { response } = require("../../server");
const { Post, Content, User } = require("../db/models");
const { authorize, uploadFile, getFileDownloadUrl, deleteFileFromDrive } = require("../utils/driveUpload/driveUpload");
const fs = require('fs');

/*
JPEG Y JPG: image/jpeg
PNG: image/png
GIF: image/gif
BMP: image/bmp
TIFF: image/tiff
WebP: image/webp
SVG: image/svg+xml
TEXT: text/plain
*/

const contentController = {
  createPost: async (req, res) => {
    try {
      const userId = req.params.userId;
      const file = req.file; //si captura el archivo
      const { name, folderName, content } = req.body;
      console.log("arvhivo: ", file);
      const user = await User.findOne({ where: { id: userId } })
      if (!user) return res.status(404).send({ message: "User not found" })
      if (file) {

        //=============================subir a drive==============================
        const jwtauth = await authorize();
        const resp = await uploadFile(jwtauth, file, file.mimetype, folderName, name);
        if (resp) {

          if (userId && file && name && folderName && content) {
            const newContent = await Content.create({
              type: "post",
            });
            await newContent.setUser(user);

            console.log(resp);
            const newPost = await Post.create({
              content: content,
              driveId: resp.fileId,
              contentId: newContent.id,
            })
            console.log("post cargado correctamente")
            return res.status(201).send({ message: "post cargado con exito", post: newPost });

          }
          else return res.status(404).send({ message: "error..." });
        }
        else return res.status(404).send({ message: "ocurrio un error al enviar el mensaje" });
      }
      else {
        if (userId && name && folderName && content) {
          const newContent = await Content.create({
            type: "post",

          });
          await newContent.setUser(user);

          const newPost = await Post.create({
            content: content,
            contentId: newContent.id,
          });
          return res.status(201).send({ message: "post cargado con exito", post: newPost })
        }
        else return res.status(404).send({ message: "error..." });
      }
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },

  testGetUrl: async (req, res) => {
    try {
      const jwtauth = await authorize();
      const fileId = "1HNmML3zrNpvcAR61e_RcbOBU10lto2Ce";
      const fileUrl = await getFileDownloadUrl(jwtauth, fileId);
      if (fileUrl) return res.status(200).send({ url: fileUrl });
      else return res.status(404);

    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  getPosts: async (req, res) => {
    try {
      const posts = await Content.findAll({
        where: {
          type: "post",

        },
        include: [
          {
            model: Post,
            as: "postInfo"
          },
          {
            model: User,
            attributes: ["id", "email", "name", "lastname", "profileImageUrl", "role"]
          }
        ]
      })
      return res.status(200).send({ posts: posts });
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  deletePost: async (req, res) => {
    try {
      const { contentId } = req.params;
      const content = await Content.findOne({ where: { id: contentId } });

      if (!content) return res.status(400).send({ message: 'No se encontró el contenido' });
      else {
        const post = await Post.findOne({
          where: {
            contentId: content.id
          }
        });
        if (!post) return res.status(400).send({ message: 'No se encontró el post' });
        if (post.driveId != null) {
          const jwtauth = await authorize();
          try {
            const result = await deleteFileFromDrive(jwtauth, post.driveId);
            if (!result) throw new Error("No se pudo eliminar el archivo de Drive");
          } catch (error) {
            console.error("Error al eliminar el archivo de Drive:", error);
            return res.status(500).send({ error: "Error interno del servidor" });
          }
        }

        await post.destroy();
        await content.destroy();
        return res.status(200).send({ message: 'Se eliminó el Post' });

      }
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  }
}

module.exports = contentController;