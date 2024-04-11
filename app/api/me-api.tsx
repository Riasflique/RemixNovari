const API_URL = process.env.API_URL;
// Gutta - bruker
// Gutta123 - passord

class MeApi {
    static getUserInfo(): any {
        throw new Error("Method not implemented.");
    }

    static async fetchDisplayName() {
        const response = await fetch('http://localhost:8080/api/resource');
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

// Dette dukker opp i konsollen i IntelliJ en gang når npm run dev kjører
const detteSendes = { ressurs: "Fakturamottaker" } // denne hentes fra buttonclick??
// detteSendes kan skrives direkte i stringify
const toJava = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ detteSendes })
};
fetch('http://localhost:8080/api/resourceString', toJava)
  .then(response => {
    if (!response.ok) {
        throw new Error('Response ikke OK');
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
