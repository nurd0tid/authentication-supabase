import React, { useState, useEffect } from 'react';
import Seo from '@/shared/layout-components/seo/seo';
import PageHeader from '@/shared/layout-components/pageheader/pageHeader';
import axios from 'axios';
import { Button, Table, Modal, Form, Image, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

function Users() {
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oldPhoto, setOldPhoto]  = useState('');
  const [oldPassword, setOldPassword]  = useState('');
  const [photo, setPhoto] = useState(null);
  const [roleId, setRoleId] = useState('');
  const [updatingUser, setUpdatingUser] = useState(null);
  const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL;

  // Function Show Data
  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/utils/list');

      if (response.status === 201) {
        setRoles(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Fetching Roles
  useEffect(() => {
    fetchRoles();
  }, []);

  // Function Show Data
  const fetchUsers = async () => {
    try {
      const searchTermEncoded = encodeURIComponent(searchTerm);
      const response = await axios.get('/api/users/read',  {
        params: {
          limit: pageSize,
          offset: offset,
          search: searchTermEncoded
        }
      });

      if (response.status === 201) {
        setData(response.data.data);
        setRowCount(response.data.row_count);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Fetching Users
  useEffect(() => {
    fetchUsers();
  }, [pageSize, offset, searchTerm]);

  const maxPages = Math.ceil(rowCount / pageSize);
  const currentPage = offset / pageSize + 1;

  const handlePageSize = (e) => {
    setOffset(0);
    setPageSize(Number(e));
  };

  const handleNextPage = () => {
    if (currentPage < maxPages) {
      setOffset(offset + pageSize);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setOffset(offset - pageSize);
    }
  };

  const handleSubmit = async () => {
    try {
      // Upload photo to Supabase
      const formData = new FormData();
      formData.append('photo', photo); // Append Blob and its name to FormData

      const uploadResponse = await axios.post('/api/attachement/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.status === 200) {
        const uploadedFileName = uploadResponse.data.fileName;

        // If photo uploaded successfully, continue to save user data
        const userData = {
          full_name: fullName,
          email: email,
          password: password,
          photo: uploadedFileName, // Use uploaded photo file name
          role_id: roleId
        };

        // Save user data
        const addUserResponse = await axios.post('/api/users/create', userData);

        if (addUserResponse.status === 201) {
          toast.success("User added successfully");
          // Reset form fields
          setFullName('');
          setEmail('');
          setPassword('');
          setPhoto(null);
          setRoleId('');
          setShowModal(false);
          fetchUsers(); // Refetch data after adding user
        }
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error('sd');
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      let uploadedFileName = '';

      // Jika ada photo baru yang diupload
      if (photo) {
        // Upload photo baru ke Supabase
        const formData = new FormData();
        formData.append('photo', photo); // Append Blob and its name to FormData

        const uploadResponse = await axios.post('/api/attachement/users/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (uploadResponse.status === 200) {
          uploadedFileName = uploadResponse.data.fileName;
        } else {
          throw new Error('Failed to upload photo');
        }
      }

      // Hapus photo lama jika ada
      if (oldPhoto) {
        const removeResponse = await axios.post('/api/attachement/users/remove', { oldPhoto });

        if (removeResponse.status !== 201) {
          throw new Error('Failed to remove old photo');
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        id: updatingUser.id,
        full_name: fullName,
        email: email,
        password: hashedPassword || oldPassword,
        photo: uploadedFileName || oldPhoto,
        role_id: roleId
      };

      const updateUserResponse = await axios.post('/api/users/update', userData);

      if (updateUserResponse.status === 201) {
        toast.success("User updated successfully");
        // Reset form fields
        setFullName('');
        setEmail('');
        setPassword('');
        setRoleId('');
        setPhoto('');
        setOldPhoto('');
        setOldPassword('');
        setUpdatingUser(null);
        setShowUpdateModal(false);
        fetchUsers(); // Refetch data after updating user
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };
  

  const openUpdateModal = (user) => {
    setUpdatingUser(user);
    setFullName(user.name);
    setEmail(user.email);
    setRoleId(user.role_id);
    setOldPassword(user.password);
    setOldPhoto(user.photo);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdatingUser(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setRoleId('');
    setOldPhoto('');
    setPhoto('');
    setShowUpdateModal(false);
  };

  const handleDelete = async (id, oldPhoto) => {
    try {
      if (oldPhoto) {
        const removeResponse = await axios.post('/api/attachement/users/remove', { oldPhoto });

        if (removeResponse.status !== 201) {
          throw new Error('Failed to remove old photo');
        }
      }

      const response = await axios.delete('/api/users/delete', {
        data: { id }
      });

      if (response.status === 201) {
        toast.info(response.data.message);
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Seo title="Users Management"/>
      <PageHeader titles="Users Management" active="Users" items={['Management']} />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title as='h3'>Users Management</Card.Title>
              <Button variant="primary" className="btn-sm ms-auto" onClick={() => setShowModal(true)}>Add Users</Button>
            </Card.Header>
            <Card.Body>
              <Row className='mb-2 justify-content-between'>
                <Col lg={2} md={12} className="mb-5">
                  <div className='d-flex align-items-center'>
                    <Form.Select
                      value={pageSize}
                      onChange={(e) => handlePageSize(e.target.value)}
                      className='me-2'
                    >
                      {[5, 10, 25, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          Show {pageSize}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col lg={4} xs={12} className='mb-3'>
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder="Search Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup> 
                </Col>
              </Row>
              <Row>
                <div className="table-responsive">
                  <Table className='table-bordered table-striped'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th className='text-center'>Photo</th>
                        <th className='text-center'>Email</th>
                        <th className='text-center'>Roles</th>
                        <th className='text-center'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data && data.length > 0 ? (
                        data.map((user, index) => (
                          <tr key={index}>
                            <td>{user.name}</td>
                            <td className='text-center'>
                              <img className="avatar bradius cover-image" alt={user.name} src={user.photo ? avatarUrl+user.photo : '../../../assets/images/users/1.jpg'} />
                            </td>
                            <td className='text-center'>{user.email}</td>
                            <td className='text-center'>{user.role_name}</td>
                            <td className='text-center'>
                              <div className='btn-list'>
                                <Button className='btn-icon btn-sm' onClick={() => openUpdateModal(user)}>
                                  <i className="fe fe-edit"></i>
                                </Button>
                                <Button className="btn-icon btn-sm" variant='danger' onClick={() => handleDelete(user.id , user.photo)}>
                                  <i className="fe fe-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            <p>No records available.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                {data && data.length > 0 && (
                  <div className="d-block d-sm-flex mt-4 align-items-center">
                    <span className="">
                      Page{" "}
                      <strong>
                        {currentPage} of {maxPages}
                      </strong>{" "}
                    </span>
                    <span className="ms-sm-auto">
                      <Button
                        variant=""
                        className="btn-default tablebutton d-sm-inline d-block me-2 my-2"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        {" Previous "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-2"
                        onClick={handleNextPage}
                        disabled={currentPage === maxPages}
                      >
                        {" Next "}
                      </Button>
                    </span>
                  </div>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>Full Name</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Enter full name"
              name="full_name"
              type='text'
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>Email</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Enter email"
              name="email"
              type='email'
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>Password</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Enter password"
              name="password"
              type='password'
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>Roles Permissions</Form.Label>
            <Form.Control
              type="text"
              as="select"
              placeholder="Roles"
              className='mb-2 form-control'
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option>-- Select Roles ---</option>
              {roles.map((role, index) => (
                <option key={index} value={role.id}>{role.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>Full Name</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Enter full name"
              name="full_name"
              type='text'
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>Email</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Enter email"
              name="email"
              type='email'
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>Roles Permissions</Form.Label>
            <Form.Control
              type="text"
              as="select"
              placeholder="Roles"
              className='mb-2 form-control'
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option>-- Select Roles ---</option>
              {roles.map((role, index) => (
                <option key={index} value={role.id}>{role.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="text-start form-group">
            {photo ? 
              <img src={URL.createObjectURL(photo)} className='img-thumbnail' width={100}/> 
              : 
              oldPhoto ? 
              <img src={avatarUrl+oldPhoto} className='img-thumbnail' width={100}/> 
              : 
              ''
            }
            <Form.Label className='mb-2'>Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </Form.Group>
          <Form.Group className="text-start form-group">
            <Form.Label className='mb-2'>New Password</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Enter new password"
              name="password"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUpdateModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateSubmit}>
              Update
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  )
}

Users.layout = 'Contentlayout'
export default Users;
