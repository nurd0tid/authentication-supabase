import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Image } from 'react-bootstrap';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeaturesGroup() {
  const [data, setData] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [featuresId, setFeaturesId] = useState('');
  const [name, setName] = useState('');
  const [posision, setPosision] = useState('');
  const [path, setPath] = useState('');
  const [groupId, setGroupId] = useState('');
  const [nameUpdate, setNameUpdate] = useState('');
  const [posisionUpdate, setPosisionUpdate] = useState('');
  const [pathUpdate, setPathUpdate] = useState('');
  const [groupIdUpdate, setGroupIdUpdate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  // Function Show Data
  const fetchFeaturesGroup = async () => {
    try {
      const response = await axios.get('/api/features/group/read');

      if (response.status === 201) {
        setDataGroup(response.data);
      } else {
        toast.error('Features Group entry fetch failed');
      }
    } catch (error) {
      toast.error('Error fetching features group entry:', error);
    }
  };

  // Fetching Blogs
  useEffect(() => {
    fetchFeaturesGroup();
  }, []);

  // Function Show Data
  const fetchFeatures = async () => {
    try {
      const response = await axios.get('/api/features/menu/read');

      if (response.status === 201) {
        setData(response.data);
      } else {
        toast.error('Features entry fetch failed');
      }
    } catch (error) {
      toast.error('Error fetching features entry:', error);
    }
  };

  // Fetching Blogs
  useEffect(() => {
    fetchFeatures();
  }, []);

  // Function  Create
  const handleCreateFeatures = async () => {
    try {
      const response = await axios.post('/api/features/menu/create', {
        name,
        posision,
        path,
        groupId,
      });

      if (response.status === 201) {
        toast.success('Features entry created successfully');
        setShowModal(false);
        setName('');
        setPosision('');
        setPath('');
        setGroupId('');
        fetchFeatures();
      }
    } catch (error) {
      toast.error('Error creating features entry:', error);
    }
  };

  // Function  Update
  const handleUpdateModal = (features) => {
    setFeaturesId(features.id)
    setNameUpdate(features.name);
    setPosisionUpdate(features.posision)
    setPathUpdate(features.path)
    setGroupIdUpdate(features.features_group.id);
    setShowModalUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('/api/features/menu/update', {
        name: nameUpdate,
        posision: posisionUpdate,
        path: pathUpdate,
        groupId: groupIdUpdate,
        id: featuresId
      });

      if (response.status === 201) {
        toast.success('Features entry uppdated successfully');
        setShowModalUpdate(false);
        setFeaturesId('');
        setNameUpdate('');
        setPosisionUpdate('');
        setPathUpdate('');
        setGroupIdUpdate('');
        fetchFeatures();
      }
    } catch (error) {
      toast.error('Error updated features entry:', error);
    }
  };

  // Function  Create
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('/api/features/menu/delete', {
        data: { id }
      });

      if (response.status === 201) {
        toast.info('Features entry delete successfully');
        fetchFeatures();
      } else {
        toast.error('Features entry delete failed');
      }
    } catch (error) {
      toast.success(error)
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='main-content'>
        <div className="d-flex justify-content-end mb-2">
          <Button variant="primary" className="ml-auto" onClick={() => setShowModal(true)}>Add New</Button>
        </div>
        <Table className='table table-responsive table-bordered table-striped'>
          <thead>
            <tr>
              <th>Name</th>
              <th className='text-center'>Posision</th>
              <th className='text-center'>Path</th>
              <th className='text-center'>Group</th>
              <th className='text-center'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((features, index) => (
                <tr key={index}>
                  <td>{features.name}</td>
                  <td className='text-center'>{features.posision}</td>
                  <td className='text-center'>{features.path}</td>
                  <td className='text-center'>{features.features_group.name}</td>
                  <td style={{ width: '120px'}} className='text-center'>
                    <span>
                      <Button className='me-2' onClick={() => handleUpdateModal(features)}>
                        <MdOutlineEdit/>
                      </Button>
                      <Button className='btn btn-danger' onClick={() => handleDelete(features.id)}>
                        <MdDeleteOutline/>
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

        {/* Modal untuk menambahkan features */}
        <Modal show={showModal} onHide={() => setShowModal(false)}> 
          <Modal.Header closeButton>
            <Modal.Title>Add Features</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                className='mb-2'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Form.Label>Posision</Form.Label>
              <Form.Control
                type="number"
                placeholder="Posision"
                className='mb-2'
                value={posision}
                onChange={(e) => setPosision(e.target.value)}
              />
            </div>
            <div>
              <Form.Label>Path</Form.Label>
              <Form.Control
                type="text"
                placeholder="Path"
                className='mb-2'
                value={path}
                onChange={(e) => setPath(e.target.value)}
              />
            </div>
            <div>
              <Form.Label>Features Group</Form.Label>
              <Form.Control
                type="text"
                as="select"
                placeholder="Posision"
                className='mb-2'
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              >
                <option>-- Pilih Group ---</option>
                {dataGroup.map((group, index) => (
                  <option key={index} value={group.id}>{group.name}</option>
                ))}
              </Form.Control>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateFeatures}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal untuk edit features */}
        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Features</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                className='mb-2'
                placeholder="New Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
                />
              <Form.Label>Posision</Form.Label>
            </div>
            <div>
              <Form.Control
                type="number"
                className='mb-2'
                placeholder="New Posision"
                value={posisionUpdate}
                onChange={(e) => setPosisionUpdate(e.target.value)}
                />
            </div>
            <div>
              <Form.Control
                type="text"
                className='mb-2'
                placeholder="New Path"
                value={pathUpdate}
                onChange={(e) => setPathUpdate(e.target.value)}
                />
            </div>
            <div>
              <Form.Label>Features Group</Form.Label>
              <Form.Control
                type="text"
                as="select"
                placeholder="Posision"
                className='mb-2'
                value={groupIdUpdate}
                onChange={(e) => setGroupIdUpdate(e.target.value)}
              >
                <option>-- Pilih Group ---</option>
                {dataGroup.map((group, index) => (
                  <option key={index} value={group.id}>{group.name}</option>
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

FeaturesGroup.layout = 'MainLayout'
export default FeaturesGroup