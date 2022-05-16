const House = require('../models/houseModel');
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'algorent',
  api_key: '616942327127516',
  api_secret: 'opqZmiFCoAGEZ57iLAwr694bYn0',
});
const create = async (req, res) => {
  const {
    image,
    mapUrls,
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

  const owner = await User.findById(req.userId);

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

        var stringUrl = "["
        imgUrl.forEach((url) =>{
          stringUrl += "'" + url + "', "
        })
        stringUrl += "]"

        const newHouse = new House({
          address,
          state,
          city,
          zipCode,
          price,
          imgUrl:stringUrl,
          mapUrls,
          numBedrooms: numBed,
          numBathrooms: numBath,
          size,
          contact,
          amenities,
          owner,
        });
        newHouse.save();
        return res
        .status(200)
        .json({ success: true, message: 'House listing created successfully' });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

module.exports = { create };
