export const Crosshair = () => {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '6px',
            height: '6px',
            backgroundColor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.5)', // Viền đen mờ để chống chìm vào nền sáng
            borderRadius: '50%', // Bo tròn thành dấu chấm
            transform: 'translate(-50%, -50%)', // Căn chuẩn tâm
            zIndex: 100, // Nổi lên trên cùng

            // Bắt buộc phải có dòng này để click chuột xuyên qua tâm ngắm
            pointerEvents: 'none'
        }} />
    )
}