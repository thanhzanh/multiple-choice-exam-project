import React from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faHeart, faList, faSliders } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="bg-light p-3 inner-sidebar" style={{ height: '130vh', width: '250px' }}>
      <h4 className="logo">QuizSTU</h4>
      <Nav className="flex-column navbar">
        <Nav.Link className='navbar-item' href="#">
          <FontAwesomeIcon className='nav-icon' icon={faHouse} />
          Thư viện của tôi
        </Nav.Link>
        <Nav.Link className='navbar-item' href="#">
          <FontAwesomeIcon className='nav-icon' icon={faHeart} />
          Đề thi yêu thích
          </Nav.Link>
        <Nav.Link className='navbar-item' href="#">
          <FontAwesomeIcon className='nav-icon' icon={faList} />
          Kết quả thi
        </Nav.Link>
        <Nav.Link className='navbar-item' href="#">
          <FontAwesomeIcon className='nav-icon' icon={faSliders} />
          Quản lý đề thi
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
