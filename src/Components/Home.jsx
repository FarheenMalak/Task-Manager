import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MdEditSquare, MdHome, MdLogin, MdPersonAdd } from "react-icons/md";
import { ImBin2 } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { IoMdAddCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

const Home = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState({ title: '', description: '', priority: 'Medium' });
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (!user) {
      Swal.fire("Error", "You must be logged in to add a task", "error");
      return;
    }

    if (!newTask.title.trim()) {
      Swal.fire("Error", "Please enter a task title", "error");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: 'open',
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewTask({ title: '', description: '', priority: 'Medium' });
      setShowAddTaskForm(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'completed' : 'open';
    try {
      await updateDoc(doc(db, "tasks", taskId), { status: newStatus });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const editTask = async () => {
    if (!taskToEdit.title.trim()) {
      Swal.fire("Error", "Please enter a task title", "error");
      return;
    }

    try {
      await updateDoc(doc(db, "tasks", editingTask.id), {
        title: taskToEdit.title,
        description: taskToEdit.description,
        priority: taskToEdit.priority,
      });
      setEditingTask(null);
      setTaskToEdit({ title: '', description: '', priority: 'Medium' });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const totalTasks = tasks.length;
  const openTasks = tasks.filter(task => task.status === 'open').length;
  const completedTasks = totalTasks - openTasks;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gradient-to-l from-blue-200 via-blue-100 p-6 flex flex-col justify-between shadow-lg block">
        <div>
          <h2 className="text-2xl font-bold text-[#5f067a] mb-10">Task Manger</h2>
          <nav className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center gap-3 text-gray-700 hover:text-[#5f067a] font-medium">
              <MdHome className="text-xl" /> Home
            </Link>
            <Link to="/login" className="flex items-center gap-3 text-gray-700 hover:text-[#5f067a] font-medium">
              <MdLogin className="text-xl" /> Login
            </Link>
            <Link to="/signup" className="flex items-center gap-3 text-gray-700 hover:text-[#5f067a] font-medium">
              <MdPersonAdd className="text-xl" /> Signup
            </Link>
          </nav>
        </div>
        <p className="text-xs text-gray-400">&copy; 2025 MyApp</p>
      </div>

      {/* Main Content */}
      <div className="flex-col md:flex-row flex-1 flex gap-4 p-6">

        {/* Main Area */}
        <div className="h-screen bg-white rounded-lg shadow-md p-6 flex-1 overflow-auto">

          {/* Task List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tasks.map(task => (
              <div key={task.id} className="p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority}
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={() => toggleTaskStatus(task.id, task.status)}>
                      <TiTick className={`text-xl ${task.status === 'open' ? 'text-yellow-500' : 'text-green-500'}`} />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="text-red-500">
                      <ImBin2 />
                    </button>
                    <button 
                      onClick={() => {
                        setEditingTask(task);
                        setTaskToEdit({ title: task.title, description: task.description, priority: task.priority });
                      }}
                      className="text-blue-500"
                    >
                      <MdEditSquare />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pt-5">
            <div className="bg-gradient-to-r from-pink-200 via-rose-100 to-orange-100 p-3 rounded-lg text-center">
              <p className="text-sm text-black">Total Tasks</p>
              <p className="text-xl font-bold">{totalTasks}</p>
            </div>
            <div className="bg-gradient-to-r from-[#3daece] to-blue-200 border-blue-300 border-blue-500 p-3 rounded-lg text-center">
              <p className="text-sm text-black">Open Tasks</p>
              <p className="text-xl font-bold">{openTasks}</p>
            </div>
            <div className="bg-gradient-to-r from-pink-200 via-rose-100 p-3 rounded-lg text-center">
              <p className="text-sm text-black">Completed</p>
              <p className="text-xl font-bold">{completedTasks}</p>
            </div>
          </div>

          {/* Edit Task Form */}
          {editingTask && (
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h2 className="font-semibold mb-3">Edit Task</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Task title"
                  className="w-full p-2 border rounded"
                  value={taskToEdit.title}
                  onChange={(e) => setTaskToEdit({ ...taskToEdit, title: e.target.value })}
                />
                <textarea
                  placeholder="Task description"
                  className="w-full p-2 border rounded"
                  rows="2"
                  value={taskToEdit.description}
                  onChange={(e) => setTaskToEdit({ ...taskToEdit, description: e.target.value })}
                />
                <div className="flex space-x-2">
                  {['Low', 'Medium', 'High'].map(priority => (
                    <button
                      key={priority}
                      className={`px-3 py-1 rounded ${taskToEdit.priority === priority ? 
                        (priority === 'High' ? 'bg-red-500 text-white' : 
                         priority === 'Medium' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white') :
                        'bg-gray-200'}`}
                      onClick={() => setTaskToEdit({ ...taskToEdit, priority })}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
                <button
                  onClick={editTask}
                  className="w-full bg-gradient-to-r from-[#3daece] to-blue-100 text-white py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Button to Show Add Task Form */}
          <div className="flex justify-between items-center p-5 mb-4 shadow-sm bg-rose-100 h-20">
            <h1 className='text-left text-gray-600 text-xl'>Add Task</h1>
            <button
              onClick={() => setShowAddTaskForm(!showAddTaskForm)}
              className="text-gray-600 text-3xl px-4 py-2 rounded-md hover:text-gray-700"
            >
              {showAddTaskForm ? <IoMdCloseCircle /> : <IoMdAddCircle />}
            </button>
          </div>

          {/* Add Task Form */}
          {showAddTaskForm && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Add a New Task</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <textarea
                  placeholder="Enter task description"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <div className="flex gap-3">
                  {['Low', 'Medium', 'High'].map(priority => (
                    <button
                      key={priority}
                      className={`px-4 py-2 rounded-lg text-white ${newTask.priority === priority
                        ? (priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500')
                        : 'bg-gray-400'
                      }`}
                      onClick={() => setNewTask({ ...newTask, priority })}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
                <button
                  onClick={addTask}
                  className="w-full bg-gradient-to-r from-[#3daece] to-blue-200 text-white py-3 rounded-lg hover:bg-green-700"
                >
                  Add Task
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-center">
          <div className="text-left flex flex-col justify-evenly">
            <div>
              <p className="text-4xl font-bold text-black">Hello,</p>
              <p className="text-sm text-gray-600">{user?.email || 'User'}</p>
            </div>
            <img className="w-60 h-50" src="side-bar-img.gif" alt="sidebar-img" />
            <button 
              onClick={handleLogout}
              className="text-sm text-white hover:underline bg-red-800 p-2 rounded-sm"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
