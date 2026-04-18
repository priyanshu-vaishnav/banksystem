import { Link } from "react-router-dom";
import "../assets/Home.css";

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-badge">Banking made simple</span>
          <h1>TruePay helps you manage money with confidence.</h1>
          <p>
            Open an account, send funds instantly, review transactions, and
            stay in control of your finances from one modern banking dashboard.
          </p>
          <div className="home-actions">
            <Link className="btn btn-primary home-btn" to="/register">
              Get Started
            </Link>
            <Link className="btn btn-outline-secondary home-link" to="/login">
              Login
            </Link>
          </div>
        </div>

        <div className="home-hero-cards">
          <div className="hero-card">
            <h3>Secure access</h3>
            <p>Protected login, trusted sessions, and encrypted transactions.</p>
          </div>
          <div className="hero-card">
            <h3>Instant transfers</h3>
            <p>Send money fast across accounts with a few clicks.</p>
          </div>
          <div className="hero-card">
            <h3>Smart insights</h3>
            <p>Track spending, review activity, and stay informed.</p>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="feature-item">
          <span className="feature-icon">🏦</span>
          <h2>Open an account easily</h2>
          <p>Register and start using your TruePay account in minutes.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">⚡</span>
          <h2>Send money instantly</h2>
          <p>Transfer funds quickly with clear status and transaction history.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔒</span>
          <h2>Trusted banking</h2>
          <p>Keep your account safe with secure authentication and controls.</p>
        </div>
      </section>

      <section className="home-details">
        <div className="home-details-copy">
          <h2>Designed for everyday banking needs</h2>
          <p>
            Whether you're paying bills, moving funds, or checking balances, TruePay
            helps make each step more intuitive and reliable.
          </p>
        </div>

        <div className="home-steps">
          <div className="step-card">
            <strong>1.</strong>
            <h3>Create your account</h3>
            <p>Sign up and verify your profile to begin banking instantly.</p>
          </div>
          <div className="step-card">
            <strong>2.</strong>
            <h3>Fund your wallet</h3>
            <p>Top up your balance and prepare for payments and transfers.</p>
          </div>
          <div className="step-card">
            <strong>3.</strong>
            <h3>Track every transaction</h3>
            <p>Review history, status, and activity from one dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
