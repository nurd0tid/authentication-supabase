import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Image } from 'react-bootstrap';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Users() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usersId, setUsersId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  // Function Show Data
  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles/read');

      if (response.status === 201) {
        setRoles(response.data);
      } else {
        toast.error('Features Group entry fetch failed');
      }
    } catch (error) {
      toast.error('Error fetching features group entry:', error);
    }
  };

  // Fetching Blogs
  useEffect(() => {
    fetchRoles();
  }, []);

  // Function Show Data
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/read');

      if (response.status === 201) {
        setData(response.data);
      } else {
        toast.error('Features entry fetch failed');
      }
    } catch (error) {
      toast.error('Error fetching users entry:', error);
    }
  };

  // Fetching Blogs
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function  Update
  const handleUpdateModal = (users) => {
    setUsersId(users.id)
    setRoleId(users.roles.id);
    setShowModalUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('/api/users/update', {
        roleId: roleId,
        id: usersId
      });

      if (response.status === 201) {
        toast.success('Features entry uppdated successfully');
        setShowModalUpdate(false);
        setUsersId('');
        setRoleId('');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Error updated features entry:', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='main-content'>
        <Table className='table table-responsive table-bordered table-striped'>
          <thead>
            <tr>
              <th>Name</th>
              <th className='text-center'>Email</th>
              <th className='text-center'>Roles</th>
              <th className='text-center'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((users, index) => (
                <tr key={index}>
                  <td>{users.name}</td>
                  <td className='text-center'>{users.email}</td>
                  <td className='text-center'>{users.roles.name}</td>
                  <td style={{ width: '120px'}} className='text-center'>
                    <span>
                      <Button className='me-2' onClick={() => handleUpdateModal(users)}>
                        <MdOutlineEdit/>
                      </Button>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  <Image src="/assets/notfound.png" alt="No Products" fluid width={350}/>
                  <p>No records available.</p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal untuk edit users */}
        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Users</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form.Label>Roles</Form.Label>
              <Form.Control
                type="text"
                as="select"
                placeholder="Roles"
                className='mb-2'
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option>-- Pilih Roles ---</option>
                {roles.map((roles, index) => (
                  <option key={index} value={roles.id}>{roles.name}</option>
                ))}
              </Form.Control>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalUpdate(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

Users.layout = 'MainLayout'
export default Users