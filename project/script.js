// ฟังก์ชันหมุนรถ
function rotateCar(car) {
    let rotation = 0;
    const initialPosition = car.getAttribute('position');
    const initialRotation = car.getAttribute('rotation');

    // สร้าง interval สำหรับการหมุน
    const rotateInterval = setInterval(() => {
        rotation += 1;
        car.setAttribute('rotation', `0 ${rotation} 0`);

        if (rotation >= 360) {
            rotation = 0;
        }
    }, 16);

    // ส่งค่า interval กลับเพื่อใช้ในการหยุดการหมุน
    return {
        interval: rotateInterval,
        resetPosition: () => {
            car.setAttribute('position', initialPosition);
            car.setAttribute('rotation', initialRotation);
        }
    };
}

//////////////////////////// pop-up function ////////////////////////////////
const popup = document.querySelector('#popup');
const popupTitle = document.querySelector('#popup-title');
const popupModel = document.querySelector('#popup-model');
const popupYear = document.querySelector('#popup-year');
const popupPrice = document.querySelector('#popup-price');
const popupColor = document.querySelector('#popup-color');
const camera = document.querySelector('a-camera');
const MAX_DISTANCE = 9;

let pointerLocked = false;
let currentRotation = null; // เก็บข้อมูลการหมุนปัจจุบัน

// เพิ่ม event listener สำหรับรถทุกคัน
document.querySelectorAll('.clickable').forEach(car => {
    car.addEventListener('click', function () {
        const carPosition = new THREE.Vector3();
        car.object3D.getWorldPosition(carPosition);

        const cameraPosition = new THREE.Vector3();
        camera.object3D.getWorldPosition(cameraPosition);

        const distance = carPosition.distanceTo(cameraPosition);

        if (distance <= MAX_DISTANCE) {
            // ดึงข้อมูลรถ
            const model = car.getAttribute('data-model');
            const year = car.getAttribute('data-year');
            const price = car.getAttribute('data-price');
            const color = car.getAttribute('data-color');

            // อัปเดตเนื้อหา popup
            popupTitle.textContent = 'Car Details';
            popupModel.textContent = `Model: ${model}`;
            popupYear.textContent = `Year: ${year}`;
            popupPrice.textContent = `Price: ${price}`;
            popupColor.textContent = `Color: ${color}`;

            // แสดง popup และเริ่มหมุนรถ
            popup.style.display = 'block';
            currentRotation = rotateCar(car);
            car.classList.add('no-click'); // ป้องกันการคลิกซ้ำ
            disablePointerLock();
        } else {
            console.log(`Too far to interact with the car. Distance: ${distance.toFixed(2)} meters`);
        }
    });
});

// ฟังก์ชันปิด popup
function closePopup() {
    if (currentRotation) {
        clearInterval(currentRotation.interval); // หยุดการหมุน
        currentRotation.resetPosition(); // รีเซ็ตตำแหน่งรถ
        currentRotation = null;
    }

    popup.style.display = 'none';
    document.querySelectorAll('.clickable').forEach(car => {
        car.classList.remove('no-click'); // เปิดใช้งานการคลิกอีกครั้ง
    });
    enablePointerLock();
}

function disablePointerLock() {
    document.exitPointerLock();
    pointerLocked = false;
}

function enablePointerLock() {
    const scene = document.querySelector('a-scene');
    scene.requestPointerLock();
    pointerLocked = true;
}

// Event listeners สำหรับการปิด popup
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && popup.style.display === 'block') {
        closePopup();
    }
});

document.querySelector('.close-btn').addEventListener('click', closePopup);