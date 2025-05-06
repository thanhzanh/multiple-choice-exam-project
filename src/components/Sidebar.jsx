import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faList, faSliders, faGear } from '@fortawesome/free-solid-svg-icons';
import { SettingsContext } from '../SettingsContext'; 

const Sidebar = () => {

  const navigate = useNavigate(); // dieu huong
  const location = useLocation();
  const { logoName } = useContext(SettingsContext);

  // Kiem tra duong dan hien tai
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="bg-light p-3 inner-sidebar" style={{ height: '130vh', width: '250px' }}>
      <h4 className="logo" style={{ cursor: "pointer" }} onClick={()=> navigate('/workspace/exams/list')}>{ logoName }</h4>
      <Nav className="flex-column navbar">
        <Nav.Link className={`navbar-item ${isActive('/personal/exams/favorite-exams')}`} onClick={() => navigate('/personal/exams/favorite-exams')}>
          <FontAwesomeIcon className='nav-icon' icon={faHeart} />
          Đề thi yêu thích
          </Nav.Link>
        <Nav.Link className={`navbar-item ${isActive('/personal/exams/my-results')}`} onClick={() => navigate('/personal/exams/my-results')}>
          <FontAwesomeIcon className='nav-icon' icon={faList} />
          Kết quả thi của tôi
        </Nav.Link>
        <Nav.Link className={`navbar-item ${isActive('/workspace/exams/list')}`} onClick={() => navigate('/workspace/exams/list')}>
          <FontAwesomeIcon className='nav-icon' icon={faSliders} />
          Quản lý đề thi
        </Nav.Link>
        <Nav.Link className={`navbar-item ${isActive('/settings')}`} onClick={() => navigate('/settings')}>
          <FontAwesomeIcon className='nav-icon' icon={faGear} />
          Cài đặt
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
