const express = require("express")
const  mongoose  = require("mongoose")
const  passport = require("passport")

const bodyParser  = require("body-parser")
const  LocalStrategy = require("passport-local")
const  passportLocalMongoose  = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/testdb");
const app = express()
var UserSchema = new mongoose.Schema({
    username:String,
    password:String
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);


app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/',function (req, res) {
  res.render('index.ejs')

})
app.get('/register',function (req, res) {
  res.render('register.ejs')

})

app.get('/login',function (req, res) {
  res.render('login.ejs')

})

app.get('/registration_to_login',(req,res) =>
{
  res.render('registration_to_login.ejs')
})
app.get('/welcome',(req,res) =>
{
  res.render('welcome.ejs')
})

app.get('/failure',(req,res) =>
{
  res.render('failure.ejs')
})

app.post('/register', function(req, res){
User.register(new User({username:req.body.username}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect('/registration_to_login');
       });
    });
});



app.post('/login', passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/failure'
    }), function(req, res) {
      console.log("%s is logged in",req.user.email)
});


app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});
