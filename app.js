//jshint esversion: 6
const express=require("express");
const bodyParser=require('body-parser');
const request=require('request');
const app=express();
const https=require("https");

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.listen(process.env.PORT||3000,function(){
  console.log("sever running at port 3000");
});

app.post("/",function(req,res){
  var fname=req.body.fname;
  var lname=req.body.lname;
  var email=req.body.email;
  console.log(fname,lname,email);

  var data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:fname,
          LNAME:lname
        }
      }
    ]
  };

  var jsondata=JSON.stringify(data);
  const url="https://us4.api.mailchimp.com/3.0/lists/6634cd7ee1";
  const options={
    method:"POST",
    auth:"sidsb:63c503e430a8fd8db9ce7abf7887ad0c-us4"
  }
  const request=https.request(url,options,function(response){

    if(response.statusCode==200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }


    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsondata);
  request.end();

})

app.post("/failure",function(req,res){
  res.redirect("/");
})



//63c503e430a8fd8db9ce7abf7887ad0c-us4
//6634cd7ee1
