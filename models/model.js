const mongoose = require("mongoose");

const weatherSchema = mongoose.Schema({
    data: {type: Object, required: true},
    createdAt: {type: Date, default: Date.now()}
})


const Weather = mongoose.model("weatherData", weatherSchema);
module.exports = Weather;