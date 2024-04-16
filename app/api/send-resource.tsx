import {useEffect } from "react";


console.log("test 0 utsfor alt")
const Kjartan = () => {
    useEffect(() => {
        console.log("test 2 innafor useEffect")
        // Dette dukker opp i konsollen i IntelliJ en gang når npm run dev kjører
        const detteSendes = { ressurs: document.getElementById('ja')?.textContent } // denne hentes fra buttonclick??
        //console.log(detteSendes + " WHAAAAAAAT")
       // Dette dukker opp i konsollen i IntelliJ en gang når npm run dev kjører
    const detteSendes2 = { ressurs: "Fakturamottaker" } // denne hentes fra buttonclick??
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
    }, [])
    return null
}
export default Kjartan;