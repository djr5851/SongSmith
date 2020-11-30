const { Model } = require('mongoose');
const models = require('../models');

const { Song } = models;

const makerPage = (req, res) => {
  Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), songs: docs });
  });
};

const deleteSong = (req, res) => {    
  if(!req.body.songID) {
      return res.status(400).json({ error: 'An error occured' });
  }

  Song.SongModel.deleteOne({_id:req.body.songID}, () => {
      res.json({ redirect: '/maker' });
  });
  return res.status(200);
};

const makeSong = (req, res) => {
  if (!req.body.name || !req.body.lyrics) {
    return res.status(400).json({ error: 'Name and lyrics are required' });
  }

  const songData = {
    name: req.body.name,
    lyrics: req.body.lyrics,
    owner: req.session.account._id,
  };

  const newSong = new Song.SongModel(songData);

  const songPromise = newSong.save();

  songPromise.then(() => res.json({ redirect: '/maker' }));

  songPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Song already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return songPromise;
};

const getSongs = (request, response) => {
  const req = request;
  const res = response;

  return Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ songs: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getSongs = getSongs;
module.exports.make = makeSong;
module.exports.delete = deleteSong;
