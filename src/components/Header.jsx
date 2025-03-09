import React from 'react';
import { Navbar, Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import logo1 from '../assets/avatar2.png';
import logo2 from '../assets/avatar1.png';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); // hooks để điều hướng

  return (
    <Navbar bg="light" expand="lg" className="px-3 inner-header">
      <Container fluid >
        <Row className="align-items-center header">
          <Col xs={12} md={3} className='header-info'>
            <Image
            src={logo1}
            roundedCircle
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            className='header-info-img'
            />
            <div className='header-info-user'>
              <span className="ml-2 font-weight-bold">Võ Thành Danh</span>
              <p>Kênh đề thi</p>
            </div>
            
          </Col>
          <Col xs={12} md={5}>
            <Form className="d-flex ms-auto header-search">
              <Form.Control type="text" placeholder="Tìm kiếm đề thi" className="me-2 header-search-input" />
              <FontAwesomeIcon className='icon-search' icon={faSearch}/>
            </Form>
          </Col>
          <Col xs={12} md={4} className='header-add-img d-flex justify-content-end align-items-center'>
            <Button variant='primary' className='btn-create-exam' onClick={() => navigate("/workspace/exams/create-exam")}>
              <FontAwesomeIcon icon={faSquarePlus} />
              <span className='header-title-create'>Tạo đề thi</span>
            </Button>
            <div className='btn-img-user-right'>
              <Image src={logo2}
                roundedCircle
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}             
              />
            </div>   
          </Col>
        </Row>     
      </Container>
    </Navbar>
  );
};

export default Header;
