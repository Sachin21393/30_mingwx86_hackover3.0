const express=require('express');
const app=express();
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const multer=require("multer");
const nodemailer = require('nodemailer');
const SerpApi = require('google-search-results-nodejs');

var twilio=require('twilio');   


const axios = require('axios');
const { application } = require('express');



mongoose.connect("mongodb://localhost:27017/codestormDb");
const userSchema={
    name:String,
    email:String,
    contact:String,
    events:[String],
    friends:[String],
    longitude:String,
    Latitude:String,
    interest:[String],
    city:String,
    password:String,
    accepted:[String],
    decline:[String],

}
const eventSchema={
    admin:String,
    title:String,
    city:String,
    date:String,
    time:String,
    description:String,
    link:String,
   users:[String],
    amount:String,
    img:{
        data:Buffer,
        contentType:String
    },
    capacity:String,
    mode:String,
    participating:[String] // csv


}
const User=mongoose.model('User',userSchema);
const Events=mongoose.model('Events',eventSchema);
let id;

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.send("hjo");
})
app.post('/hostEvent',(req,res)=>{
    let description=req.body.description;
    let obj=new Events({
        description:description,
        city:req.body.city
    })
    obj.save();
    return res.json({
        data:obj
    })
})
app.post('/filter',(req,res)=>{

    let interest=req.body.interest;
    let city=req.body.city;
    if(interest!=""){
        Events.find({description:{$regex:interest,$options:'i'}},(er,data)=>{
            if(er){
                console.log(er);
            }else{
                return res.json({
                    src:data
                })
            }
        })

    }else{
        Events.find({city:{$regex:city,$options:'i'}},(er,data)=>{
            if(er){
                console.log(er);
            }else{
                return res.json({
                    src:data
                })
            }
        })
    }



})

app.post('/signup',(req,res)=>{
    let obj=new User({
        name:req.body.name,
        email:req.body.email,
        contact:req.body.contact,
        city:req.body.city,
        password:req.body.password

    })
    obj.save();
    return res.json({
        data:obj
    })

})

app.post('/register',(req,res)=>{
let event_id=req.body.event_id;
console.log(event_id);
let temp_id=id
Events.findOneAndUpdate({_id:event_id},{$push:{users:temp_id}},(er,data)=>{
 return res.json({
    obj:data
 })
 })    
});
let event_id;
app.post('/userlist',(req,res)=>{  // list to check user for particular event
event_id=req.body._id;
return res.json({
    data:event_id
    // <%=dkhfjkdf%>
})
})
app.post('/accept',(req,res)=>{
    let temp_id=req.body.id;
    User.findOneAndUpdate({_id:temp_id},{$push:{accepted:event_id}},(er,data)=>{
        if(er) console.log(er);
        else{
            console.log(data);
        }
    })
})



app.post('/login',(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;
    User.findOne({email:email},(er,data)=>{
        if(er) console.log(er);
        else{
            if(data.password==password){
                id=data._id.valueOf()

                res.send("successful");
                console.log(id);
            }
        }
    })

})
let scrap;
app.get('/scrap',(req,res)=>{
    const params = {
        engine : "google_events",
        q: "Coding events in Mumbai",
        google_domain: "google.com",
        gl: "us",
        hl: "en"
      };

      const callback = function(data) {
        console.log("Start");
        scrap=data["events_results"];
let n=scrap.length;
// admin:String,
// title:String,
// city:String,
// date:String,
// time:String,
// description:String,
// link:String,
// users:[String],
// amount:String,
// img:{
//     data:Buffer,
//     contentType:String
// },
// capacity:String,
// mode:String,
// participating:[String] // csv
console.log(scrap);
for(let i=0;i<n;i++){
    // console.log(scrap[i]);

    //    console.log(scrap[i].title);
    //    console.log(scrap[i].address[0]);
    //    console.log(scrap[i].link);


    //    console.log(scrap[i].date.when)
    //    console.log(scrap[i].description)
    //    console.log(scrap[i].ticket_info[0].link)
    //    console.log(scrap[i].venue.name)
    //    console.log(scrap[i].venue.rating)
    //    console.log(scrap[i].venue.link)





}

      };

      // Show result as JSON
      search.json(params, callback);

      axios.get('https://serpapi.com/search.json?q=events+in+Austin&google_domain=google.com&gl=us&hl=en')
        .then(res => {


        })
        .catch(error => {
          console.log("hello");
        });

})



//events near user's city
// app.post('/events_city',(req,res)=>{
//     // let city=req.body.city;
//     // Events.find({city:{$regex:city,$options:'i'}},(er,data)=>{
//     //     if(er) console.log(er);
//     //     else{
//     //         return res.json({
//     //             data:data
//     //         })
//     //     }


//     // })
// })




app.get("/confirm_appointment", async (req,res) => {
    // const doc_id = req.body.doc_id;
    const client = require('twilio')(accountSid, authToken);

    client.messages
          .create({body: 'Hello jugal you have a meetup', from: '+17273824362', to: '+919820038221'})
          .then(message => console.log(message.sid));




})

app.listen(80,()=>{
    console.log("started");
})
