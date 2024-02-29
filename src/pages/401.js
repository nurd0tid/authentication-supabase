import React from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import Seo from '@/shared/layout-components/seo/seo';

const UnauthorizedPage = () => {
  return (
    <div className="page">
      <Seo title="Unauthorized"/>
      <div className='page-content error-page'>
        <div className="container text-center">
          <h2>Unauthorized</h2>
          <p>You do not have permission to access this page.</p>
          <Link href="/dashboard">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
