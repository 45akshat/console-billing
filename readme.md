# scan qr to get customer id. 
- basically doc id of that customer. 
- ek qr machine lena hai 

# location from the software login 
- log it in the database when making bill


# app price is different normal price is different. 


# give 2 options one with qr and second with mobile number. 
- you cant use wallet with mobile number. 

# take birthday in the app itself. 

# Pc or Ps 

# which game 

# pull out any franchise and its software .... 🔴

# cash in hand logs ....
- cash in hand 🔴
- expenses
- collection of the day
- weekly or monthly report 
- export to excel 🔴


PC or PS selected check.
wallet issue. 

-- pricing according to each location 🔴


# edit bill for specific franchise and admins 

# whatsapp automation ...
- bill message 
- pan india official whatsapp api
- leadsrock offers

# per customer invoice 

# give data access for store/branch manager ...

aditya - franchise owner
head office
zonal manager
staff 





        // Handle form submission
        document.getElementById('sessionForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            let customers = [];
            let totalPrice = 0;
            const platform = document.getElementById("platformInput").value



            for (let i = 0; i < customerCount; i++) {
                customers.push({
                    name: formData.get(`customers[${i}][name]`),
                    sessionDuration: parseFloat(formData.get(`customers[${i}][sessionDuration]`))
                });
            }

            console.log("Form Data:", formData);
            console.log("Customers:", customers);


            let timeframe = 0.5; // 0.5-hour blocks
            let activeCustomers = {}; // To track active customers during each time block

            // Loop through each customer and calculate their active session time
            customers.forEach(customer => {
                let sessionTime = customer.sessionDuration;

                // Split customer session into 0.5 hour blocks and record active customers for each block
                for (let i = 0; i < sessionTime; i += timeframe) {
                    let currentBlock = i + timeframe;  // Represents the end of each block (e.g., 0.5, 1.0, etc.)

                    // Store the active customer in the appropriate block
                    if (!activeCustomers[currentBlock]) {
                        activeCustomers[currentBlock] = [];
                    }

                    activeCustomers[currentBlock].push(customer.name);
                }
            });

            console.log(activeCustomers);


            // Loop to log active customers for each time block
            for (let block in activeCustomers) {
                totalPrice += ps_pricing['members'][`${activeCustomers[block].length}_players`] * activeCustomers[block].length * 0.5
                document.getElementsByName('totalPrice')[0].value = totalPrice
            }


        });




Discount in invoice.
Discount in direct figures & percent. 
15mins sessions as well. manual input 🔴
online total of the day on dashboard 🔴 
start to end in dashboard
franchise/branch manger login
edit bill
qr integration
hide sales figures/animation of console.
bugs & fixes