import express from 'express';
import { secureMiddleware, secureMiddlewareLogin } from '../secureMiddleware';
import { User } from '../interfaces';
import { login } from '../database';
import { register } from '../database';

export function loginRouter(){
    const router = express.Router();

    router.get("/login", secureMiddlewareLogin, async(req, res) => {
        res.render("login");
    });
    
    router.post("/login", async(req, res) => {
        const username: string = req.body.username;
        const password: string = req.body.password;
    
        try{
            const user: User = await login(username, password);
            delete user.password;
            req.session.user = user;
            res.redirect("/")
    
        }catch(e){
            console.log(e);
            res.redirect("login");
        }
        
    });
    
    router.get("/register", secureMiddlewareLogin, async(req, res) => {
        res.render("register");
    });

    router.post("/register", async(req, res) => {
        const  { username, password } = req.body;
        const registeredUser: any = register(username, password);
        req.session.user = registeredUser;
        res.redirect("/");
    });

    router.get("/logout", secureMiddleware /*maybe delete*/, async(req, res) => {
        req.session.destroy(() => {
            res.redirect("login");
        });
    });

    return router;
}