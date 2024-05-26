import express from 'express';
import ejs from 'ejs';
// import * as data from './vikings.json';
import { Clan, User, Viking } from './interfaces';
import { client, getVikingById, getVikings, loadVikingsFromApi, login, updateViking } from './database';
import { connect } from './database';
import session from './session';
import { secureMiddleware } from './secureMiddleware';
import { loginRouter } from './routes/loginRouter';
import { homeRouter } from './routes/homeRouter';

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.static("public"));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended:true}));
app.use(session);
app.use(loginRouter());
app.use(homeRouter());


app.listen(app.get("port"), async() => {
    try{
        //client.db("excercises").collection("users").deleteMany();
        await connect();
        //client.db("excercises").collection("vikings").deleteMany();
        await loadVikingsFromApi();
        console.log(`Server is running on port ${app.get("port")}`);
    }catch(error){
        console.log(error);
    }
});