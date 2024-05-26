import express from 'express';
import { Viking } from '../interfaces';
import { getVikings } from '../database';
import { updateViking } from '../database';
import { getVikingById } from '../database';
import { secureMiddleware } from '../secureMiddleware';

export function homeRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async(req, res) => {

        const data: Viking[] = await getVikings();
    
        const q:string = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
        const filteredData = data.filter(item => {
            return item.name.toLowerCase().includes(q)
        })
    
        const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
        const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "ascending";
    
        const sortedData = [...filteredData].sort((a, b) => {
            if(sortField === "name") {
                return sortDirection === "ascending" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if(sortField === "clan"){
                return sortDirection === "ascending" ? a.clan.name.localeCompare(b.clan.name) : b.clan.name.localeCompare(a.clan.name);
            } else if(sortField === "age"){
                return sortDirection === "ascending" ? a.age - b.age : b.age - a.age;
            } else if(sortField === "weapon"){
                return sortDirection === "ascending" ? a.weapon.localeCompare(b.weapon) : b.weapon.localeCompare(a.weapon);
            } else if (sortField === "alive"){
                return sortDirection === "ascending" ? (a.alive ? 1 : -1) : (b.alive ? 1 : -1);
            } else {
                return 0;
            }
        })
        res.render("home", {data: sortedData, q, sortField, sortDirection})
    });
    
    router.get("/vikings/:viking", secureMiddleware,  async(req, res) => {
        const data: Viking[] = await getVikings();
        let viking = req.params.viking;
        res.render("vikings", {viking, data});
    });
    
    router.get("/vikings/:id/edit", secureMiddleware,  async(req, res) => {
        const id = parseInt(req.params.id);
        const viking = await getVikingById(id);
        res.render("edit", {viking})
    })
    
    router.post("/vikings/:id/edit", secureMiddleware,  async(req, res) => {
        const id: number = parseInt(req.params.id);
        const viking: Viking = req.body;
        await updateViking(id, viking);
        res.redirect("/");
    })
    
    router.get("/clans", secureMiddleware, async(req, res) => {
        const data: Viking[] = await getVikings();
    
        let uniqueClans: Viking[] = [];
        data.forEach(item => {
            if(!uniqueClans.some(clan => clan.clan.name === item.clan.name)){
                uniqueClans.push(item);
            }
        })
    
        const q = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "" ;
        const filteredData = uniqueClans.filter(item => {
            return item.clan.name.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
        })
    
        const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
        const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "ascending";
    
        const sortedData = [...filteredData].sort((a, b) => {
            if(sortField === "name") {
                return sortDirection === "ascending" ? a.clan.name.localeCompare(b.clan.name) : b.clan.name.localeCompare(a.clan.name);
            } else if(sortField === "members"){
                return sortDirection === "ascending" ? a.clan.size - b.clan.size : b.clan.size - a.clan.size;
            } else if (sortField === "active"){
                return sortDirection === "ascending" ? (a.clan.active ? 1 : -1) : (b.clan.active ? 1 : -1);
            } else {
                return 0;
            }
        })
        res.render("clans", {data: sortedData, q, sortField, sortDirection})
    });
    
    router.get("/clan/:clan", secureMiddleware,  async(req, res) => {
        const data: Viking[] = await getVikings();
    
        let uniqueClans: Viking[] = [];
        data.forEach(item => {
            if(!uniqueClans.some(clan => clan.clan.name === item.clan.name)){
                uniqueClans.push(item);
            }
        })
    
        let clan = req.params.clan;
        res.render("clan", {clan, uniqueClans});
    })

    return router;
}