import { db } from '../../firebaseConfig';
import {doc, updateDoc, getDoc } from "firebase/firestore";

const my_id = '47w7K9ToUConDowofVUr'

const addPoints = async (item) => {
    const balanceRef = doc(db, 'balances', my_id);
    const balance = await getDoc(balanceRef)
    const current_balance = balance.data().balance;
    updateDoc(balanceRef, {
        balance: current_balance + item.points
    });
}

const buyReward = async (item) => {
    const balanceRef = doc(db, 'balances', my_id);
    const balance = await getDoc(balanceRef)
    const current_balance = balance.data().balance;

    if(item.cost > current_balance){
        console.error("Not enough balance")
        return
    }

    updateDoc(balanceRef, {
        balance: current_balance - item.cost
    });
};

const getBalance = async () => {
    const balanceRef = doc(db, 'balances', my_id);
    const balance = await getDoc(balanceRef)
    return balance.data().balance;
};

export { addPoints, buyReward, getBalance }