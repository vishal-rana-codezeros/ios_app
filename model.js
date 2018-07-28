const mongoose = require('mongoose');
const schema  = mongoose.Schema;

const userSchema = new schema({
fullname:{type:String,required:true},
username:{type:String,required:true,sparse:true,unique:true},
password:{type:String,required:true},
email_id:{type:String,required:true,sparse:true},
age:{type:Number},
profession_id:String,
city_id:String,
religion:String,
gender:{type:String,enum:['Male','Female']},
createdAt:{type:Date,default:Date.now},
type:{type:String,enum:['normal','facebook'],default:'normal'},
createdAt:{type:Date,default:Date.now},
fb_id:String,
status:{type:String,default:'ACTIVE'}
}) ;


module.exports = mongoose.model('user',userSchema);
