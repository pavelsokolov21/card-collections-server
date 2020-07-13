const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpiderManHeroesAndVillainsPart1 = new Schema({
    id: String,
    collection: [String]
});

module.exports = mongoose.model('spider-man-heroes-and-villains-part-1-users-collections', SpiderManHeroesAndVillainsPart1);
