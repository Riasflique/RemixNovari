const API_URL = process.env.API_URL;

class MeApi {
    static async fetchDisplayName() {

        return {
            "fullName": "Add An API"
        };


        // const response = await fetch(`${API_URL}/api/me`);
        //     if (response.ok) {
        //         const data = await response.json();
        //         return data;
        //     } else {
        //         // Handle error response
        //         console.error("Error fetching display name");
        //         throw new Error("Error fetching display name");
        //     }

    }
}

export default MeApi;