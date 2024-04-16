import { method } from "node_modules/cypress/types/bluebird";
import { SetStateAction, useState } from "react";
import { json } from "@remix-run/node";

// const APIURL = "http://localhost:8080/resource"
// const API_URL = process.env.APIURL;
import { method } from "node_modules/cypress/types/bluebird";
import { SetStateAction, useState } from "react";
import { json } from "@remix-run/node";

// const APIURL = "http://localhost:8080/resource"
// const API_URL = process.env.APIURL;

class MeApi {
    static updatePerson(updatedPerson: any) {
        throw new Error("Method not implemented.");
    static updatePerson(updatedPerson: any) {
        throw new Error("Method not implemented.");
    }


    static async fetchDisplayName() {
        try {
            const response = await fetch('http://localhost:8080/resource');
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                const tab = { data }
                // console.log(tab);
                return tab;
            } else {
                // Handle non-successful response
                throw new Error("Failed to fetch display name. Response status: " + response.status);
            }
        } catch (error) {
            console.error("Error fetching display name: ", error);
            throw error; // Optionally re-throw the error if you want calling code to handle it
        }
    }

    static async test() {
        try {

            const fraApi = document.getElementById("test")?.innerText;
            await fetch("http://localhost:8080/api/resourceString", {
                headers: {
                    'Content-Type': 'application/json',
                    'Cors': ''
                },
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ fraApi })
            });
            console.log(fraApi);
            const resourceData = MeApi.getResource();
            return resourceData;
        } catch (error) {
            console.error("Error during 'test' function execution: ", error);
            throw error;
        }
    };

    static async getResource() {
        try {
            const response = await fetch("http://localhost:8080/api/test", {
                method: 'GET'
                // mode: 'no-cors' // Uncomment if needed
            });
            if (!response.ok) {
                throw new Error('Failed to get resource. Network response was not ok.');
            }
            const data = await response.json();
            return this.parseApiResponse(data.message);
        } catch (error) {
            console.error('Error getting data:', error);
        }
    }

    static async parseApiResponse(dataString: string) {
        const obj: { [key: string]: boolean } = {};
        const trimBraces = dataString.match(/{(.*)}/)?.[1];
        if (trimBraces) {
            const keyValuePairs = trimBraces.split(', ');
            keyValuePairs.forEach(pair => {
                const [key, value] = pair.split('=');
                obj[key.trim()] = value.trim() === 'true';
            });
        }
        return obj;
    }

}

export default MeApi;