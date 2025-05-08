import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import './Dashboard.css';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'; // Import axios
import { colors } from '@mui/material';

const Dashboard = () => {
  const navigate = useNavigate();

  // Define missing states
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const [notes, setNotes] = useState([]); // State to store notes
  const [metrics, setMetrics] = useState({}); // State to store dashboard metrics
  const [users, setUsers] = useState([]); // State to store users
  const [relatedTypes, setRelatedTypes] = useState([]); // State to store related types for notes
  const [newNote, setNewNote] = useState({
    subject: '',
    description: '',
    related_to_type: '',
    related_to_id: '',
    assigned_to: '',
  }); // State for the new note form
  const [editingNoteId, setEditingNoteId] = useState(null); // State to track the note being edited
  const [showNoteForm, setShowNoteForm] = useState(false); // State to toggle the note form

  // Existing states
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Add Axios interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Pass through successful responses
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or unauthorized
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('username');
          navigate('/login'); // Redirect to login page
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  useEffect(() => {
    // Check if the user is authenticated
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Redirect to login page if not authenticated
      navigate('/login');
    }
    // Check if user is admin
    const isAdminUser = localStorage.getItem('is_admin') === 'true';
    setIsAdmin(isAdminUser);
  }, [navigate]);

  useEffect(() => {
    // Fetch activity logs, tasks and dashboard metrics
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          navigate('/login'); // Redirect to login if no token is found
          return;
        }

        // Fetch activity logs
        const activityResponse = await axios.get('http://localhost:8000/api/activity-logs/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setActivities(activityResponse.data);

        // Fetch tasks
        const tasksResponse = await axios.get('http://localhost:8000/api/tasks/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTasks(tasksResponse.data);

        // Fetch notes
        const notesResponse = await axios.get('http://localhost:8000/api/notes/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotes(notesResponse.data);

        // Fetch users for assigning notes
        const usersResponse = await axios.get('http://localhost:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(usersResponse.data);

        // Fetch note choices
        const noteChoicesResponse = await axios.get('http://localhost:8000/api/note-choices/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRelatedTypes(noteChoicesResponse.data.related_to_type);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format timestamp
  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle note form input changes
  const handleNoteInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new note
  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const url = editingNoteId 
        ? `http://localhost:8000/api/note/${editingNoteId}/`
        : 'http://localhost:8000/api/notes/';
      
      const method = editingNoteId ? 'put' : 'post';
      
      const response = await axios({
        method,
        url,
        data: newNote,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Update notes list
      if (editingNoteId) {
        setNotes(notes.map(note => 
          note.id === editingNoteId ? response.data : note
        ));
        setEditingNoteId(null);
      } else {
        setNotes([response.data, ...notes]);
      }

      // Reset form
      setNewNote({
        subject: '',
        description: '',
        related_to_type: '',
        related_to_id: '',
        assigned_to: '',
      });
      setShowNoteForm(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Edit note
  const handleEditNote = (note) => {
    setNewNote({
      subject: note.subject,
      description: note.description,
      related_to_type: note.related_to_type || '',
      related_to_id: note.related_to_id || '',
      assigned_to: note.assigned_to,
    });
    setEditingNoteId(note.id);
    setShowNoteForm(true);
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:8000/api/note/${noteId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Update notes list
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className='dash_container'>
      <div className='dash-1'>
        <h1>Dashboard
        <button 
            onClick={async () => {
              try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                  navigate('/login'); // Redirect to login if no token is found
                  return;
                }

                // Send POST request to /logout
                await axios.post(
                  'http://localhost:8000/api/logout/',
                  {}, // Empty body
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                // Clear tokens from localStorage
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                // Redirect to login page
                navigate('/login');
              } catch (err) {
                console.error('Logout failed:', err.response?.data || err.message);
                // Optionally, handle logout failure (e.g., show an error message)
              }
            }}>
            Logout
        </button>
        </h1>
      </div>
      <div className='dash-2'>
        <div className='dash-2_1'>
          <div className='task_tab'>
            <h3>Tasks</h3>
            {loading ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p>No tasks available.</p>
            ) : (
              <table className='task_table'>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task.id}>
                      <td>
                        <Link to={`/task-details/${task.id}`} className='task_link'>
                          {task.subject}
                        </Link>
                      </td>
                      <td>{task.due_date}</td>
                      <td>{task.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className='customers'>
            <div>
              <h4>Customers</h4>
              <h1>{loading ? 'Loading...' : metrics.customer_count}</h1>
            </div>
            <div><span><PeopleAltIcon /></span></div>
          </div>
          <div className='deals'>
            <div>
              <h4>Deals</h4>
              <h1>{loading ? 'Loading...' : metrics.deal_count}</h1>
            </div>
            <div><span><BusinessCenterIcon /></span></div>
          </div>
        </div>
        <div className='dash-2_2'>
          {/* Only show leads section to admin users */}
          {isAdmin && (
            <div className='recent_deal_block'>
              <div className='recent_block1'>
                <h3>Recent Leads</h3>
                <Link to="/leads">
                  <p>View All</p>
                </Link>
              </div>
              <div className='recent_block2'>
                {loading ? (
                  <p>Loading recent leads...</p>
                ) : !metrics.recent_leads || metrics.recent_leads.length === 0 ? (
                  <p>No leads available.</p>
                ) : (
                  metrics.recent_leads.map((lead) => (
                    <div className='recent_deals_items' key={lead.id}>
                      <div className='re_de_item_1'>
                        <div>
                          <span className="lead-icon">L</span>
                        </div>
                        <div>
                          <h5>{`${lead.first_name} ${lead.last_name}`}</h5>
                          <p>{lead.email}</p>
                        </div>
                      </div>
                      <div className='re_de_item_2'>
                        <div>
                          <h5>{lead.status}</h5>
                          <p>{formatTimestamp(lead.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className='task_status_block'>
            <div className='task_status_header'>
              <h3>Tasks by Status</h3>
              <Link to="/tasks">
                <p>View All</p>
              </Link>
            </div>
            <div className='task_status_content'>
              {loading ? (
                <p>Loading tasks...</p>
              ) : (
                <div className='task_status_grid'>
                  {Object.entries(metrics.tasks_by_status || {}).map(([status, statusTasks]) => (
                    statusTasks.length > 0 && (
                      <div key={status} className='task_status_section'>
                        <h4>{status}</h4>
                        {statusTasks.map(task => (
                          <div key={task.id} className='task_item'>
                            <Link to={`/task-details/${task.id}`}>
                              <p className='task_title'>{task.subject}</p>
                              <div className='task_details'>
                                <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                <span>Due: {formatDate(task.due_date)}</span>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='dash-2_3'>
          <div>
            <h2>Activity Log</h2>
            {loading ? (
              <p>Loading...</p>
            ) : activities.length === 0 ? (
              <p>No activities to display.</p>
            ) : (
              <ul>
                {activities.map((activity, index) => (
                  <li key={index}>
                    {activity.action} at {formatTimestamp(activity.timestamp)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Notes Section */}
        <div className='notes-section'>
          <div className='notes-header'>
            <h2>Notes</h2>
            <button 
              className='add-note-btn' 
              onClick={() => {
                setEditingNoteId(null);
                setNewNote({
                  subject: '',
                  description: '',
                  related_to_type: '',
                  related_to_id: '',
                  assigned_to: '',
                });
                setShowNoteForm(!showNoteForm);
              }}
            >
              <NoteAddIcon /> {showNoteForm ? 'Cancel' : 'Add Note'}
            </button>
          </div>
          
          {showNoteForm && (
            <div className='note-form-container'>
              <form onSubmit={handleNoteSubmit} className='note-form'>
                <h3>{editingNoteId ? 'Edit Note' : 'Add New Note'}</h3>
                
                <div className='form-group'>
                  <label htmlFor='subject'>Subject</label>
                  <input
                    type='text'
                    id='subject'
                    name='subject'
                    value={newNote.subject}
                    onChange={handleNoteInputChange}
                    required
                  />
                </div>
                
                <div className='form-group'>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    id='description'
                    name='description'
                    value={newNote.description}
                    onChange={handleNoteInputChange}
                    rows='3'
                  />
                </div>
                
                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor='related_to_type'>Related To Type</label>
                    <select
                      id='related_to_type'
                      name='related_to_type'
                      value={newNote.related_to_type}
                      onChange={handleNoteInputChange}
                    >
                      <option value=''>None</option>
                      {relatedTypes.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {newNote.related_to_type && (
                    <div className='form-group'>
                      <label htmlFor='related_to_id'>Related To ID</label>
                      <input
                        type='number'
                        id='related_to_id'
                        name='related_to_id'
                        value={newNote.related_to_id}
                        onChange={handleNoteInputChange}
                      />
                    </div>
                  )}
                </div>
                
                <div className='form-group'>
                  <label htmlFor='assigned_to'>Assigned To</label>
                  <select
                    id='assigned_to'
                    name='assigned_to'
                    value={newNote.assigned_to}
                    onChange={handleNoteInputChange}
                    // required
                  >
                    <option value=''>Select a user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                  </select>
                </div>
                
                <div className='form-actions'>
                  <button type='submit' className='save-note-btn'>
                    {editingNoteId ? 'Update Note' : 'Save Note'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className='notes-list'>
            {loading ? (
              <p>Loading notes...</p>
            ) : notes.length === 0 ? (
              <p>No notes available.</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className='note-item'>
                  <div className='note-header'>
                    <h4>{note.subject}</h4>
                    <div className='note-actions'>
                      <button onClick={() => handleEditNote(note)} className='edit-btn'>
                        <EditIcon fontSize='small' />
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)} className='delete-btn'>
                        <DeleteIcon fontSize='small' />
                      </button>
                    </div>
                  </div>
                  <p className='note-description'>{note.description}</p>
                  <div className='note-meta'>
                    {note.related_to_type && note.related_to_id && (
                      <span>Related to: {note.related_to_type} #{note.related_to_id}</span>
                    )}
                    <span>Assigned to: {note.assigned_to_username}</span>
                    <span>Created: {formatTimestamp(note.created_at)}</span>
                    <span>By: {note.created_by_username}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;