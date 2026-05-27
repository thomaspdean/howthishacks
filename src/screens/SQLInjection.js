import React from 'react';

export default function SQLInjection() {
  return (
    <div className="technique-layout">

      <div className="technique-header">
        <h1>SQL Injection</h1>
        <p>
          Type a payload into the login form below and watch how the injected SQL
          manipulates the database query at each step.
        </p>
      </div>

      <div className="input-panel">
        <span className="panel-label">{'// input'}</span>
        <div className="placeholder-box">
          [ payload input form ]
        </div>
        <span className="panel-label">{'// explanation'}</span>
        <div className="placeholder-box" style={{ minHeight: 160 }}>
          [ step explanation ]
        </div>
      </div>

      <div className="animation-canvas">
        <div className="canvas-placeholder">
          <div>[ animation canvas ]</div>
          <div style={{ marginTop: 8, fontSize: 11 }}>
            query flow visualization will render here
          </div>
        </div>
      </div>

      <div className="step-controls">
        <span className="controls-placeholder">[ ◀ prev ]</span>
        <span className="controls-placeholder" style={{ flex: 1, textAlign: 'center' }}>
          step 0 / 0
        </span>
        <span className="controls-placeholder">[ next ▶ ]</span>
      </div>

    </div>
  );
}
