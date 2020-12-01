const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let SongModel = {};

const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setLyrics = (lyrics) => _.escape(lyrics).trim();

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  lyrics: {
    type: String,
    required: true,
    trim: true,
    set: setLyrics,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

  lastModified: {
    type: Date,
    default: Date.now,
  },
});

SongSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  lyrics: doc.lyrics,
});

SongSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return SongModel.find(search).select('name lyrics').lean().exec(callback);
};

SongSchema.statics.findByID = (songID, callback) => {
  const search = {
    _id: convertID(songID),
  };

  return SongModel.findOne(search).exec(callback);
};

SongModel = mongoose.model('Song', SongSchema);

module.exports.SongModel = SongModel;
module.exports.SongSchema = SongSchema;
