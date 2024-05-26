enum Weapon {
    TwinDaggers = "Twin Daggers",
    Sword = "Zwaard",
    GreatAxe = "Groot Bijl",
    Spear = "Speer",
    None = "Geen",
    Dagger = "Dolk"
};

export interface Viking {
    "id": number;
    "name": string;
    "description": string;
    "age": number;
    "alive": boolean;
    "birthdate": Date;
    "imageURL": string;
    "weapon": Weapon;
    "family": string[];
    "clan": Clan
};

export interface Clan{
    "id": number,
    "name": string,
    "description": string,
    "size": number,
    "active": boolean
};

export interface User{
    username: string;
    password?: string;
    role: string;
}