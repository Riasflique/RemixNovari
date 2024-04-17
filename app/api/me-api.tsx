import { method } from "node_modules/cypress/types/bluebird";

const API_URL = process.env.API_URL;
// Gutta - bruker
// Gutta123 - passord

const baseURL = "http://localhost:8080/ansatte";

class MeApi {
    static getUserInfo(): any {
      throw new Error("Method not implemented.");
    }
    static async fetchDisplayName() {
         const response = await fetch(`http://localhost:5432/resourceString/resource`);
             if (response.ok) {
                const data = await response.json();
                //Check if response is ok
                console.log(response); 
                return data;
             } else {
                 // Handle error response
                 console.error("Error fetching display name");
                 throw new Error("Error fetching display name");
           }
        
    }

    static test() {

        return "Hello world";
    }
}
export default MeApi;