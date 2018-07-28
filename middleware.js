
const validation = require('./validations')

function register(req,res,next){

	let {fullname,username,email_id,password} = req.body;
	let error = [];
	if(!fullname){
		error.push({code:500,message:"Full name is required."})
	}
	else if(!username){
		error.push({code:500,message:"User name is required."})
	}
	else if(!email_id){
		error.push({code:500,message:"Email is required."})
	}else if(!password){
		error.push({code:500,message:"Password is required."})
	}
	else if(!validation.validateEmail(email_id)){
		error.push({code:500,message:"Please provide valid email."})
	}


	if(error.length >0){
		errors(error,res);
	}else
	next();		
	

}

function checkLogin(req,res,next){
	let {username,password} = req.body;
	let error = [];
	if(!username){
		error.push({code:500,message:"Username is required."})
	}
	else if(!password){
		error.push({code:500,message:"Password is required."})
	}

	if(error.length >0){
		errors(error,res);
	}else
	next();	
}






function errors(err,res){
	console.log("err"+err)
	if(err){
		return res.json(err[0])
	}
}



function convertPass(req,res,next){
	console.log(req.body)
	return validation.convertPass(req.body.password).then((data)=>{
		console.log("data==>"+data)
		 req.body.password = data
		 next()
		
	});
	
}







module.exports = {

	requiredCheck :register,
	convertPass:convertPass,
	checkLogin:checkLogin


}
