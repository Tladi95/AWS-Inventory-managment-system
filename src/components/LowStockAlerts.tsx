import React from 'react';
import type { LowStockAlert } from '../types/Product';

interface LowStockAlertsProps {
  alerts: LowStockAlert[];
  onDismiss: (productId: string) => void;
}

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({
  alerts,
  onDismiss,
}) => {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="low-stock-alerts">
      <div className="alerts-header">
        <h3>Low Stock Alerts ({alerts.length})</h3>
      </div>
      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.productId} className="alert-item">
            <div className="alert-content">
              <strong>{alert.productName}</strong>
              <p>
                Current stock: <strong>{alert.currentQuantity}</strong> units
                (threshold: {alert.threshold})
              </p>
            </div>
            <button
              className="btn-dismiss"
              onClick={() => onDismiss(alert.productId)}
              title="Dismiss alert"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
