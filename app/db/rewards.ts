import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const addReward = (reward) => {
    addDoc(collection(db, "rewards"), {
        name: reward.name,
        cost: +reward.cost
    });
};

const getAllRewards = async () => {
    try {
        const rewardsCol = collection(db, 'rewards');
        const rewardSnapshot = await getDocs(rewardsCol);
        const rewardList = rewardSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        return rewardList;
      } catch (error) {
        console.error('Error al obtener los hábitos:', error);
        return [];
      }
};

const deleteReward = (item) => {
    deleteDoc(doc(db, "rewards", item.id));
};

export { addReward, getAllRewards, deleteReward }