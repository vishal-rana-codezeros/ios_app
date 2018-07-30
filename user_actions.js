const model = require('./model');
const async = require('async');
const bcrypt = require('bcryptjs');
const validations = require('./validations') ;
const nodemailer = require('nodemailer');

module.exports = {
 createUser : function(req,res){

 	async.waterfall([
 		function(callback){
 			model.findOne({$or:[{email_id:req.body.email_id,status:'ACTIVE'},{username:req.body.username,status:'ACTIVE'}]},(err,data)=>{
 				err ?  callback({code:500,message:"Internal server error"}) : data ? callback({code:400,message:"Email or username already exist."}) :	callback(null,data);
 			})
 		},(data,callback)=>{
 				console.log('has no data');
 			  var Model = new model(req.body);
			  Model.save((err,data)=>{
			   if(err) callback({code:500,message:"Internal server error"})
			    else
			     callback(null,'done')
			})
 		}
 		],(err,data)=>{
 			if(err){
 				return res.json(err);
 			}else{
 				return res.json({code:201,message:"Registeration successful."})
 			}
 		})

 },
 checkLogin : function(req,res){
 		async.waterfall([
 			function(callback){
 				model.findOne({username:req.body.username,status:'ACTIVE'},(err,data)=>{
 					err ? callback({code:500,message:"Internal server error"}) : (!data) ? callback({code:400,message:"User name not found."}) : callback(null,data)
 				})
 			},function(code,callback){
 				bcrypt.compare(req.body.password,code.password,(err,match)=>{
 				err ? callback({code:500,message:"Internal server error"})  : (!match) ? callback({code:400,message:"Please check your password"}) : callback(null,code);
 				})
 			},function(modify,callback){
 				validations.mapLogin(modify,(modified)=>callback(null,modified))
 			},
 			],function(err,result){
 				if(err)return res.json(err)
 					else{
 							return res.json({code:200,message:"Success",data:result})
 						}

 			})


 },
forgot_password: function(req,res){

		async.waterfall([

			function(cb){
				if(req.body.email_id){
					model.findOne({email_id:req.body.email_id,status:'ACTIVE'},(err,result)=>{
						(err) ? cb({code:500,message:"Internal server error"}) : (!result) ? cb({code:400,message:"Email not found."}) : cb(null,result)
					})
				}

			},function(data,cb){
				validations.getRandomPassword((pass)=>{
					cb(null,pass.toString())
				});
			},
			function(pass,cb){
				validations.convertPass(pass).then(new_pass=>cb(null,new_pass,pass))
			},

			function(pass,new_ps,cb){
				console.log('new pass==>'+pass)
				model.findOneAndUpdate({email_id:req.body.email_id,status:'ACTIVE'},{$set:{password:pass}},{new:true},(err,new_pass)=>{
					(err) ? cb({code:500,message:"Internal server error"}) : cb(null,new_ps)
				})

			},function(new_pass,callback){
			    var transporter = nodemailer.createTransport({
					  	pool: true,
					    host: 'smtp.gmail.com',
					    port: 465,
					    secure: true,
				        auth: {
				        	// type:'PLAIN',
				            user: 'vishal.rana@codezeros.com', // generated ethereal user
				            pass: 'codezero#' // generated ethereal password
				        }

					})

			    let mailOptions = {
			        from: '"Codezeros 👻" <harshad.goswami@webcluesglobal.com>', // sender address
			        to: req.body.email_id, // list of receivers
			        subject: 'New Password request', // Subject line
			        text: 'Please find your new password.', // plain text body
			        html: `<b> ${new_pass}</b>` // html body
			    };

			    // send mail with defined transport object
				    transporter.sendMail(mailOptions, (error, info) => {
				        if (error) {
				        	console.log(error)
				            callback({code:500,message:"Internal server error"})
				        }else{
				     	console.log(info)
				        callback(null,'done')
				    }
				    });
			}

			],function(err,data){
				if(err)return res.json(err)
 					else{
 							return res.json({code:200,message:"New password has been sent to your email account."})
 						}
			})
	},

  checkUser : (req,res)=>{
    let {username} = req.query;
    model.findOne({username:username,status:'ACTIVE'},(err,usernameExist)=>{
      (err) ? res.json({code:500,message:"Internal server error"}) : (!usernameExist) ? res.json({status:true,message:"Username not found."}) :res.json({status:false,message:"Username already exist."})
    })

  }

 }
