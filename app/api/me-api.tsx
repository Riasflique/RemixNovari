const API_URL = process.env.API_URL;

class MeApi {
    static async fetchDisplayName() {

         const response = await fetch(`http://localhost:8080/ansatte`);
             if (response.ok) {
                 const data = await response.json();
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