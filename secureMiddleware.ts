import { NextFunction, Request, Response } from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction){
    if(req.session.user){
        res.locals.user = req.session.user;
        next();
    }else{
        res.redirect("/login");
    }
}

export function secureMiddlewareLogin(req: Request, res: Response, next: NextFunction){
    if(req.session.user){
        res.redirect("/")
        return;
    }else{
        res.redirect("/login");
    }
}

