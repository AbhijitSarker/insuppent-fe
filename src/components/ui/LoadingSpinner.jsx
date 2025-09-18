export const LoadingSpinner = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // Full viewport height
            width: '100vw',  // Full viewport width
            position: 'fixed',
            top: 0,
            left: 0,
            background: 'rgba(0, 0, 0, 0.1)', // Optional: slight overlay
        }}>
            <div style={{
                border: '4px solid #8B4513', // Brown color
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                animation: 'spin 1s linear infinite'
            }}>
                <style>
                    {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
                </style>
            </div>
        </div>
    );
};
