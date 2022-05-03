const House = require('../models/houseModel');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'algorent',
  api_key: '616942327127516',
  api_secret: 'opqZmiFCoAGEZ57iLAwr694bYn0',
});
const create = async (req, res) => {
  const {
    image,
    address,
    zipCode,
    state,
    city,
    size,
    numBed,
    numBath,
    amenities,
    price,
    contact,
  } = req.body;

  try {
    const promises = [];
    image.forEach(async (image) => {
      promises.push(
        cloudinary.uploader.upload(image, {
          folder: 'algorent',
        })
      );
    });
    await Promise.all(promises)
      .then((response) => {
        const imgUrl = [];
        response.forEach((info) => {
          imgUrl.push(info.url);
        });

        const newHouse = new House({
          address,
          state,
          city,
          zipCode,
          price,
          imgUrl,
          numBedrooms: numBed,
          numBathrooms: numBath,
          size,
          contact,
          amenities,
        });
        newHouse.save();
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
  return res
    .status(200)
    .json({ success: true, message: 'House listing created successfully' });
};

module.exports = { create };
