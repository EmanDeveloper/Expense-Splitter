import { useState } from "react";

const Home = () => {
    const [persons, setPersons] = useState([{ name: "", amount: "" }]);

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        setPersons(persons.map((person, i) =>
            i === index ? { ...person, [name]: value } : person
        ));
    };

    const addPerson = () => {
        setPersons([...persons, { name: "", amount: "" }]);
    };

    const calculateSettlement = () => {
        let updatedPersons = persons.map(person => {
            let amount = 0;
            try {
                amount = new Function(`return ${person.amount}`)();
            } catch (error) {
                amount = 0;
            }
            return { ...person, amount: Number(amount) || 0 };
        });

        const totalAmount = updatedPersons.reduce((sum, person) => sum + person.amount, 0);
        const numPersons = updatedPersons.length;
        const fairShare = totalAmount / numPersons;

        let balances = updatedPersons.map(person => ({
            name: person.name,
            balance: person.amount - fairShare
        }));

        let owes = balances.filter(person => person.balance < 0);
        let receivers = balances.filter(person => person.balance > 0);

        let transactions = [];
        let i = 0, j = 0;

        while (i < owes.length && j < receivers.length) {
            let owedPerson = owes[i];
            let receivingPerson = receivers[j];

            let amountToPay = Math.min(Math.abs(owedPerson.balance), receivingPerson.balance);

            transactions.push(
                `${owedPerson.name} pays ${receivingPerson.name} $${amountToPay.toFixed(2)}`
            );

            owedPerson.balance += amountToPay;
            receivingPerson.balance -= amountToPay;

            if (owedPerson.balance === 0) i++;
            if (receivingPerson.balance === 0) j++;
        }

        return { totalAmount, fairShare, transactions };
    };

    const handleSubmit = () => {
        const result = calculateSettlement();
        alert(`Total Amount: ${result.totalAmount}\nEach person should contribute: ${result.fairShare.toFixed(2)}\n\n${result.transactions.join("\n")}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-[#191922]"> {/* Soft gray background */}
        <div className="shadow-md shadow-gray-300 rounded-lg p-6 w-full max-w-lg bg-[#14141f]"> {/* Ensures background works */}
            <h2 className="text-2xl font-semibold text-center mb-4 ">Expense Splitter</h2>
            
            {persons.map((person, index) => (
                <div key={index} className="mb-4 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={person.name}
                        onChange={(e) => handleChange(index, e)}
                        className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]" 
                    />
                    <input
                        type="text"
                        name="amount"
                        placeholder="Enter amount (e.g. 10+20)"
                        value={person.amount}
                        onChange={(e) => handleChange(index, e)}
                        className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]" 
                    />
                </div>
            ))}
    
            <div className="flex flex-col md:flex-row justify-between mt-4 space-y-2 md:space-y-0 md:space-x-2">
                <button 
                    onClick={addPerson} 
                    className="bg-[#2563eb] hover:bg-[#1e40af] text-white px-4 py-2 rounded-lg shadow-md transition w-full md:w-auto">
                    Add More
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-lg shadow-md transition w-full md:w-auto">
                    Calculate
                </button>
            </div>
        </div>
    </div>
    
    );
};

export default Home;