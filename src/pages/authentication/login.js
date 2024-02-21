import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/authentication/login', {
        email,
        password,
      });
      if (response.status === 200) {
        const { redirectTo } = response.data;
        if (redirectTo) {
          // Jika redirectTo tersedia, redirect ke halaman tersebut
          router.push(redirectTo);
        } else {
          // Jika tidak, berarti login berhasil tanpa 2FA, redirect ke dashboard
          router.push('/dashboard');
        }
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (

      <Row className="justify-content-center" style={{ minHeight: '80vh', alignItems: 'center' }}>
        <Col md={3}>
          <h1>Login</h1>
          {error && <p>{error}</p>}
          <Form>
            <Form.Group controlId="formBasicEmail" className='mb-3'>
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={handleLogin} className='mt-2'>
              Login
            </Button>
          </Form>
        </Col>
      </Row>

  );
}
