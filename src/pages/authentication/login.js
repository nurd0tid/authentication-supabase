import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/authentication/login', {
        email,
        password,
      });
      if (response.status === 200) {
        const { redirectTo } = response.data;
        if (redirectTo) {
          toast.success(response.data.message);
          router.push(redirectTo);
        } else {
          toast.success(response.data.message);
          router.push('/dashboard');
        }
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
        <h1>Login</h1>
        <Form>
          <Form.Group controlId="formBasicEmail" className='mb-3'>
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={handleLogin} className='mt-2' disabled={isLoading}>
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
                Loading...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Form>
      </Col>
    </Container>
  );
}
