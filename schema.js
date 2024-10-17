const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      college: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().allow("", null),
      contact_number: joi.number().required(),
      amenities: joi.string().required(), 
      type: joi.string(), 
      // availability: joi.boolean().required(),
      totalRooms:joi.number().required().min(1),
      occupiedRooms: joi.number().required().min(0),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      comments: joi.string().required(),
      rating: joi.number().required().min(1).max(5),
    })
    .required(),
});
