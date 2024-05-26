import * as rl from 'readline-sync';
import { Viking } from './interfaces';


// FETCH API
async function VikingsData(){
    try{
        const response = await fetch("https://raw.githubusercontent.com/wilson146600/Vikings.json/main/vikings.json");
        if(!response){
            throw new Error("Error kon API niet ophalen");
        }
        const vikingData = await response.json();
        return vikingData;
    }catch(error){
        console.log(error);
    }
};

// USING API
VikingsData()
    .then(data => {
        console.log("Welcome to the JSON data viewer!\n\n1. View all data\n2. Filter by ID\n3. Exit\n");
        const choice: string = rl.question("Please enter your choice: ");

        switch(choice) {
            case "1":
                data.forEach((value: Viking) => console.log(`- ${value.name}`));
                break;
            case "2":
                const id = parseInt(rl.question("Please enter the ID you want to filter by: "));
                for(let i = 0; i < data.length; i++) {
                    if(data[i].id === id) {
                        console.log(`- name: ${data[i].name}`);
                        console.log(`  - description: ${data[i].description}`);
                        console.log(`  - age: ${data[i].age}`);
                        console.log(`  - alive: ${data[i].alive}`);
                        console.log(`  - birthdate: ${data[i].birthdate}`);
                        console.log(`  - image: ${data[i].imageURL}`);
                        console.log(`  - weapon: ${data[i].weapon}`);
                        console.log(`  - family: ${data[i].family}`);
                        console.log(`  - clan: ${data[i].clan.name}`);
                        console.log(`    - name: ${data[i].clan.name}`);
                        console.log(`    - description: ${data[i].clan.description}`);
                        console.log(`    - active: ${data[i].clan.active}`);
                    }else if(id > data.length || id < 1) {
                        console.log("invalid Id");
                        break;
                    }
                }
                break;
            case "3":
                console.log("Exiting now...")
                break;
            default:
                console.log("Ongeldige keuze");
                break;
        };
    })
    .catch( error => {
        console.log(error);
    });

