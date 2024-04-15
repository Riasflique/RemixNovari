import { method } from "node_modules/cypress/types/bluebird";
import { SetStateAction, useState } from "react";
import { json } from "@remix-run/node";

// const APIURL = "http://localhost:8080/resource"
// const API_URL = process.env.APIURL;

class MeApi {

    static async fetchDisplayName() {
        try {
            const response = await fetch('http://localhost:8080/resource');
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                const tab = {data}
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
            let token = await fetch("http://localhost:8080/api/resourceString", {
                headers: {
                    'Content-Type': 'application/json',
                    'Cors': ''
                },
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ fraApi })
            });

            console.log(fraApi);
            MeApi.getResource();
        } catch (error) {
            console.error("Error during 'test' function execution: ", error);
            // Handle or log the error appropriately
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
            console.log('Data received from server:', data);
        } catch (error) {
            console.error('Error getting data:', error);
        }
    }

}

export default MeApi;