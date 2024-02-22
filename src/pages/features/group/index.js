import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Image } from 'react-bootstrap';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeaturesGroup() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [posision, setPosision] = useState('');
  const [groupId, setGroupId] = useState('');
  const [nameUpdate, setNameUpdate] = useState('');
  const [posisionUpdate, setPosisionUpdate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  // Function Show Data
  const fetchFeaturesGroup = async () => {
    try {
      const response = await axios.get('/api/features/group/read');

      if (response.status === 201) {
        setData(response.data);
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

  // Function  Create
  const handleCreateFeaturesGroup = async () => {
    try {
      const response = await axios.post('/api/features/group/create', {
        name,
        posision,
      });

      if (response.status === 201) {
        toast.success('Features Group entry created successfully');
        setShowModal(false);
        setName('');
        setPosision('');
        fetchFeaturesGroup();
      }
    } catch (error) {
      toast.error('Error creating features group entry:', error);
    }
  };

  // Function  Update
  const handleUpdateModal = (featuresGroup) => {
    setGroupId(featuresGroup.id);
    setNameUpdate(featuresGroup.name);
    setPosisionUpdate(featuresGroup.posision);
    setShowModalUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('/api/features/group/update', {
        name: nameUpdate,
        posision: posisionUpdate,
        id: groupId
      });

      if (response.status === 201) {
        toast.success('Features Group entry uppdated successfully');
        setShowModalUpdate(false);
        setGroupId('');
        setNameUpdate('');
        setPosisionUpdate('');
        fetchFeaturesGroup();
      }
    } catch (error) {
      toast.error('Error updated features group entry:', error);
    }
  };

  // Function  Create
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('/api/features/group/delete', {
        data: { id }
      });

      if (response.status === 201) {
        toast.info('Features Group entry delete successfully');
        fetchFeaturesGroup();
      } else {
        toast.error('Features Group entry delete failed');
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
              <th className='text-center'>posision</th>
              <th className='text-center'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((featuresGroup, index) => (
                <tr key={index}>
                  <td>{featuresGroup.name}</td>
                  <td className='text-center'>{featuresGroup.posision}</td>
                  <td style={{ width: '120px'}} className='text-center'>
                    <span>
                      <Button className='me-2' onClick={() => handleUpdateModal(featuresGroup)}>
                        <MdOutlineEdit/>
                      </Button>
                      <Button className='btn btn-danger' onClick={() => handleDelete(featuresGroup.id)}>
                        <MdDeleteOutline/>
                      </Button>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  <Image src="/assets/notfound.png" alt="No Products" fluid width={350}/>
                  <p>No records available.</p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal untuk menambahkan features group */}
        <Modal show={showModal} onHide={() => setShowModal(false)}> {/* 3. Tambahkan modal dengan state untuk mengontrol visibilitas */}
          <Modal.Header closeButton>
            <Modal.Title>Add Features Group</Modal.Title>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateFeaturesGroup}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal untuk edit features group */}
        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Features Group</Modal.Title>
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
              <Form.Control
                type="number"
                className='mb-2'
                placeholder="New Posision"
                value={posisionUpdate}
                onChange={(e) => setPosisionUpdate(e.target.value)}
              />
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