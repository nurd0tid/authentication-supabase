import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <Container className="justify-content-center" style={{ minHeight: '80vh', alignItems: 'center' }}>
      <Col lg={6} className="text-center">
        <h2>Unauthorized</h2>
        <p>You do not have permission to access this page.</p>
        <Link href="/dashboard">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </Col>
    </Container>
  );
};

export default UnauthorizedPage;
