import { SetStateAction, useState } from "react";
import "./style.css";


export type OrgType = {
    orgName: string;
    AssetId: string;
  };
  
  const orgData: OrgType[] = [
    { orgName: "Alliance to Restore the Republic", AssetId: "Rebel.Alliance" },
    { orgName: "Bespin Gas Mining", AssetId: "Cloud.city" },
    { orgName: "Corellia Shipyards", AssetId: "Corellia.shipyards" },
    { orgName: "Imperial Forces", AssetId: "Galactic.empire" },
    { orgName: "Jedi Archives", AssetId: "jedi.order" },
  ];

  export default function OrganizationTable() {
    const [organizations, setOrganizations] = useState(orgData);
    const [searchItem, setSearchItem] = useState ('');

    const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchItem(e.target.value);
  };


  const filteredOrgs = organizations.filter(organizations =>
    organizations.orgName.toLowerCase().includes(searchItem.toLowerCase()) || 
    organizations.AssetId.toLowerCase().includes(searchItem.toLowerCase()),
    
    );
    return(
  <div className="divOrgTable">
    <h1>Organizations</h1>
          <button onClick={() => {/* legg til ny org */}}>Add New</button>
          <input
            type="text"
            placeholder="Søk"
            className="inputOrgs"
            value={searchItem}
            onChange={handleSearchChange}/>
          <table className="tableOrgs">
            <thead className="tHeadOrgsTableHeader">
              <tr>
                <th>Name</th>
                <th>Asset Id</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrgs.map((org, index) => (
                <tr key={index}>
                  <td>{org.orgName}</td>
                  <td>{org.AssetId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 )}
  
  export {orgData};