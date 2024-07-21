import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentNav.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const PaymentNav = ({ title }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one page in history
  };

  return (
    <nav>
      <div className="container-fluid p-3 header-container">
        <div className="row header py-2">
          <div className="col-1">
            <div className="menu-icon" id="back_btn" onClick={handleGoBack}>
              <svg
                width="19"
                height="16"
                viewBox="0 0 19 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.556 7.847H1M7.45 1L1 7.877l6.45 6.817"
                  stroke="#000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                ></path>
              </svg>
            </div>
          </div>
          <div className="col-8">
            <div className="menu-logo">
              <h4 className="mb-0 mt-1 ms-2">{title}</h4>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default PaymentNav