import React, { useState, useEffect } from 'react'
import './DinoPopup.css' // Gọi file CSS phép thuật vào đây

export const DinoPopup = ({ dinoId, onClose }) => {
    const [isClosing, setIsClosing] = useState(false)

    // Khai báo data: tao đã gắn chuẩn các theme --triassic, --cretaceous theo CSS của mày
    const info = {
        Dino1: {
            name: 'PLATEOSAURUS',
            era: 'KỶ TRIAS',
            time: '214 triệu năm trước',
            theme: 'triassic', // Đổi màu viền cam
            desc: 'Đại diện tiêu biểu của thời kỳ đầu kỷ nguyên khủng long. Thân hình to lớn, đuôi dài giúp giữ thăng bằng khi đứng bằng hai chân sau để ăn lá trên cao.',
            stats: [
                { label: 'Chế độ ăn', value: 'Ăn cỏ' },
                { label: 'Chiều dài', value: '5 - 10 mét' }
            ]
        },
        Dino2: {
            name: 'TYRANNOSAURUS REX',
            era: 'KỶ PHẤN TRẮNG',
            time: '68 triệu năm trước',
            theme: 'cretaceous', // Đổi màu viền vàng
            desc: 'Kẻ săn mồi tối thượng với bộ hàm có lực cắn vỡ vụn xương con mồi. Biểu tượng quyền lực nhất của thế giới tiền sử.',
            stats: [
                { label: 'Chế độ ăn', value: 'Ăn thịt' },
                { label: 'Lực cắn', value: '35,000 Newton' }
            ]
        },
        Dino3: {
            name: 'TRICERATOPS',
            era: 'KỶ PHẤN TRẮNG',
            time: '68 triệu năm trước',
            theme: 'cretaceous',
            desc: 'Cỗ xe tăng sống với ba chiếc sừng nhọn hoắt và lá chắn cổ bằng xương vững chắc. Kẻ thù truyền kiếp của T-Rex.',
            stats: [
                { label: 'Chế độ ăn', value: 'Ăn thực vật' },
                { label: 'Vũ khí', value: '3 sừng nhọn' }
            ]
        }
    }

    const data = info[dinoId] || info['Dino1']

    // 👉 BÍ KÍP: Giữ lại để chạy animation lúc đóng (0.28s) trước khi tắt hẳn
    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            onClose()
        }, 280) // Khớp đúng với thời gian animation dinosaurPopupExit
    }

    return (
        <div className={`dinosaur-popup dinosaur-popup--${data.theme} ${isClosing ? 'dinosaur-popup--closing' : ''}`}>

            {/* Nút Đóng */}
            <div className="dinosaur-popup__close">
                <button className="close-button" onClick={handleClose}>
                    <span className="close-button__symbol">×</span>
                </button>
            </div>

            {/* Nội dung Popup */}
            <div className="dinosaur-popup__content">

                {/* Header: Chứa Thời đại, Tên, Năm */}
                <div className="dinosaur-popup__header">
                    <div className="dinosaur-popup__era">{data.era}</div>
                    <h1 className="dinosaur-popup__title">{data.name}</h1>
                    <h3 className="dinosaur-popup__subtitle">⏳ {data.time}</h3>
                </div>

                {/* Nội dung miêu tả */}
                <div className="dinosaur-popup__section">
                    <p className="dinosaur-popup__description">{data.desc}</p>
                </div>

                {/* Bảng chỉ số (Stats) */}
                <div className="dinosaur-popup__stats">
                    {data.stats.map((stat, index) => (
                        <div key={index} className="dinosaur-popup__stat">
                            <span>{stat.label}</span>
                            <strong>{stat.value}</strong>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}