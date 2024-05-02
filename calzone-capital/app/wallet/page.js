"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '/components/Sidebar';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Card from '/components/Card';
import AddCreditsModal from '/components/AddCreditsModal';
import { useSession } from "next-auth/react";


const createOrder = (data, actions, amount) => {
    const formattedAmount = Number(amount).toFixed(2).toString();

    console.log('Formatted amount to be charged:', formattedAmount);

    return actions.order.create({
        purchase_units: [
            {
                amount: {
                    value: formattedAmount,
                },
            },
        ],
    });
};

const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
        alert("Transaction completed by " + details.payer.name.given_name);
    });
};

const ButtonWrapper = ({ amount }) => {
    useEffect(() => {
        console.log('Amount to be charged:', amount);
    }, [amount]);

    return (
        <>
            {amount && <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => createOrder(data, actions, amount)}
                onApprove={onApprove}
            />}
        </>
    );
};

const Wallet = () => {
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
  
    useEffect(() => {
      if (session) {
        fetchUserData();
      }
    }, [session]);
  
    const fetchUserData = async () => {
        if (session && session.user && session.user.email) {
          const userEmail = session.user.email;
          const flaskApiUrl = `http://localhost:5000/userInfo?email=${encodeURIComponent(userEmail)}`;
          const response = await fetch(flaskApiUrl);
          if (!response.ok) {
            console.error('Failed to get user info');
            return;
          }
          const data = await response.json();
          setBalance(data.balance);
        } else {
          console.log('Session or user email not found');
        }
      };
      
    const addVirtualCredits = async () => {
        const newBalance = await updateBalance(balance + Number(amount));
        setBalance(newBalance);
        setAmount('');
    };

    const handleCredictClick = () => {
        setIsModalOpen(true);
    };

    const updateBalance = async (userEmail, amountToAdd) => {
        try {
          const parsedAmount = parseFloat(amountToAdd);
          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            throw new Error('Invalid amount');
          }
          const response = await fetch('http://localhost:5000/balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, amount: parsedAmount }),
          });
          if (!response.ok) {
            throw new Error('Failed to update balance');
          }
          const { balance } = await response.json();
          setBalance(balance);
        } catch (error) {
          console.error('Error updating balance:', error);
        }
      };
      
    
  return (
    <PayPalScriptProvider options={{ "client-id": "AdPCfwg-pBb-xFwKt73vyzuEFekQPjHUrB6vXZHPrdmQd4LrgfkvloI1-Dbj-jtQegZMh2U21R0ALIor", currency: "USD" }}>
      <main className="flex min-h-screen bg-[#ffffff]">
        <Sidebar />
        <section className='w-4/5 h-full p-10 overflow-y-auto bg-gray'>
                <h1 className='text-black mb-5 text-4xl pt-14 pl-5'>Wallet</h1>
            <Card>
                <h2 className="text-2xl mt-1 mb-5">Balance: ${balance}</h2>
                <button 
                    className='px-6 py-2 rounded bg-[#38bfc3] text-white hover:bg-transparent hover:text-[#38bfc3] border  hover:border-[#38bfc3] relative'
                    onClick={handleCredictClick}
                >
                    Add Credits
                </button>
                    <AddCreditsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    style={{ padding: '20px', width: '90%', maxWidth: '1200px' }}
                    >
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            addVirtualCredits();
                        }} className="space-y-4">
                            <input
                                type="number"
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount to Add"
                                className="w-full px-2 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#38bfc3] focus:border-transparent"
                            />
                            <div className='flex justify-between space-x-2 mt-4'> {/* Adjust the spacing and margin */}
                                <button type="button" className="flex-1 bg-[#38bfc3] text-white rounded-lg hover:bg-[#2a929b] focus:outline-none focus:ring-2 focus:ring-[#2a929b] transition">
                                    Set Amount
                                </button>
                                <button onClick={addVirtualCredits} className="flex-1 py-2 bg-[#38bfc3] text-white rounded-lg hover:bg-[#2a929b] focus:outline-none focus:ring-2 focus:ring-[#2a929b] transition">
                                    Add Credits
                                </button>
                            </div>
                            <ButtonWrapper amount={amount} />
                        </form>
                    </AddCreditsModal>
            </Card>
        </section>
      </main>
    </PayPalScriptProvider>
  );
};

export default Wallet;
