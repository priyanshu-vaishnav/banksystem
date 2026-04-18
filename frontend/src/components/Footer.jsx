import React from "react";
import "../assets/Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-brand">TruePay</span>
        <span className="footer-divider">|</span>
        <span className="footer-copy">&copy; {year} All rights reserved.</span>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;