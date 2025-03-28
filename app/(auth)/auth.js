import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDoc, doc, getDoc } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyALj18qlpuAOn64Bj8RB3VqrqQZFtQfTbk",
    authDomain: "moodbuddy-3d25f.firebaseapp.com",
    projectId: "moodbuddy-3d25f",
    storageBucket: "moodbuddy-3d25f.firebasestorage.app",
    messagingSenderId: "318813296296",
    appId: "1:318813296296:web:aeab8fb496e08ee2e1949d",
    measurementId: "G-NTRL0GBCZL"
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });

export { app, auth, db };

export const signup = async (values) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        const emailLower = values.email.toLowerCase();
        await AsyncStorage.setItem('user', JSON.stringify({ 
            uid: user.uid, 
            username: values.username,
            email: emailLower,
        }));

        await setDoc(doc(db, 'users',user.uid), {
            uid: user.uid,
            username: values.username,
            fullname: values.fullname,
            email: emailLower,
            dob: values.dob,
            gender: values.gender,
        });

        await updateProfile(user, {
            displayName: values.username
        })

        
        console.log('User added!');
        return user;
    } catch (error) {
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = await fetchUserData(user.uid);
        await AsyncStorage.setItem('user', JSON.stringify({ 
            uid: user.uid, 
            username: userData.username,
            email: userData.email,
        }));

        console.log('User logged in!', user);
        return user; 
    } catch (error) {
        throw error;
    }
};

export const fetchUserData = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            throw new Error('No such user found!');
        }
    } catch (error) {
        throw error; 
    }
};

export const updateUserMBTI = async (userId, mbtiResult) => {
    try {
        await setDoc(doc(db, 'users', userId), { mbti: mbtiResult }, { merge: true });
        console.log('User MBTI updated!');
    } catch (error) {
        throw error;
    }
};

