import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/authentication/register', {
        email,
        password,
      });
      if (response.status === 201) {
        router.push('/authentication/login');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data.message || error.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center" style={{ minHeight: '80vh', alignItems: 'center' }}>
        <Col md={6}>
          <div>
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              </Form.Group>
              <Button variant="primary" type="submit" className='mt-2'>
                Register
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
