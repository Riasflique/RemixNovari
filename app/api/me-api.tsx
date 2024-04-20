import { method } from "node_modules/cypress/types/bluebird";
import { SetStateAction, useState } from "react";
import { json } from "@remix-run/node";

// const APIURL = "http://localhost:8080/resource"
// const API_URL = process.env.APIURL;

const baseURL = "http://localhost:8080/ansatte";

class MeApi {
    static updatePerson(updatedPerson: any) {
        throw new Error("Method not implemented.");
    }


    static async fetchDisplayName() {
        try {
            const response = await fetch("http://localhost:8080/api/resource");
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                const tab = { data }
                // console.log(tab);
                return tab;
            } else {
                throw new Error("Failed to fetch display name. Response status: " + response.status);
            }
        } catch (error) {
            console.error("Error fetching display name: ", error);
            throw error;
        }
    }

    static async postComponent(c: string) {
        try {
            const fraApi = document.getElementById("component")?.innerText;
            await fetch("http://localhost:8080/api/resourceString", {
                headers: {
                    'Content-Type': 'application/json',
                    'Cors': ''
                },
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ c })
            });
            console.log(fraApi);
            const resourceData = MeApi.getComponents();
            return resourceData;
        } catch (error) {
            console.error("PostComponent error: ", error);
            throw error;
        }
    };

    static async getComponents() {
        try {
            const response = await fetch("http://localhost:8080/api/getComponents", {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error('Failed to get resource. Network response was not ok.');
            }
            const data = await response.json();
            return this.parseApiResponse(data.message);
        } catch (error) {
            console.error("GetResource error: ", error);
        }
    }

    static async parseApiResponse(dataString: string) {
        const obj: { [key: string]: boolean } = {};             // Nytt objekt der key er en String og value er boolean (ressurs-hashmappet fra backend)
        const trimBraces = dataString.match(/{(.*)}/)?.[1];     // Får tak i data mellom {} 
        if (trimBraces) {                                       // Hvis det er noe data der (hvis trimbraces ikke er null)
            const keyValuePairs = trimBraces.split(', ');       // splittes teksten på komma mellomrom (slik dataen er oppdelt i backend)
            keyValuePairs.forEach(pair => {                     // For hvert par splittes de på '=' slik at ressurs blir key og boolsk verdi blir value
                const [key, value] = pair.split('=');
                obj[key.trim()] = value.trim() === 'true';      // kobler key/value par til obj
            });
        }
        return obj;
    }

    static async parseApiResponse2(dataString: string) {
        const list: string[] = [];
        const trimBraces = dataString.match(/{(.*)}/)?.[1];
        if (trimBraces) {
            const items = trimBraces.split(', ');
            items.forEach(item => {
                list.push(item.trim());
            });
        }
        return list;
    }

    static async parseApiResponse3(dataString: string) {
        const list: string[] = [];
        const trimBraces = dataString.match(/{(.*)}/)?.[1];
        if (trimBraces) {
            const items = trimBraces.split(', ');
            items.forEach(item => {
                const packageResource = item.replace("no.fint.model.", "")
                const words = packageResource.split('.');
                words.forEach(word => {
                    list.push(word.trim().split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '));
                });
            });
        }
        return list;
    }


}

export default MeApi;