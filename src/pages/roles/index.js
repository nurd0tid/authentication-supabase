import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Image } from 'react-bootstrap';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

function Roles() {
  const [data, setData] = useState([]);

  // Function Show Data
  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles/read');

      if (response.status === 201) {
        setData(response.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Fetching Blogs
  useEffect(() => {
    fetchRoles();
  }, []);

  // Function  Create
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('/api/roles/delete', {
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
          <Link href="/roles/add" className='btn btn-primary ml-auto'>Add New</Link>
        </div>
        <Table className='table table-responsive table-bordered table-striped'>
          <thead>
            <tr>
              <th>Name</th>
              <th className='text-center'>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((roles, index) => (
                <tr key={index}>
                  <td>{roles.name}</td>
                  <td style={{ width: '120px'}} className='text-center'>
                    <span>
                      <Button className='me-2' onClick={() => handleUpdateModal(roles)}>
                        <MdOutlineEdit/>
                      </Button>
                      <Button className='btn btn-danger' onClick={() => handleDelete(roles.id)}>
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
      </div>
    </>
  )
}

Roles.layout = 'Contentlayout'
export default Roles