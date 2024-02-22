import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('/api/authentication/register', {
        name,
        email,
        password,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          router.push('/authentication/login');
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
      <Container className="justify-content-center" style={{ minHeight: '80vh', alignItems: 'center' }}>
        <ToastContainer />
        <Col md={3}>
          <div>
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className='mb-2'>
                <Form.Label>Your name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className='mb-2'>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className='mb-2'>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              </Form.Group>
              <Button variant="primary" type="submit" className='mt-2' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="mr-2"
                    />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Container>
  );
}
