import cloudinary from "../config/cloudinary";

const upload = async (image64, option = {}) => {
  const uploaded = await cloudinary.uploader.upload(image64.data, option);
  return {
    title: image64.title,
    url: uploaded.secure_url,
    description: image64.description ? image64.description : null,
  };
};

const uploadMultiple = (lstImages64, option = {}, prefix = "") => {
  const cloudinaryPromises = Promise.all(
    lstImages64.map((image64) =>
      upload(image64, {
        ...option,
        ...(image64.option ? image64.option : null),
        public_id: prefix + image64.title,
      })
    )
  );
  return new Promise((resolve, reject) => {
    cloudinaryPromises
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const destroy = async (public_id, option = {}) => {
  const result = await cloudinary.uploader.destroy(public_id, option);
  return result;
};

/**
 * @param  {string} path
 * @description Xoa toan bo anh va thu muc tren cloudinary
 */
const clearAllImage = async (path) => {
  if (cloudinary.api.resources(path)) {
    const deleteImage = await cloudinary.api.delete_resources_by_prefix(
      `${path}/`
    );
    try {
      cloudinary.api.delete_folder(path);
    } catch (error) {
      console.log(`Folder ${path} has no images resource`);
    }
    return true;
  }
};

export default {
  upload,
  uploadMultiple,
  destroy,
  clearAllImage,
};
