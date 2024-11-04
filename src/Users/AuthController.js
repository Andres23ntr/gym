import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './UserForm';
import UserList from './UserList';

const AuthController = () => {
    const [users, setUsers] = useState([]); // Inicializa como un array vacío
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSave = async (id, userData) => {
        try {
            if (id) {
                // Update existing user
                await axios.put(`/api/users/${id}`, userData);
            } else {
                // Create new user
                await axios.post('/api/users', userData);
            }
            fetchUsers();
            setShowForm(false);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h1>User Management</h1>
            <button onClick={() => { setEditingUser(null); setShowForm(true); }}>
                Add User
            </button>
            {showForm && (
                <UserForm 
                    user={editingUser} 
                    onSave={handleSave} 
                    onCancel={() => setShowForm(false)} 
                />
            )}
            <UserList 
                users={users} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />
        </div>
    );
};

export default AuthController;
