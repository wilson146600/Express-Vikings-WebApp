import { MongoClient, Collection } from "mongodb";
import dotenv from "dotenv";
import { Viking, User } from "./interfaces";
import bcrypt from "bcrypt";
dotenv.config();


export const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
export const vikingsCollection: Collection<Viking> = client.db("excercises").collection<Viking>("vikings");
export const userCollection: Collection<User> = client.db("excercises").collection<User>("users");
export const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";

const saltRounds : number = 10;

async function createInitialTwoUsers(){
    try{
        if(await userCollection.countDocuments() >= 2){
            return;
        }

        const adminUsername : string | undefined = process.env.ADMIN_USERNAME;
        const adminPassword : string | undefined = process.env.ADMIN_PASSWORD;

        const userUsername : string | undefined = process.env.USER_USERNAME;
        const userPassword : string | undefined = process.env.USER_PASSWORD;

        if(adminUsername === undefined || adminPassword === undefined || userUsername === undefined || userPassword === undefined){
            throw new Error("user and admin password and username need to be set in enviroment");
        };
     
        const initialTwoUsers: User[] = [
            {
                username: adminUsername,
                password: await bcrypt.hash(adminPassword, saltRounds),
                role: "ADMIN"
            },
            {
                username: userUsername,
                password: await bcrypt.hash(userPassword, saltRounds),
                role: "USER"
            },
        ];

        await userCollection.insertMany(initialTwoUsers);
        console.log("initial two users made!")
    }catch(e){
        console.log(e);
    }
}

export async function register(username: string, password: string){
    try{
        const userUsername = username;
        const userPassword = password;

        if(userUsername === undefined || userPassword === undefined){
            throw new Error("user and admin password and username need to be set in enviroment");
        };
     
        const user: User = {
            username: userUsername,
            password: await bcrypt.hash(userPassword, saltRounds),
            role: "USER"
        }

        await userCollection.insertOne(user);
        console.log("user made!")
        return user;
    }catch(e){
        console.log(e);
    }
}

export async function login(username: string, password: string){
    if(username === "" || password === ""){
        throw new Error("Email and password required");
    }
    const user: User | null = await userCollection.findOne({username: username});
    if(user){
        if(await bcrypt.compare(password, user.password!)){
            return user;
        }else{
            throw new Error("Password incorrect");
        }
    }else{
        throw new Error("User not found");
    }
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        console.log("Connected to database");
        await createInitialTwoUsers();
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}

export async function getVikings(){
    return await vikingsCollection.find({}).toArray();
}

export async function getVikingById(id: number){
    return await vikingsCollection.findOne({id: id});
}

export async function updateViking(id: number, viking: Viking){
    return await vikingsCollection.updateOne({id: id},{ $set: viking});
}

export async function loadVikingsFromApi(){
    try{
        let vikings: Viking[] = await getVikings();
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-wilson146600/main/vikings.json?token=GHSAT0AAAAAACNZZNLG6CJJR7NZLDM3L7IKZRLW43A");
        if(response.ok){
            if(vikings.length == 0){
                vikings = await response.json();
                await vikingsCollection.insertMany(vikings);
                console.log("database is empty... populating now");
            }else{
                console.log("database is populated");
            }
        }else{
            if(vikings.length == 0){
                console.log("failed to fetch data from api: renew key in raw json file - database is empty")
            }else{
                console.log("failed to fetch data from api: renew key in raw json file - database is populated");
            }
        }
    }catch(error){
        console.log(error);
    }
}