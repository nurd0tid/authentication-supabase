import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if router.query.email is defined, if not redirect to login page
    if (!router.query.email) {
      router.push('/authentication/login');
    }
  }, [router.query.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('/api/authentication/verifyotp', {
        email: router.query.email,
        otp: otp.trim(),
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        router.push('/dashboard'); // Change this to the appropriate redirect path
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
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </Form>
        </div>
      </Col>
    </Container>
  );
}
