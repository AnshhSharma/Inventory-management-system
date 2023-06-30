const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/InventoryManagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
.then(()=>{
    console.log("Database Connected");
})
.catch((e)=>{
    console.log("there is some error: ",e);
})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
})

const orderSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    type:{
        type:String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    state:{
        type:String,
        required: true
    },
})

const stockSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    type:{
        type:String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
})

const stockSummarySchema = new mongoose.Schema({
    type:{
        type:String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    pricePerUnit:{
        type: Number,
        required: true
    }
})

const userCollection = mongoose.model("users",userSchema);
const orderCollection = mongoose.model("orders",orderSchema);
const stockSummaryCollection = mongoose.model("stock_summaries",stockSummarySchema);
const stockCollection = mongoose.model("stocks", stockSchema)

module.exports = {
    userCollection,
    orderCollection,
    stockCollection,
    stockSummaryCollection
  };