import { useState } from 'react';
import Seo from '@/shared/layout-components/seo/seo';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
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
                  <span className="login100-form-title pb-5"> Register</span>
                    <div>
                      <Form.Group className="text-start form-group" controlId="formEmail">
                        <Form.Label>Name</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="Enter your name"
                            name="name"
                            type='text'
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                      </Form.Group>
                      <Form.Group className="text-start form-group" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="Enter your email"
                            name="email"
                            type='text'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                      </Form.Group>
                      <Form.Group
                          className="text-start form-group"
                          controlId="formpassword"
                        >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          className="form-control"
                          placeholder="Enter your password"
                          name="password"
                          type='password'
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}
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
                                Registering...
                              </>
                            ) : (
                              'Register'
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
