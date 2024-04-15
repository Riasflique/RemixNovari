import { method } from "node_modules/cypress/types/bluebird";
import { SetStateAction, useState } from "react";
import { json } from "@remix-run/node";

//const APIURL = "http://localhost:8080/resource"
//const API_URL = process.env.APIURL;

class MeApi {

    static async fetchDisplayName() {

         const response = await fetch('http://localhost:8080/resource');
             if (response.ok) {
                 const data = await response.json();
                 //console.log(data);
                 const tab = {data}
                 //console.log(tab);
                return tab;
             } else {
                 // Handle error response
                 console.error("Error fetching display name");
                 throw new Error("Error fetching display name");
           }

    }

    static async test() {
        
        const fraApi = document.getElementById("test")?.innerText;
        let token = fetch("http://localhost:8080/api/resourceString", {
          headers: {
            'Content-Type': 'application/json',
            'Cors': ''
          },
          method: 'POST', 
          mode: 'no-cors',
          body: JSON.stringify({fraApi}) 
        });
      
        console.log(fraApi);
        //console.log(document.getElementById("test")?.innerText);
        MeApi.getResource()
      };

    static async getResource(){
      await fetch("http://localhost:8080/api/test", {
        method: 'GET',
       // mode: 'no-cors'
      })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            //console.log(response.json())
            return response.json();
        })
        .then(data => {
            console.log('Data received from server:', data);
        })
        .catch(error => console.error('Error getting data:', error));
    }

}
    
export default MeApi;