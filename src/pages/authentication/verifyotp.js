import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

export default function VerifyOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/authentication/verifyotp', {
        email: router.query.email,
        otp: otp.trim(),
      });
      if (response.status === 200) {
        // OTP verified successfully, redirect to dashboard or home page
        router.push('/dashboard'); // Change this to the appropriate redirect path
      }
    } catch (error) {
      setError('Invalid OTP');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center" style={{ minHeight: '80vh', alignItems: 'center' }}>
        <Col md={6}>
          <div>
            <h1>Verify OTP</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formOtp">
                <Form.Label>OTP:</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </Form.Group>
              {error && <p>{error}</p>}
              <Button variant="primary" type="submit" className='mt-2'>
                Verify
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
