import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faHeart, faList, faSliders, faGear } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {

  const navigate = useNavigate();

  return (
    <div className="bg-light p-3 inner-sidebar" style={{ height: '130vh', width: '250px' }}>
      <h4 className="logo">QuizSTU</h4>
      <Nav className="flex-column navbar">
        <Nav.Link className='navbar-item' href="#">
          <FontAwesomeIcon className='nav-icon' icon={faHouse} />
          Thư viện của tôi
        </Nav.Link>
        <Nav.Link className='navbar-item' onClick={() => navigate('/personal/exams/favorite-exams')}>
          <FontAwesomeIcon className='nav-icon' icon={faHeart} />
          Đề thi yêu thích
          </Nav.Link>
        <Nav.Link className='navbar-item' href="#">
          <FontAwesomeIcon className='nav-icon' icon={faList} />
          Kết quả thi
        </Nav.Link>
        <Nav.Link className='navbar-item' onClick={() => navigate('/workspace/exams/list')}>
          <FontAwesomeIcon className='nav-icon' icon={faSliders} />
          Quản lý đề thi
        </Nav.Link>
        <Nav.Link className='navbar-item'>
          <FontAwesomeIcon className='nav-icon' icon={faGear} />
          Cài đặt
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
