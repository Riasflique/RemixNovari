const API_URL = process.env.API_URL;
// Gutta - bruker
// Gutta123 - passord

class MeApi {
    static getUserInfo(): any {
      throw new Error("Method not implemented.");
    }
    
    static async fetchDisplayName() {
         const response = await fetch(`http://localhost:8080/resource`);
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
    
/* EKSEMPEL
    const sendStringToJava = async (str) => {
        const response = await fetch('http://localhost:8080/testString', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ string: str })
        });
        const data = await response.json();
        console.log(data); // Assuming Java backend sends a response in JSON format
      };
      
      // Example usage:
      sendStringToJava('Hello from Remix!');
      */
}
export default MeApi;