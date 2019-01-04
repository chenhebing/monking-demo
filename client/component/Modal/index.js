import React, { Component } from 'react';

import { className } from './index.css';

class Modal extends Component {
    render () {
        const { title, btnText, children, disable, visible, close, submit } = this.props;
        return (
            <div className={className} style={{display: !visible && 'none'}}>
                <div className="container">
                    <div className="title">{title}</div>
                    {children}
                    <div className={`btn ${disable && 'disable'}`} onClick={submit}>{btnText}</div>
                    <div className="close" onClick={close}>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
