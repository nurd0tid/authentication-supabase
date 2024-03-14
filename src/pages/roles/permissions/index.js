import React, { useState, useEffect } from 'react';
import Seo from '@/shared/layout-components/seo/seo';
import PageHeader from '@/shared/layout-components/pageheader/pageHeader';
import axios from 'axios';
import Creatable from "react-select/creatable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Badge, Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';

function RolesPermissions() {
  const [data, setData] = useState([]);
  const [dataPermission, setDataPermission] = useState([]);
  const [dataPath, setDataPath] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rolesName, setRolesName] = useState('');
  const [checkedPermissions, setCheckedPermissions] = useState([]);
  const [collectPath, setCollectPath] = useState([]);
  const [updatedRoleId, setUpdatedRoleId] = useState('');
  const [updatedRoleName, setUpdatedRoleName] = useState('');
  const [updatedPaths, setUpdatedPaths] = useState([]);
  const [updatedPermissions, setUpdatedPermissions] = useState([]);
  const [oldPaths, setOldPaths] = useState([]);
  const [oldPermissions, setOldPermissions] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL;

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/roles/read');

      if (response.status === 201) {
        setData(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchPermission = async () => {
    try {
      const response = await axios.get('/api/utils/permission');

      if (response.status === 201) {
        setDataPermission(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  const fetchPath = async () => {
    try {
      const response = await axios.get('/api/utils/path');

      if (response.status === 201) {
        setDataPath(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchPath();
  }, []);

  const handlePermissionChange = (event, index) => {
    const isChecked = event.target.checked;
    setCheckedPermissions(prevState => {
      const updatedPermissions = [...prevState];
      updatedPermissions[index] = isChecked;
      return updatedPermissions;
    });
  };

  const handleSubmit = async () => {
    const selectedPermissionIds = [];
    checkedPermissions.forEach((isChecked, index) => {
      if (isChecked) {
        const permissionId = dataPermission[index].id;
        selectedPermissionIds.push(permissionId);
      }
    });

    try {
      const response = await axios.post('/api/roles/create', {
        rolesName: rolesName,
        selectedPermission: selectedPermissionIds,
        collectPath: collectPath
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        fetchData();
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setShowModal(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('/api/roles/delete', {
        data: { id }
      });

      if (response.status === 201) {
        toast.info(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  

  const handleEditRole = (role) => {
    setUpdatedRoleId(role.role_id);
    setUpdatedRoleName(role.role_name);
    setUpdatedPaths(role.menu_permissions);
    setUpdatedPermissions(role.role_permissions);
    setOldPaths(role.menu_permissions);
    setOldPermissions(role.role_permissions);
    setShowUpdateModal(true);
  };

  const handlePermissionUpdate = (event, permissionId) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    // Menambahkan permission jika dicentang
    setUpdatedPermissions(prevPermissions => [...prevPermissions, { id: permissionId }]);
  } else {
    // Menghapus permission jika tidak dicentang
    setUpdatedPermissions(prevPermissions => prevPermissions.filter(permission => permission.id !== permissionId));
  }
};


  const handleUpdate = async () => {
    try {
      // Menentukan data baru
      const addedPaths = updatedPaths.filter(path => !oldPaths.includes(path));
      const removedPaths = oldPaths.filter(path => !updatedPaths.includes(path));
  
      // Menentukan perubahan pada accessibility
      const addedPermissions = updatedPermissions.reduce((acc, updatedPermission) => {
        const found = oldPermissions.find(oldPermission => oldPermission.id === updatedPermission.id);
        if (!found) {
          acc.push(dataPermission.find(permission => permission.id === updatedPermission.id));
        }
        return acc;
      }, []);

      const removedPermissions = oldPermissions.reduce((acc, oldPermission) => {
        const found = updatedPermissions.find(updatedPermission => updatedPermission.id === oldPermission.id);
        if (!found) {
          acc.push(dataPermission.find(permission => permission.id === oldPermission.id));
        }
        return acc;
      }, []);

      // console.log("Role ID:", updatedRoleId);
      // console.log("Role Name:", updatedRoleName);
      // console.log("Added paths:", addedPaths);
      // console.log("Removed paths:", removedPaths);
      // console.log("Added permissions:", addedPermissions);
      // console.log("Removed permissions:", removedPermissions);
  
      const response = await axios.post('/api/roles/update', {
        role_id: updatedRoleId, 
        newName: updatedRoleName, 
        newPath: addedPaths, 
        removedPath: removedPaths, 
        newPermission: addedPermissions,
        removePermission: removedPermissions
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        setUpdatedRoleId('');
        setUpdatedRoleName('');
        setUpdatedPaths([]);
        setUpdatedPermissions([]);
        setOldPaths([]);
        setOldPermissions([]);
        setShowUpdateModal(false);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Seo title="Role Permissions"/>
      <PageHeader titles="Role Permissions" active="Permissions" items={['Roles']} />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title as='h3'>Role Permissions</Card.Title>
              <Button variant="primary" className="btn-sm ms-auto" onClick={() => setShowModal(true)}>Add Roles</Button>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table   className='table-bordered table-striped'>
                  <thead>
                    <tr className='text-center'>
                      <th>Name</th>
                      <th>Avaialble Users</th>
                      <th>Path Permissions</th>
                      <th>Accessibility</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr className='text-center' key={index}>
                          <td>{item.role_name}</td>
                          <td>
                              {item.users !== null ? (
                                <div className="avatar-list avatar-list-stacked">
                                  {item.users.map((listUser, index) => (
                                      listUser.photo ? (
                                        <img className="avatar brround cover-image" alt={listUser.user_name} src={avatarUrl+listUser.photo} key={index}/>
                                      ) : (
                                        <img className="avatar brround cover-image" alt='user1' src={"../../../assets/images/users/1.jpg"} key={index}/>
                                      )
                                    ))}
                                    {item.remaining_users > 0 && (
                                      <span className="avatar brround cover-image bg-primary">+{item.remaining_users}</span>
                                    )}
                                </div>
                              ) : (
                                <p>Not Available Assign</p>
                              )}
                          </td>
                          <td style={{ width: '25%' }}>
                            {item.menu_permissions.map((menuPermission, index) => (
                              <Badge pill bg="success" className='me-2' key={index}>{menuPermission.label}</Badge>
                            ))}
                          </td>
                          <td style={{ width: '15%' }}>
                            {item.role_permissions !== null ? (
                              item.role_permissions.map((rolesPermissions, index) => (
                                <Badge bg="default" className='me-2' key={index}>{rolesPermissions.name}</Badge>
                              ))
                            ) : (
                              <span></span>
                            )}
                          </td>
                          <td>
                            <div className='btn-list'>
                              <Button className="btn-icon btn-sm" variant='warning' onClick={() => handleEditRole(item)}><i className="fe fe-edit"></i></Button>
                              <Button className="btn-icon btn-sm" variant='danger' onClick={() => handleDelete(item.role_id)}><i className="fe fe-trash"></i></Button>
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
            </Card.Body>
          </Card>
        </Col>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Roles</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="text-start form-group">
              <Form.Label className='mb-2'>Roles Name</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="Enter roles name"
                  name="roles_name"
                  type='text'
                  value={rolesName} 
                  onChange={(e) => setRolesName(e.target.value)}
                  required
                />
            </Form.Group>
            <Form.Group className="text-start form-group">
              <Form.Label className='mb-2'>Path Permissions</Form.Label>
              <div>
                <Creatable
                  isMulti
                  classNamePrefix="Select2"
                  options={dataPath}
                  value={collectPath}
                  onChange={setCollectPath}
                />
              </div>
            </Form.Group>
            <Form.Group className="text-start form-group">
              <Form.Label className='mb-2'>Accessibility</Form.Label>
              <Row className='mb-2'>
                {dataPermission.map((permission, index) => (
                  <Col xl={3} key={index}>
                    <label className="custom-control custom-checkbox-md">
                      <input 
                        type="checkbox" 
                        className="custom-control-input" 
                        name={permission.name} 
                        defaultValue={permission.id}
                        checked={checkedPermissions[index] || false}
                        onChange={e => handlePermissionChange(e, index)}
                      />
                      <span className="custom-control-label">{permission.name}</span>
                    </label>
                  </Col>
                ))}
              </Row>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedRoleName}
                onChange={(e) => setUpdatedRoleName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Permissions</Form.Label>
              <div>
                <Creatable
                  isMulti
                  classNamePrefix="Select2"
                  options={dataPath}
                  value={updatedPaths}
                  onChange={setUpdatedPaths}
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Accessibility</Form.Label>
              <Row className='mb-2'>
                {dataPermission.map((permission, index) => (
                  <Col xl={3} key={index}>
                    <label className="custom-control custom-checkbox-md">
                      <input 
                        type="checkbox" 
                        className="custom-control-input" 
                        name={permission.name} 
                        defaultValue={permission.id}
                        checked={updatedPermissions.some(perm => perm.id === permission.id) || false}
                        onChange={e => handlePermissionUpdate(e, permission.id)}
                      />
                      <span className="custom-control-label">{permission.name}</span>
                    </label>
                  </Col>
                ))}
              </Row>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </div>
  )
}

RolesPermissions.layout = 'Contentlayout';
export default RolesPermissions