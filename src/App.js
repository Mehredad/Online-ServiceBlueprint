import React, { useState, useEffect } from "react";
import SignupLogin from './pages/SignupLogin';
import axios from 'axios';

const App = () => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State to store the error message
  const [errorMessage, setErrorMessage] = useState("");

  // State to store the blueprint data
  const [blueprint, setBlueprint] = useState({
    lanes: [
      { id: 'lane1', name: 'Customer Actions', columns: [{ id: 'col1', steps: [] }] }
    ]
  });

  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedStep, setSelectedStep] = useState(null);

  // Check if the user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  // Handle Signup
  const handleSignup = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token); // Store JWT token
      setIsLoggedIn(true); // Set user as logged in
      setErrorMessage(""); // Clear error message
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  // Handle Login
  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token); // Store JWT token
      setIsLoggedIn(true); // Set user as logged in
      setErrorMessage(""); // Clear error message
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Invalid credentials.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token
    setIsLoggedIn(false); // Set user as logged out
  };

  // Handle adding a new lane
  const addLane = () => {
    setBlueprint(prev => ({
      ...prev,
      lanes: [
        ...prev.lanes,
        {
          id: `lane-${Date.now()}`,
          name: 'New Lane',
          columns: [{ id: `col-${Date.now()}`, steps: [] }]
        }
      ]
    }));
  };

  // Handle adding a new column to a lane
  const addColumn = (laneId) => {
    setBlueprint(prev => {
      const newBlueprint = { ...prev };
      const lane = newBlueprint.lanes.find(l => l.id === laneId);
      if (lane) {
        const currentColumns = lane.columns || [];
        if (currentColumns.every(col => col.id !== `col-${Date.now()}`)) {
          lane.columns.push({ id: `col-${Date.now()}`, steps: [] });
        }
      }
      return newBlueprint;
    });
  };

  // Handle adding a new step to a column
  const addStep = (laneId, columnId) => {
    setBlueprint(prev => {
      const newBlueprint = { ...prev };
      const lane = newBlueprint.lanes.find(l => l.id === laneId);
      if (lane) {
        const column = lane.columns.find(c => c.id === columnId);
        if (column) {
          const currentSteps = column.steps || [];
          if (currentSteps.every(step => step.content.trim() !== '')) {
            column.steps.push({
              id: `step-${Date.now()}`,
              content: '',
              suggestions: []
            });
          }
        }
      }
      return newBlueprint;
    });
  };

  // Handle deleting a step
  const deleteStep = (laneId, columnId, stepId) => {
    setBlueprint(prev => {
      const newBlueprint = { ...prev };
      const lane = newBlueprint.lanes.find(l => l.id === laneId);
      if (lane) {
        const column = lane.columns.find(c => c.id === columnId);
        if (column) {
          column.steps = column.steps.filter(s => s.id !== stepId);
        }
      }
      return newBlueprint;
    });
  };

  // Handle deleting a column
  const deleteColumn = (laneId, columnId) => {
    setBlueprint(prev => {
      const newBlueprint = { ...prev };
      const lane = newBlueprint.lanes.find(l => l.id === laneId);
      if (lane && lane.columns.length > 1) {
        lane.columns = lane.columns.filter(c => c.id !== columnId);
      }
      return newBlueprint;
    });
  };

  // Handle deleting a lane
  const deleteLane = (laneId) => {
    setBlueprint(prev => ({
      ...prev,
      lanes: prev.lanes.filter(l => l.id !== laneId)
    }));
  };

  // Update step content
  const updateStep = (laneId, columnId, stepId, content) => {
    setBlueprint(prev => {
      const newBlueprint = { ...prev };
      const lane = newBlueprint.lanes.find(l => l.id === laneId);
      if (lane) {
        const column = lane.columns.find(c => c.id === columnId);
        if (column) {
          const step = column.steps.find(s => s.id === stepId);
          if (step) {
            step.content = content;
          }
        }
      }
      return newBlueprint;
    });
  };

  // Update lane name
  const updateLaneName = (laneId, name) => {
    setBlueprint(prev => {
      const newBlueprint = { ...prev };
      const lane = newBlueprint.lanes.find(l => l.id === laneId);
      if (lane) {
        lane.name = name;
      }
      return newBlueprint;
    });
  };

  // AI suggestion for chat (mock function)
  const getAISuggestions = async (message) => {
    return ["Improve customer touchpoint", "Add digital channel", "Optimize waiting time"];
  };

  // Handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessage = { role: 'user', content: currentMessage };
    setChatMessages(prev => [...prev, newMessage]);

    const suggestions = await getAISuggestions(currentMessage);
    const aiResponse = {
      role: 'assistant',
      content: 'Here are some suggestions for improving your service blueprint:',
      suggestions
    };

    setChatMessages(prev => [...prev, aiResponse]);
    setCurrentMessage('');
  };

  return (
    <>
      {!isLoggedIn ? (
        <SignupLogin onLogin={handleLogin} onSignup={handleSignup} errorMessage={errorMessage} />
      ) : (
        <div className="flex flex-col h-screen max-h-screen bg-gray-50">
          <div className="flex-1 overflow-auto p-4">
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={addLane}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Add Lane
              </button>
            </div>

            {blueprint.lanes.map(lane => (
              <div key={lane.id} className="mb-4 bg-white rounded-lg shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      value={lane.name}
                      onChange={(e) => updateLaneName(lane.id, e.target.value)}
                      className="w-48 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
                        onClick={() => addColumn(lane.id)}
                      >
                        Add Column
                      </button>
                      {blueprint.lanes.length > 1 && (
                        <button
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          onClick={() => deleteLane(lane.id)}
                        >
                          Delete Lane
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto">
                    {lane.columns.map(column => (
                      <div key={column.id} className="min-w-[220px]">
                        <div className="flex justify-between mb-2">
                          <button
                            className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
                            onClick={() => addStep(lane.id, column.id)}
                          >
                            Add Step
                          </button>
                          {lane.columns.length > 1 && (
                            <button
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              onClick={() => deleteColumn(lane.id, column.id)}
                            >
                              Delete Column
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {column.steps.map(step => (
                            <div
                              key={step.id}
                              className="relative border rounded p-2 hover:border-blue-500"
                            >
                              <button
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                                onClick={() => deleteStep(lane.id, column.id, step.id)}
                              >
                                X
                              </button>
                              <textarea
                                placeholder="Enter step details..."
                                value={step.content}
                                onChange={(e) => updateStep(lane.id, column.id, step.id, e.target.value)}
                                className="w-full min-h-[100px] mt-2 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Interface */}
          <div className="border-t bg-white p-4">
            <div className="mb-4 max-h-40 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.role === 'assistant' ? 'text-blue-600' : ''}`}>
                  <p>{msg.content}</p>
                  {msg.suggestions && (
                    <div className="flex gap-2 mt-2">
                      {msg.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask for suggestions..."
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </form> */}
          </div>

          <button
            onClick={handleLogout}
            className="logoutbtn fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"

          >
            Logout
          </button>

        </div>
      )}
    </>
  );
};

export default App;
