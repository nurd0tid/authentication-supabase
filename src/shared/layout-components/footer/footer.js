import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import Link from 'next/link';

const Footer = () => {

  return (

  <Fragment >
    <footer className="footer mt-3  ">
      <div className="container">
        <Row className="align-items-center flex-row-reverse">
          <Col md={12} sm={12} className="text-center">
            Staterpack Nextjs by <Link href="https://github.com/nurd0tid/starterpack-nextjs"> nurd0tid </Link>.
          </Col>
        </Row>
      </div>
    </footer>
    {/* <!-- FOOTER CLOSED --> */}
  </Fragment>
);
  };

export default Footer;
