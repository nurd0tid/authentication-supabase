import PageHeader from '@/shared/layout-components/pageheader/pageHeader';
import Seo from '@/shared/layout-components/seo/seo';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddRoles() {
  const [features, setFeatures] = useState([]);
  const [permission, setPermission] = useState([]);
  const [nameRole, setNameRole] = useState('');
  const [rolePermission, setRolePermission] = useState([]);

  const fetchFeatures = async () => {
    try {
      const response = await axios.get('/api/roles/features');

      if (response.status === 201) {
        setFeatures(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchPermission = async () => {
    try {
      const response = await axios.get('/api/roles/permission');

      if (response.status === 201) {
        setPermission(response.data);
      } else {
        toast.error('Roles entry fetch failed');
      }
    } catch (error) {
      toast.error('Error fetching roles entry:', error);
    }
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  const handlePermissionChange = (featureId, permissionId, checked) => {
    setRolePermission(prevState => {
      const index = prevState.findIndex(item => item.features_id === featureId);

      if (index !== -1) {
        // Jika fitur sudah ada dalam state, periksa apakah permission sudah ada
        if (checked && !prevState[index].permission.includes(permissionId)) {
          prevState[index].permission.push(permissionId);
        } else if (!checked && prevState[index].permission.includes(permissionId)) {
          prevState[index].permission = prevState[index].permission.filter(id => id !== permissionId);
        }
      } else {
        // Jika fitur belum ada dalam state, tambahkan dengan permission yang sesuai
        prevState.push({
          features_id: featureId,
          permission: checked ? [permissionId] : []
        });
      }

      return [...prevState];
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/roles/create', {
        name: nameRole,
        roles: rolePermission
      });

      if (response.status === 201) {
        toast.success('Features entry created successfully');
        setNameRole('');
        setRolePermission([]);
        
        // Reset form switches to unchecked
        const formSwitches = document.querySelectorAll('input[type="checkbox"]');
        formSwitches.forEach(switchInput => {
          switchInput.checked = false;
        });
      }
    } catch (error) {
      toast.error('Error creating features entry:', error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Seo title="Add Roles"/>
      <PageHeader titles="Add Roles" active="Add Roles" items={['User Management']} />
      {/* <div className='main-content'>
        <Col lg={12}>
          <Form>
            <Row className='mb-5'>
              <Col lg={3}>
                <Form.Label>Roles Name</Form.Label>
              </Col>
              <Col lg={8}>
                <Form.Control
                  placeholder='Enter roles name'
                  value={nameRole}
                  onChange={(e) => setNameRole(e.target.value)}
                />
              </Col>
            </Row>
            {features.length > 0 ? (
              features.map((group, groupIndex) => (
                <Row className='mb-3' key={groupIndex}>
                  <Col lg={3} className='mb-2'>
                    <h6><b>Group ({group.group_name})</b></h6>
                  </Col>
                  {group.features.map((feature) => (
                    <Row key={feature.id}>
                      <Col lg={3}>
                        <Form.Label className='text-muted'>{feature.menu}</Form.Label>
                      </Col>
                      <Col lg={8}>
                        <Row>
                          <Col lg={9}>
                            <Row>
                              {permission.length > 0 && (
                                permission.map((perm, permIndex) => (
                                  <Col lg={3} key={permIndex}>
                                    <Form.Check
                                      type="switch"
                                      id={`${perm.id}-${groupIndex}-${feature.id}`}
                                      label={perm.name}
                                      onChange={(e) => handlePermissionChange(feature.id, perm.id, e.target.checked)}
                                    />
                                  </Col>
                                ))
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                </Row>
              ))
            ) : (
              <><p>Tunggu</p></>
            )}
          </Form>
          <Row className='mt-3'>
            <Col lg={12}>
              <Button onClick={handleSave}>Simpan</Button>
            </Col>
          </Row>
        </Col>
      </div> */}
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title as='h3'>Add Roles</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form.Group className="text-start form-group">
                <Form.Label className='mb-2'>Roles Name</Form.Label>
                  <Form.Control
                    className="form-control"
                    placeholder="Enter roles name"
                    name="roles_name"
                    type='text'
                    // value={email} 
                    // onChange={(e) => setEmail(e.target.value)}
                    required
                  />
              </Form.Group>
              <Row className='mb-2 pe-5'>
                <Col xl={8}>
                  <strong>Path Permissions</strong>
                </Col>
                <Col xl={1}>
                  <h6><strong>Read</strong></h6>
                </Col>
                <Col xl={1}>
                  <h6><strong>Write</strong></h6>
                </Col>
                <Col xl={1}>
                  <h6><strong>Update</strong></h6>
                </Col>
                <Col xl={1}>
                  <h6><strong>Delete</strong></h6>
                </Col>
              </Row>
              <Accordion className="panel-default" alwaysOpen>
                <Accordion.Item eventKey="0">

                  <Accordion.Header>Main</Accordion.Header>
                  <Accordion.Body>
                    <Row className='mb-2'>
                      <Col xl={8}>
                        <i className='fe fe-home me-3'></i><span>Dashboard</span>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                    </Row>
                    <Row className='mb-2'>
                      <Col xl={8}>
                        <i className='bi bi-journals me-3'></i><span>Blog</span>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Management</Accordion.Header>
                  <Accordion.Body>
                    <i className='bi bi-person-workspace me-3'></i><span>User Management</span>
                    <Row className='mb-2 mt-2'>
                      <Col xl={8}>
                        <p className='px-5'><i className='bi bi-chevron-double-right'/> Roles</p>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                    </Row>
                    <Row className='mb-2'>
                      <Col xl={8}>
                        <p className='px-5'><i className='bi bi-chevron-double-right'/> Add Roles</p>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                      <Col xl={1}>
                        <label className="custom-control custom-checkbox-md">
                          <input type="checkbox" className="custom-control-input" name="example-checkbox1" defaultValue="option1" />
                          <span className="custom-control-label"></span>
                        </label>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

AddRoles.layout = 'Contentlayout';
export default AddRoles;
