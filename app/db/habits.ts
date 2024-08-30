import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { addPoints } from './balances';

const addHabit = (habit) => {
    addDoc(collection(db, "habits"), {
        name: habit.name,
        time: habit.time,
        points: +habit.points,
        status: 'pending'
    });
};

const getAllHabits = async () => {
    try {
        const habitsCol = collection(db, 'habits');
        const habitSnapshot = await getDocs(habitsCol);
        const habitList = habitSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        return habitList;
      } catch (error) {
        console.error('Error al obtener los hábitos:', error);
        return [];
      }
};

const deleteHabit = (item) => {
    deleteDoc(doc(db, "habits", item.id));
};

const markHabitAsDone = (item) => {
    const habitDocRef = doc(db, 'habits', item.id);

    updateDoc(habitDocRef, {
        name: item.name,
        time: item.time,
        points: +item.points,
        status: 'done'
    });

    addPoints(item)
}


export { addHabit, getAllHabits, deleteHabit, markHabitAsDone }