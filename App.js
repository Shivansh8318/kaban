import React, { useState, useEffect } from 'react';

function App() {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState(localStorage.getItem('groupingOption') || 'status');
  const [sortingOption, setSortingOption] = useState(localStorage.getItem('sortingOption') || 'priority');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    backgroundColor: '#D3D3D3',
    padding: '20px',
    borderRadius: '5px',
    margin: '20px auto',
  };

  const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
  };

  const selectStyle = {
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    margin: '10px',
  };

  const groupStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  };

  const groupHeaderStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginLeft: '20px',
  };

  const listStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    listStyleType: 'none',
    padding: 0,
  };

  const ticketStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    margin: '10px',
    width: '300px',
    textAlign: 'left',
  };

  const userIconStyle = {
    marginRight: '5px',
  };

  const groupTickets = () => {
    const groupedTickets = {
      'Urgent (Priority level 4)': [],
      'High (Priority level 3)': [],
      'Medium (Priority level 2)': [],
      'Low (Priority level 1)': [],
      'No priority (Priority level 0)': [],
    };

    tickets.forEach((ticket) => {
      const priority = ticket.priority;
      switch (priority) {
        case 4:
          groupedTickets['Urgent (Priority level 4)'].push(ticket);
          break;
        case 3:
          groupedTickets['High (Priority level 3)'].push(ticket);
          break;
        case 2:
          groupedTickets['Medium (Priority level 2)'].push(ticket);
          break;
        case 1:
          groupedTickets['Low (Priority level 1)'].push(ticket);
          break;
        default:
          groupedTickets['No priority (Priority level 0)'].push(ticket);
          break;
      }
    });

    if (groupingOption === 'user') {
      const userGroupedTickets = {};

      tickets.forEach((ticket) => {
        const user = ticket.assigned_to;
        if (!userGroupedTickets[user]) {
          userGroupedTickets[user] = [];
        }
        userGroupedTickets[user].push(ticket);
      });

      return userGroupedTickets;
    }

    return groupedTickets;
  };

  const sortTickets = (groupedTickets) => {
    for (const group in groupedTickets) {
      groupedTickets[group].sort((a, b) => {
        if (sortingOption === 'priority') {
          return b.priority - a.priority;
        } else if (sortingOption === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    }

    return groupedTickets;
  };

  const groupedAndSortedTickets = sortTickets(groupTickets());

  // Function to handle the change in grouping option
  const handleGroupingChange = (newGroupingOption) => {
    setGroupingOption(newGroupingOption);
    localStorage.setItem('groupingOption', newGroupingOption);
  };

  // Function to handle the change in sorting option
  const handleSortingChange = (newSortingOption) => {
    setSortingOption(newSortingOption);
    localStorage.setItem('sortingOption', newSortingOption);
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Kanban Board By Shivansh Agrawal</h1>
      <div style={groupStyle}>
        <div style={groupHeaderStyle}>Group by:</div>
        <select style={selectStyle} onChange={(e) => handleGroupingChange(e.target.value)}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>
        <div style={groupHeaderStyle}>Sort by:</div>
        <select style={selectStyle} onChange={(e) => handleSortingChange(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <ul style={listStyle}>
        {Object.keys(groupedAndSortedTickets).map((group, index) => (
          <li key={index}>
            <div style={ticketStyle}>
              <h2>{group}</h2>
              {groupedAndSortedTickets[group].map((ticket) => (
                <div key={ticket.id}>
                  <p>
                    <i className="fas fa-user" style={userIconStyle}></i>
                    {ticket.assigned_to}
                  </p>
                  
                  <p>Title: {ticket.title}</p>
                  <p>Priority: {ticket.priority}</p>
                  <p>Status: {ticket.status}</p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
