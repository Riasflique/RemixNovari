import { SetStateAction, useState } from "react";
import "./style.css";


export type PersType = {
    fname: string;
    lname: string;
    email: string;
    phone: string;
  };
  
  const persData: PersType[] = [
    {fname: 'Luke', lname: 'Skywalker', email: 'luke.skywalker@rebelalliance.com', phone: '99440055'},
    {fname: 'Leia', lname: 'Skywalker', email: 'leia.skywalker@rebelalliance.com', phone: '99550066'},
    {fname: 'Thomas', lname: 'Kirkeng', email: 'thomas.kirkeng@darkside.com', phone: '40493581'},
    {fname: 'Andris', lname: 'Hoiseth', email: 'andris.hoiseth@chebacca.com', phone: '33994455'}
  ]

  export default function PersonsTable() {
    const [persons, setPersons] = useState(persData);
    const [searchItem, setSearchItem] = useState ('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingPerson, setIsEditingPerson] = useState<PersType |null>(null);

    const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchItem(e.target.value);
  };

  const editPopupWindow = (person: PersType) => {
    setIsEditingPerson(person);
    setIsEditing(true)
  }


  const filteredPers = persons.filter(persons =>
    persons.fname.toLowerCase().includes(searchItem.toLowerCase()) || 
    persons.lname.toLowerCase().includes(searchItem.toLowerCase()),
    
    );
    return(
  <div className="divOrgTable">
    <h1>Persons</h1>
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
                <th>Email</th>
                <th>Phone</th>
                <th>Technical</th>
              </tr>
            </thead>
            <tbody>
              {filteredPers.map((person, index) => (
                <tr key={index}>
                  <td>{`${person.fname} ${person.lname}`}</td>
                  <td>{person.email}</td>
                  <td>{person.phone}</td>
                  <td><button onClick={() => editPopupWindow(person)}>Rediger</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 )}
  
  export {persData};