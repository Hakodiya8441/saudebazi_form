function calculateDiscount(quantity){
const rates = [
    {limit: 50, rate:0.25},//0.25
    {limit: 100, rate:0.50},
    {limit: 300, rate:0.75},
    {limit: 500, rate:1},
    {limit: 1000, rate:1.25},
];
const rate = rates.find(slab => quantity <= slab.limit).rate;

return quantity*rate;
}





 function calculateInterestCredit(days){
    const rates = [
        {limit:0, rate:0},//0.50
        {limit: 5, rate:0.50},
        {limit: 10, rate:1},
        {limit: 15, rate:1.50},
        {limit: 20, rate:2},
        {limit: 25, rate:2.50},
        {limit: 30, rate:3},
    ];
    const rate = rates.find(slab => days <= slab.limit).rate;
    return days*rate;
    }

    module.exports = { calculateInterestCredit,calculateDiscount };

