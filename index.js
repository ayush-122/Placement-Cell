const express =require('express');
const app =express();
const port = process.env.PORT || 3000;
const expressLayouts=require('express-ejs-layouts');

const db =require('./config/mongoose');
const session =require('express-session');
const passport =require('passport');
const passportLocal =require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleWare =require('node-sass-middleware');

const json2csv =require('json2csv').Parser;
const fs =require('fs');

const flash =require('connect-flash');

const customWare =require('./config/middleware');


//use layouts



app.use(expressLayouts);
app.use(express.static('./assets'));
app.use(express.urlencoded({extended:true}));

app.use(sassMiddleWare({
    src:"/assets/scss",
    dest:"/assets/css",
    debug:true,
    outputStyle:'expanded',
    prefix:'/css'
}));




//set up the  view engine
app.set('view engine' ,'ejs');
app.set('views','./views');
app.set('layout','layout');

//extract styles and script from sub pages into layouts

app.set('layout extractStyles' ,true);
app.set('layout extractScripts' ,true);

app.use(session({
    name:'PlacementCell',
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:1000*60*100
    },
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://ayushsingh4045:DeXlSENxzhapXyO8@cluster0.ji0rway.mongodb.net/PlacementCell?retryWrites=true&w=majority",
         autoRemove:'disabled', 
    }),

}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//use express Router

app.use(flash());
app.use(customWare.setFlash);
app.use('/',require('./routes'));

app.listen(port, (err)=>{

    if(err)
    {
        console.log('error in starting express server')
    }
    else
    {
        console.log('server is running at port:',port);
    }
});

