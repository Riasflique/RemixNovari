import { PersType } from "~/routes/person";

const baseURL = "http://localhost:8080";

class MeApi {
    static async updatePerson(updatedPerson: PersType) {
        try {
            const response = await fetch(`${baseURL}/api/updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPerson)
            });
            if (!response.ok) {
                throw new Error('Failed to update user. Network response was not ok.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("UpdatePerson error: ", error);
            throw error;
        }
    }

    static async fetchDisplayName() {
        try {
            const response = await fetch(`${baseURL}/api/resource`);
            if (response.ok) {
                const data = await response.json();
                return { data };
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
            await fetch(`${baseURL}/api/resourceString`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ c })
            });
            const resourceData = await MeApi.getResources();
            return resourceData;
        } catch (error) {
            console.error("PostComponent error: ", error);
            throw error;
        }
    }

    static async getResources() {
        try {
            const response = await fetch(`${baseURL}/api/getResources`, {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error('Failed to get resource. Network response was not ok.');
            }
            const data = await response.json();
            return MeApi.parseApiResponse(data.message);
        } catch (error) {
            console.error("GetResource error: ", error);
        }
    }

    static async postPackage(p: string) {
        try {
            await fetch(`${baseURL}/api/packageString`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ p })
            });
            const packageData = await MeApi.getPackages();
            return packageData;
        } catch (error) {
            console.error("PostPackage error: ", error);
            throw error;
        }
    }

    static async fetchUsers() {
        try {
            const response = await fetch(`${baseURL}/api/getUsers`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error("Error fetching users");
                return null;
            }
        } catch (error) {
            console.error("Error fetching users", error);
            return null;
        }
    }

    static async fetchOrgs() {
        try {
            const response = await fetch(`${baseURL}/api/getOrgs`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error("Error fetching organizations");
                return null;
            }
        } catch (error) {
            console.error("Error fetching organizations", error);
            return null;
        }
    }

    static async addUser(newUser: PersType) {
        try {
            const response = await fetch(`${baseURL}/api/setUsers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser)
            });
            if (!response.ok) {
                throw new Error('Failed to add user. Network response was not ok.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("AddUser error: ", error);
            throw error;
        }
    }

    static async getPackages() {
        try {
            const response = await fetch(`${baseURL}/api/getPackages`, {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error('Failed to get resource. Network response was not ok.');
            }
            const data = await response.json();
            return MeApi.parseApiResponse(data.message);
        } catch (error) {
            console.error("GetPackage error: ", error);
        }
    }

    static parseApiResponse(dataString: string) {
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

    static parseApiResponse2(dataString: string) {
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

    static parseApiResponse3(dataString: string) {
        const list: string[] = [];
        const trimBraces = dataString.match(/{(.*)}/)?.[1];
        if (trimBraces) {
            const items = trimBraces.split(', ');
            items.forEach(item => {
                const packageResource = item.replace("no.fint.model.", "").replace("=null", "")
                const words = packageResource.split('.');

                const combined = [];

                for (let i = 0; i < words.length; i += 2) {
                    combined.push(words[i] + (words[i + 1] ? `.${words[i + 1]}` : ""));
                }

                combined.forEach(word => {
                    list.push(word.trim().split('_').map(part => part.charAt(0) + part.slice(1)).join(' '));
                });
            });
        }
        return list;
    }
}

export default MeApi;
