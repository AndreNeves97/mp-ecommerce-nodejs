const publicUrl = process.env.PUBLIC_SERVER_URL;
exports.publicUrl = publicUrl;

exports.getPublicUrl = (path) => {
  return `${publicUrl}/${path}`;
};
