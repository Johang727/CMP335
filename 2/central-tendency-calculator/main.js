function validateANDadd() {
    // place the values in the form into variables
    const range_lower_container = document.forms["myForm"]["range_lower"];
    const range_upper_container = document.forms["myForm"]["range_upper"];

    const range_lower = +range_lower_container.value;
    const range_upper = +range_upper_container.value;

    const new_number = +document.forms["myForm"]["num_to_add"].value;

    // due to how js was interpretting these values, i needed to add + before it to force it to think of them as numbers, rather than strings
    // 2 > 100 for example
    
    // validate that something was entered as a word
    if (new_number == "") {
        // no number was entered
        alert("Please enter a number!");
        return false;
    }
    if ((range_lower == "") || (range_upper == "")) {
        alert("One of the ranges is empty!");
        return false;
    }
    // validate if the number is in the range specified
    else if ((new_number < range_lower) || (new_number > range_upper)) {
        // number is too big or too small
        alert(`Please enter a value in between ${range_lower} - ${range_upper}`);
        return false;
    }
    else {
        // everything is valid, therefore disallow modification of the ranges then add to the list.
        range_lower_container.setAttribute("disabled", "");
        range_upper_container.setAttribute("disabled", "");

        const num_list_ref = document.getElementById("num_list");
        (num_list_ref.insertRow(num_list_ref.rows.length)).innerHTML = new_number;
    }

        // obtain numbers from table

        const cells = document.querySelectorAll("#num_list tr")
        const num_list_ref = document.getElementById("num_list");

        // same + used to explicitly state as int
        let nums = Array.from(cells, cell => +cell.textContent.trim());

        //console.log(nums);

        // calculate mean
        let sum = 0;
        for (let i = 0; i < nums.length; i++) {
            //console.log(nums[i]);
            sum += nums[i];
        }
        const mean = (sum / nums.length);

        //console.log(mean);

        const mean_container = document.getElementById("mean_container");
        mean_container.innerHTML = mean; 

        // calculate median
        nums.sort(function(a, b) {
            return a - b;
        });
        console.log(nums);

        let median; // define median here so it can be used later

        // number count is even
        if (nums.length % 2 == 0) {
            const nums_to_remove = (nums.length - 2) / 2;
            let med_nums = nums.slice(nums_to_remove, nums.length - nums_to_remove);
            median = (med_nums[0] + med_nums[1]) / 2;
        } else {
            // number count is odd
            const nums_to_remove = (nums.length - 1) / 2;
            let med_nums = nums.slice(nums_to_remove, nums.length - nums_to_remove);
            median = med_nums[0];
        }

        const median_container = document.getElementById("median_container");
        median_container.innerHTML = median; 


        // get mode
        let modes = new Map();

        // count how many times each number appears
        for (let i = 0; i < nums.length; i++) {
            modes.set(nums[i], (modes.get(nums[i]) ?? 0) + 1); // gets the value, else returns 0 then increments it
        }
        
        // calculate the highest number
        let max_count = 0;
        for (let [key, value] of modes) {
            // console.log(`Key: ${key}, Value: ${value}`)

            if (value > max_count) {
                max_count = value;
            }
        }

        // determine which ones are the most frequent
        let mode_array = [];
        for (let [key, value] of modes) {

            if (value == max_count) {
                mode_array.push(key);
            }
        }

        //console.log(mode_array)

        const mode_container = document.getElementById("mode_container");
        mode_container.innerHTML = mode_array.toString().replaceAll("[]", "").replaceAll(",", ", "); 

        // automatically clear the number field.
        document.forms["myForm"]["num_to_add"].value = "";
        return true;
}

function clear_and_unlock() {
    const confirmation = confirm("Are you sure you want to clear the list?");

    if (confirmation) {
        // clear all rows in the table
        const num_list_ref = document.getElementById("num_list");
        num_list_ref.innerHTML = "";

        // unlock ranges
        const range_lower_container = document.forms["myForm"]["range_lower"];
        const range_upper_container = document.forms["myForm"]["range_upper"];

        range_lower_container.removeAttribute("disabled");
        range_upper_container.removeAttribute("disabled");

        // clear calculations
        const mean_container = document.getElementById("mean_container");
        mean_container.innerHTML = ""; 
    }


}

