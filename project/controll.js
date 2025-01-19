//////////////////////////////////// ฟังก์ชันหมุนรถ ///////////////////////////////////////////
function rotateCar(car) {
    let rotation = 0; // เริ่มต้นที่การหมุน 0 องศา

    // บันทึกตำแหน่งและการหมุนเริ่มต้นของรถ
    const initialPosition = car.getAttribute('position');
    const initialRotation = car.getAttribute('rotation');
    const rotateInterval = setInterval(() => {
        rotation += 1; // เพิ่มค่าการหมุน 1 องศาทุกๆ 16ms (ประมาณ 60 fps)
        car.setAttribute('rotation', `0 ${rotation} 0`); // ตั้งค่าการหมุนในแกน Y (หมุนรอบแนวตั้ง)

        // จำกัดการหมุนที่ 360 องศา แล้วเริ่มหมุนใหม่
        if (rotation >= 360) {
            rotation = 0;
        }
    }, 16); // ทุกๆ 16ms (ประมาณ 60 ครั้งต่อวินาที)

    // ส่งฟังก์ชันเพื่อหยุดหมุนและรีเซ็ตเมื่อ popup ถูกปิด
    return function stopAndResetRotation() {
        clearInterval(rotateInterval); // หยุดการหมุน
        car.setAttribute('rotation', initialRotation); // รีเซ็ตตำแหน่งการหมุน
        console.log('Rotation reset to:', initialRotation);
    };
}

////////////////////////// popup function //////////////////////////////////////////////

const popup = document.querySelector('#popup');
const popupTitle = document.querySelector('#popup-title');
const popupModel = document.querySelector('#popup-model');
const popupYear = document.querySelector('#popup-year');
const popupPrice = document.querySelector('#popup-price');
const popupColor = document.querySelector('#popup-color');
const camera = document.querySelector('a-camera'); // กล้องใน scene
const MAX_DISTANCE = 12; // กำหนดระยะห่างสูงสุดที่อนุญาตให้คลิกได้ (หน่วย: เมตร)

let stopRotationFunction = null; // ตัวแปรสำหรับจัดเก็บฟังก์ชันหยุดหมุน

// ฟังก์ชันปิด pop-up
function closePopup() {
    console.log('Closing popup.');
    popup.style.display = 'none';

    // ถ้ามีการหมุนอยู่ ให้หยุดหมุนและรีเซ็ต
    if (stopRotationFunction) {
        stopRotationFunction();
        stopRotationFunction = null; // รีเซ็ตตัวแปร
    }
}

// เพิ่ม event listener ให้กับโมเดลรถทั้งหมด
document.querySelectorAll('.clickable').forEach(car => {
    car.addEventListener('click', function () {
        console.log(`Clicked on car:`, car); // ตรวจสอบว่ารถที่คลิกมีข้อมูลหรือไม่

        // ตรวจสอบว่า popup กำลังแสดงอยู่หรือไม่
        if (popup.style.display === 'block') {
            console.log('Popup is open. Closing popup.');
            closePopup(); // หาก popup แสดงอยู่ ให้ปิด popup
            return; // ออกจากฟังก์ชันเพื่อไม่ต้องแสดง popup ใหม่
        }

        const carPosition = new THREE.Vector3();
        car.object3D.getWorldPosition(carPosition); // ตำแหน่งของรถ

        const cameraPosition = new THREE.Vector3();
        camera.object3D.getWorldPosition(cameraPosition); // ตำแหน่งของกล้อง

        const distance = carPosition.distanceTo(cameraPosition); // คำนวณระยะห่าง
        console.log(`Distance to car: ${distance.toFixed(2)} meters`);

        if (distance <= MAX_DISTANCE) {
            console.log('Within distance. Showing popup.');

            // ดึงข้อมูลจาก data-* attribute ของรถที่คลิก
            const model = car.getAttribute('data-model');
            const year = car.getAttribute('data-year');
            const price = car.getAttribute('data-price');
            const color = car.getAttribute('data-color');

            console.log('Car data:', { model, year, price, color });

            // อัปเดตเนื้อหาใน pop-up
            popupTitle.textContent = 'Car Details';
            popupModel.textContent = `Model: ${model}`;
            popupYear.textContent = `Year: ${year}`;
            popupPrice.textContent = `Price: ${price}`;
            popupColor.textContent = `Color: ${color}`;

            // แสดง pop-up
            popup.style.display = 'block';
            console.log('Popup displayed.');

            // เรียกฟังก์ชันหมุนรถ และเก็บฟังก์ชันหยุดหมุนในตัวแปร
            stopRotationFunction = rotateCar(car);
        } else {
            console.log(`Too far to interact with the car. Distance: ${distance.toFixed(2)} meters`);
        }
    });
});

// ปิด popup เมื่อกดปุ่ม Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && popup.style.display === 'block') {
        console.log('Escape pressed. Closing popup.');
        closePopup();
    }
});

// เพิ่ม event listener ให้ปุ่ม X บน popup
document.querySelector('.close-btn').addEventListener('click', () => {
    console.log('Close button clicked. Closing popup.');
    closePopup();
});