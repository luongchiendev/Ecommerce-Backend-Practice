const mongoose = require('mongoose');

const connectString = `mongodb://localhost:27017/shopDev`;
mongoose.connect(connectString).then ( _ => console.log(`Connect Mongodb Success`)).catch( err => console.log(`Error Connect!`))

//dev
if(1===0){
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}
module.exports = mongoose;