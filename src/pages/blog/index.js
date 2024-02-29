import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Image, Row, Col, Card } from 'react-bootstrap';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Seo from '@/shared/layout-components/seo/seo';
import PageHeader from '@/shared/layout-components/pageheader/pageHeader';

function Blog() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blogId, setBlogId] = useState('');
  const [titleUpdate, setTitleUpdate] = useState('');
  const [descriptionUpdate, setDescriptionUpdate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  // Function Show Data
  const fetchBlog = async () => {
    try {
      const response = await axios.get('/api/blog/read');

      if (response.status === 201) {
        setData(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Fetching Blogs
  useEffect(() => {
    fetchBlog();
  }, []);

  // Function  Create
  const handleCreateBlog = async () => {
    try {
      const response = await axios.post('/api/blog/create', {
        title,
        description
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        setShowModal(false);
        setTitle('');
        setDescription('');
        fetchBlog();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setShowModal(false);
      setTitle('');
      setDescription('');
      fetchBlog();
    }
  };

  // Function  Update
  const handleUpdateModal = (blog) => {
    setBlogId(blog.id);
    setTitleUpdate(blog.title);
    setDescriptionUpdate(blog.description);
    setShowModalUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('/api/blog/update', {
        title: titleUpdate,
        description: descriptionUpdate,
        id: blogId
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        setShowModalUpdate(false);
        setBlogId('');
        setTitleUpdate('');
        setDescriptionUpdate('');
        fetchBlog();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Function  Create
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('/api/blog/delete', {
        data: { id }
      });

      if (response.status === 201) {
        toast.info(response.data.message);
        fetchBlog();
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
      <Seo title="Blog"/>
      <PageHeader titles="Blog" active="Blog" items={['']} />
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title as='h3'>Blog</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-end mb-2">
                <Button variant="primary" className="ml-auto" onClick={() => setShowModal(true)}>Add New</Button>
              </div>
              <div className="table-responsive">
                <Table className='table-bordered table-striped'>
                  <thead>
                    <tr className='text-center'>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((blog, index) => (
                        <tr key={index} className='text-center'>
                          <td>{blog.title}</td>
                          <td>{blog.description}</td>
                          <td style={{ width: '120px'}}>
                            <span>
                              <Button className='me-2' size='sm' onClick={() => handleUpdateModal(blog)}>
                                <MdOutlineEdit/>
                              </Button>
                              <Button variant='danger' size='sm' onClick={() => handleDelete(blog.id)}>
                                <MdDeleteOutline/>
                              </Button>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
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

        {/* Modal untuk menambahkan blog */}
        <Modal show={showModal} onHide={() => setShowModal(false)}> {/* 3. Tambahkan modal dengan state untuk mengontrol visibilitas */}
          <Modal.Header closeButton>
            <Modal.Title>Add Blog</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                className='mb-2'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Form.Label>Description</Form.Label>
              <textarea
                placeholder="Description"
                className='form-control mb-2'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateBlog}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal untuk edit blog */}
        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Blog</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                className='mb-2'
                placeholder="New Title"
                value={titleUpdate}
                onChange={(e) => setTitleUpdate(e.target.value)}
              />
              <Form.Label>Description</Form.Label>
              <textarea
                placeholder="New Description"
                className='form-control mb-2'
                value={descriptionUpdate}
                onChange={(e) => setDescriptionUpdate(e.target.value)}
              ></textarea>
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
      </Row>
    </div>
  )
}

Blog.layout = 'Contentlayout'
export default Blog