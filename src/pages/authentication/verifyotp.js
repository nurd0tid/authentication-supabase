import { useEffect, useState } from 'react';
import Seo from '@/shared/layout-components/seo/seo';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
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
    <>
    <ToastContainer />
    <div>
        <Seo title="Login"/>
        <div>
          <div className="page">
            {/* <!-- CONTAINER OPEN --> */}
            <div className="container-login100">
              <div className="wrap-login100 p-6">
                <Form className="login100-form validate-form" onSubmit={handleSubmit}>
                  <span className="login100-form-title pb-5"> Verification OTP</span>
                    <div>
                      <Form.Group className="text-start form-group" controlId="formOtp">
                        <Form.Label>OTP</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="Enter your otp"
                            name="otp"
                            type='text'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                      </Form.Group>
                      <div className="container-login100-form-btn">
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
                      </div>
                    </div>
                </Form>
              </div>
            </div>
            {/* // <!-- CONTAINER CLOSED --> */}
          </div>
        </div>
      </div >
    </>
  );
}
