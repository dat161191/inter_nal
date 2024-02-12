import React from 'react';
import MainLayout from 'components/layout/mainLayout';
import { Row, Col, Button } from 'reactstrap';
import Image from 'next/image';
import image403 from 'assets/images/not-found.png';
import Link from 'next/link';
import { RouterPath } from 'shared/constant/common';

const Page404 = () => {
  return (
    <MainLayout title={'404'}>
      <div className="container">
        <Row className="justify-content-center">
          <Col sm={8}>
            <div className="text-center">
              <Image src={image403} alt="403 forbidden" width="160" height="160" layout="responsive" className="img-fluid" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="text-center">
            <h3 className="mt-3">You don&apos;t have permissions to see this page !</h3>
            <Link href={RouterPath.Home} passHref>
              <Button color="primary" className="mt-4">
                Take me back to Home
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Page404;
