import React, { useState } from 'react'
import axios from 'axios'
import '../assets/accountControl.css'


function AccountControl() {

    const [loading, setLoading] = useState(false)
    const [msg, setMessage] = useState("")
    const [isError, setIsError] = useState(false)

    const requestHandler = async (method, url) => {
        try {
            setLoading(true)

            const res = await axios({
                method,
                url,
                withCredentials: true
            })

            setIsError(false)
            setMessage(res.data.message)

        } catch (err) {

            setMessage(err.response?.data?.message || "Something went wrong")
            setIsError(true)
        } finally {
            setLoading(false)
            setTimeout(() => {
                setMessage("")
            }, 2000);
        }
    }

    return (

        <div className="account-wrapper">

            <div className="account-card">
                {isError ? <h4 className='errormsg'>{msg}</h4> : <h4 className='successmsg'>{msg}</h4>}

                <h2>Account Control Panel</h2>
                <p className="sub-text">
                    Manage your account security and lifecycle settings.
                </p>

                <div className="action-section">

                    <div className="action-card normal">
                        <h4>Freeze Account</h4>
                        <p>Temporarily block outgoing transactions.</p>
                        <button
                            disabled={loading}
                            onClick={() =>
                                requestHandler("patch", "http://localhost:3000/api/account/freezeaccount")
                            }
                        >
                            Freeze
                        </button>
                    </div>

                    <div className="action-card normal">
                        <h4>Unfreeze Account</h4>
                        <p>Restore account activity.</p>
                        <button
                            disabled={loading}
                            onClick={() =>
                                requestHandler("patch", "http://localhost:3000/api/account/unfreezeaccount")
                            }
                        >
                            Unfreeze
                        </button>
                    </div>

                    <div className="action-card danger">
                        <h4>Close Account</h4>
                        <p>This action is permanent and cannot be reversed.</p>
                        <button
                            disabled={loading}
                            onClick={() =>
                                requestHandler("delete", "http://localhost:3000/api/account/closeaccount")
                            }
                        >
                            Close Account
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default AccountControl
