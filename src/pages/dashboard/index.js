import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Container, Row, Table, Modal } from 'react-bootstrap';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blogId, setBlogId] = useState('');
  const [titleUpdate, setTitleUpdate] = useState('');
  const [descriptionUpdate, setDescriptionUpdate] = useState('');
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  // Fetching Me
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/authentication/me');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Tambahkan penanganan kesalahan sesuai kebutuhan Anda
      }
    };

    fetchData();
  }, []);

  // Function Show Data
  const fetchBlog = async () => {
    try {
      const response = await axios.get('/api/blog/read');

      if (response.status === 201) {
        setData(response.data);
      } else {
        console.error('Blog entry fetch failed');
      }
    } catch (error) {
      // console.error('Error fetching blog entry:', error);
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
        // alert('Blog entry created successfully');
        setShowModal(false);
        setTitle('');
        setDescription('');
        fetchBlog();
      }
    } catch (error) {
      // alert('Error creating blog entry:', error);
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
        // alert('Blog entry created successfully');
        setShowModalUpdate(false);
        setBlogId('');
        setTitleUpdate('');
        setDescriptionUpdate('');
        fetchBlog();
      }
    } catch (error) {
      // alert('Error creating blog entry:', error);
    }
  };

  // Function  Create
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('/api/blog/delete', {
        data: { id }
      });

      if (response.status === 201) {
        alert('Blog entry delete successfully');
        fetchBlog();
      } else {
        alert('Blog entry creation failed');
      }
    } catch (error) {
      // alert('Error creating blog entry:', error);
      console.log(error)
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/authentication/logout');

      if (response.status === 200) {
        router.push('/authentication/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Container>
        {userData ? (
          <>
            <p>Welcome, Back!</p>
            <p>Your user ID is: {userData.sud}</p>
            <Button className='mb-2 me-2' onClick={() => setShowModal(true)}>Add Blog</Button>
            <Button onClick={handleLogout} variant='danger' className='mb-2'>Logout</Button>
            <Row>
              <Table className='table table-responsive table-bordered table-striped'>
                <thead>
                  <tr className='text-center'>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((blog, index) => (
                    <tr key={index} className='text-center'>
                      <td>{blog.title}</td>
                      <td>{blog.description}</td>
                      <td>
                        <span>
                          <Button className='me-2' onClick={() => handleUpdateModal(blog)}>Update</Button>
                          <Button variant='danger' onClick={() => handleDelete(blog.id)}>Delete</Button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </Container>
      
      {/* Modal untuk menambahkan blog */}
      <Modal show={showModal} onHide={() => setShowModal(false)}> {/* 3. Tambahkan modal dengan state untuk mengontrol visibilitas */}
        <Modal.Header closeButton>
          <Modal.Title>Add Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <br/><br/>
            <textarea
              placeholder="Description"
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

      <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input
              type="text"
              placeholder="New Title"
              value={titleUpdate}
              onChange={(e) => setTitleUpdate(e.target.value)}
            />
            <br/><br/>
            <textarea
              placeholder="New Description"
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
    </div>
  );
}
