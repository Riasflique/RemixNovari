import {useEffect } from "react";

const API_URL = process.env.API_URL;
// Gutta - bruker
// Gutta123 - passord

class MeApi {
    static getUserInfo(): any {
        throw new Error("Method not implemented.");
    }

    static async fetchDisplayName() {
        const response = await fetch('http://localhost:8080/resource');
        if (response.ok) {
            //console.log(response);
            const data = await response.json();
            console.log(data)
            return data;
        } else {
            // Handle error response
            console.error("Error fetching display name");
            throw new Error("Error fetching display name");
        }

    }

}
export default MeApi;