import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/Setting.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Setting() {

const navigate = useNavigate();
    const handleDelete = async () => {
        const res = await axios.delete(`http://localhost:3000/api/account/deleteaccount`, { withCredentials: true });
        console.log(res.data);
        navigate("/login");

    }
    return (
        <div className="setting-menu p-4">

            <Link to="/transaction" className="btn btn-outline-primary mb-3 w-100">
                My Transactions
            </Link>

            <Link to="/account-control" className="btn btn-outline-secondary mb-3 w-100">
                Account Control
            </Link>

            <button
                className="btn btn-danger w-100"
                data-bs-toggle="modal"
                data-bs-target="#deleteModal"
            >
                Delete Account
            </button>


            {/* Bootstrap Modal */}
            <div
                className="modal fade"
                id="deleteModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title text-danger">
                                Delete Account
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>

                        <div className="modal-body">
                            This action is permanent. All account data will be removed and cannot be recovered.
                            Please confirm if you want to continue.
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                Confirm Delete
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default Setting
