const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4RBlTK8JrWKFDbexVzgZkvtWJLqZHrUM",
    authDomain: "web2024-8fd47.firebaseapp.com",
    projectId: "web2024-8fd47",
    storageBucket: "web2024-8fd47.firebasestorage.app",
    messagingSenderId: "427979045789",
    appId: "1:427979045789:web:a700606152494a4b404d74",
    measurementId: "G-WVXXZPS4SV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Main App Component
class App extends React.Component {
    state = {
        students: [],
        stdid: "",
        stdtitle: "",
        stdfname: "",
        stdlname: "",
        stdemail: "",
        stdphone: "",
        user: null,
    };

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ user: user ? user.toJSON() : null });
        });
    }

    google_login() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().signInWithPopup(provider);
    }

    google_logout() {
        if (confirm("Are you sure?")) {
            firebase.auth().signOut();
        }
    }

    readData() {
        db.collection("students")
            .get()
            .then((querySnapshot) => {
                var students = [];
                querySnapshot.forEach((doc) => {
                    students.push({ id: doc.id, ...doc.data() });
                });
                this.setState({ students });
            });
    }

    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
            var students = [];
            querySnapshot.forEach((doc) => {
                students.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students });
        });
    }

    insertData() {
        db.collection("students").doc(this.state.stdid).set({
            title: this.state.stdtitle,
            fname: this.state.stdfname,
            lname: this.state.stdlname,
            phone: this.state.stdphone,
            email: this.state.stdemail,
        });
    }

    edit(std) {
        this.setState({
            stdid: std.id,
            stdtitle: std.title,
            stdfname: std.fname,
            stdlname: std.lname,
            stdemail: std.email,
            stdphone: std.phone,
        });
    }

    delete(std) {
        if (confirm("ต้องการลบข้อมูล?")) {
            db.collection("students").doc(std.id).delete();
        }
    }

    render() {
        return (
            <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">Work6 : Firebase</h1>
                <LoginBox user={this.state.user} app={this} />

                <div className="flex space-x-4 my-4">
                    <button onClick={() => this.readData()} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Read Data
                    </button>
                    <button onClick={() => this.autoRead()} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Auto Read
                    </button>
                </div>

                <StudentTable data={this.state.students} app={this} />

                <div className="bg-gray-100 p-4 rounded-md mt-4">
                    <h2 className="text-lg font-semibold mb-2">เพิ่ม/แก้ไขข้อมูล นักศึกษา :</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput label="ID" app={this} value="stdid" />
                        <TextInput label="คำนำหน้า" app={this} value="stdtitle" />
                        <TextInput label="ชื่อ" app={this} value="stdfname" />
                        <TextInput label="สกุล" app={this} value="stdlname" />
                        <TextInput label="Email" app={this} value="stdemail" />
                        <TextInput label="Phone" app={this} value="stdphone" />
                    </div>
                    <button onClick={() => this.insertData()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

// Student Table Component
function StudentTable({ data, app }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="p-2 border">รหัส</th>
                        <th className="p-2 border">คำนำหน้า</th>
                        <th className="p-2 border">ชื่อ</th>
                        <th className="p-2 border">สกุล</th>
                        <th className="p-2 border">email</th>
                        <th className="p-2 border">phone</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((s) => (
                        <tr className="border" key={s.id}>
                            <td className="p-2 border">{s.id}</td>
                            <td className="p-2 border">{s.title}</td>
                            <td className="p-2 border">{s.fname}</td>
                            <td className="p-2 border">{s.lname}</td>
                            <td className="p-2 border">{s.email}</td>
                            <td className="p-2 border">{s.phone}</td>
                            <td className="p-2 border space-x-2">
                                <button onClick={() => app.edit(s)} className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                                    แก้ไข
                                </button>
                                <button onClick={() => app.delete(s)} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                                    ลบ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// TextInput Component
function TextInput({ label, app, value }) {
    return (
        <div>
            <label className="block text-gray-700">{label}</label>
            <input
                className="w-full p-2 border rounded-md"
                value={app.state[value]}
                onChange={(ev) => app.setState({ [value]: ev.target.value })}
            />
        </div>
    );
}

// Login Box Component
function LoginBox({ user, app }) {
    return user ? (
        <div className="text-center">
            <img src={user.photoURL} className="w-12 h-12 rounded-full mx-auto" />
            <p>{user.email}</p>
            <button onClick={() => app.google_logout()} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Logout
            </button>
        </div>
    ) : (
        <button onClick={() => app.google_login()} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Login
        </button>
    );
}

// Render App
const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
